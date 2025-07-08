/**
 * Cache Manager for CFCC Competition Data
 * Handles localStorage and sessionStorage caching with fallbacks
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  version: string;
  expiresAt?: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  storage?: 'localStorage' | 'sessionStorage';
  version?: string;
}

export class CacheManager {
  private static instance: CacheManager;
  private readonly prefix = 'cfcc_';
  private readonly defaultTTL = 24 * 60 * 60 * 1000; // 24 hours
  private readonly defaultVersion = '1.0';

  private constructor() {}

  public static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  /**
   * Get storage object based on options
   */
  private getStorage(storageType: 'localStorage' | 'sessionStorage' = 'localStorage'): Storage | null {
    try {
      if (typeof window === 'undefined') return null;
      return storageType === 'localStorage' ? localStorage : sessionStorage;
    } catch (error) {
      console.warn(`${storageType} is not available:`, error);
      return null;
    }
  }

  /**
   * Generate cache key with prefix
   */
  private getCacheKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * Set data in cache
   */
  public set<T>(
    key: string, 
    data: T, 
    options: CacheOptions = {}
  ): boolean {
    try {
      const storage = this.getStorage(options.storage);
      if (!storage) return false;

      const ttl = options.ttl || this.defaultTTL;
      const version = options.version || this.defaultVersion;
      const expiresAt = Date.now() + ttl;

      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        version,
        expiresAt
      };

      const cacheKey = this.getCacheKey(key);
      storage.setItem(cacheKey, JSON.stringify(cacheItem));
      
      return true;
    } catch (error) {
      console.warn(`Failed to set cache for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Get data from cache
   */
  public get<T>(
    key: string, 
    options: CacheOptions = {}
  ): T | null {
    try {
      const storage = this.getStorage(options.storage);
      if (!storage) return null;

      const cacheKey = this.getCacheKey(key);
      const cached = storage.getItem(cacheKey);
      
      if (!cached) return null;

      const cacheItem: CacheItem<T> = JSON.parse(cached);
      
      // Check version compatibility
      const expectedVersion = options.version || this.defaultVersion;
      if (cacheItem.version !== expectedVersion) {
        this.remove(key, options);
        return null;
      }

      // Check expiration
      if (cacheItem.expiresAt && Date.now() > cacheItem.expiresAt) {
        this.remove(key, options);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.warn(`Failed to get cache for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Remove data from cache
   */
  public remove(
    key: string, 
    options: CacheOptions = {}
  ): boolean {
    try {
      const storage = this.getStorage(options.storage);
      if (!storage) return false;

      const cacheKey = this.getCacheKey(key);
      storage.removeItem(cacheKey);
      
      return true;
    } catch (error) {
      console.warn(`Failed to remove cache for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Check if cache exists and is valid
   */
  public has(
    key: string, 
    options: CacheOptions = {}
  ): boolean {
    return this.get(key, options) !== null;
  }

  /**
   * Clear all cache with the prefix
   */
  public clearAll(storageType: 'localStorage' | 'sessionStorage' = 'localStorage'): boolean {
    try {
      const storage = this.getStorage(storageType);
      if (!storage) return false;

      const keysToRemove: string[] = [];
      
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => storage.removeItem(key));
      
      return true;
    } catch (error) {
      console.warn('Failed to clear all cache:', error);
      return false;
    }
  }

  /**
   * Get cache statistics
   */
  public getStats(storageType: 'localStorage' | 'sessionStorage' = 'localStorage'): {
    totalItems: number;
    totalSize: number;
    items: Array<{
      key: string;
      size: number;
      timestamp: number;
      expiresAt?: number;
    }>;
  } {
    const stats = {
      totalItems: 0,
      totalSize: 0,
      items: [] as Array<{
        key: string;
        size: number;
        timestamp: number;
        expiresAt?: number;
      }>
    };

    try {
      const storage = this.getStorage(storageType);
      if (!storage) return stats;

      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key && key.startsWith(this.prefix)) {
          const value = storage.getItem(key);
          if (value) {
            const size = new Blob([value]).size;
            stats.totalItems++;
            stats.totalSize += size;

            try {
              const cacheItem = JSON.parse(value);
              stats.items.push({
                key: key.replace(this.prefix, ''),
                size,
                timestamp: cacheItem.timestamp,
                expiresAt: cacheItem.expiresAt
              });
            } catch (error) {
              // Invalid JSON, still count the item
              stats.items.push({
                key: key.replace(this.prefix, ''),
                size,
                timestamp: 0
              });
            }
          }
        }
      }
    } catch (error) {
      console.warn('Failed to get cache stats:', error);
    }

    return stats;
  }

  /**
   * Clean expired cache items
   */
  public cleanExpired(storageType: 'localStorage' | 'sessionStorage' = 'localStorage'): number {
    let cleanedCount = 0;

    try {
      const storage = this.getStorage(storageType);
      if (!storage) return cleanedCount;

      const keysToRemove: string[] = [];
      const now = Date.now();

      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key && key.startsWith(this.prefix)) {
          const value = storage.getItem(key);
          if (value) {
            try {
              const cacheItem = JSON.parse(value);
              if (cacheItem.expiresAt && now > cacheItem.expiresAt) {
                keysToRemove.push(key);
              }
            } catch (error) {
              // Invalid JSON, remove it
              keysToRemove.push(key);
            }
          }
        }
      }

      keysToRemove.forEach(key => {
        storage.removeItem(key);
        cleanedCount++;
      });

    } catch (error) {
      console.warn('Failed to clean expired cache:', error);
    }

    return cleanedCount;
  }

  /**
   * Get or set with a factory function
   */
  public async getOrSet<T>(
    key: string,
    factory: () => Promise<T> | T,
    options: CacheOptions = {}
  ): Promise<T> {
    // Try to get from cache first
    const cached = this.get<T>(key, options);
    if (cached !== null) {
      return cached;
    }

    // Generate new data
    const data = await factory();
    
    // Store in cache
    this.set(key, data, options);
    
    return data;
  }

  /**
   * Batch operations
   */
  public setBatch<T>(
    items: Array<{ key: string; data: T; options?: CacheOptions }>,
    defaultOptions: CacheOptions = {}
  ): boolean[] {
    return items.map(item => 
      this.set(item.key, item.data, { ...defaultOptions, ...item.options })
    );
  }

  public getBatch<T>(
    keys: string[],
    options: CacheOptions = {}
  ): Array<{ key: string; data: T | null }> {
    return keys.map(key => ({
      key,
      data: this.get<T>(key, options)
    }));
  }
}

// Export singleton instance
export const cacheManager = CacheManager.getInstance();

// Specific cache keys for CFCC data
export const CACHE_KEYS = {
  MOCK_DATA: 'mockData',
  PARTICIPANT_DATA: 'participantData',
  LEADERBOARD_ROUND1: 'leaderboard_round1',
  LEADERBOARD_ROUND2: 'leaderboard_round2',
  TEAM_DATA: 'teamData',
  OVERALL_DATA: 'overallData',
  GROUP_DATA: 'groupData',
  API_CONFIG: 'apiConfig',
  USER_PREFERENCES: 'userPreferences'
} as const;
