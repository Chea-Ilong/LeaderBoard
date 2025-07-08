import { useState, useEffect, useCallback } from 'react';
import { 
  LeaderboardEntry, 
  TeamEntry, 
  GroupEntry, 
  OverallEntry,
  LeaderboardResponse,
  LeaderboardFilters 
} from '@/types/leaderboard';

interface UseLeaderboardDataProps {
  type: 'individual' | 'team' | 'overall' | 'group';
  round?: number;
  filters?: LeaderboardFilters;
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
}

interface LeaderboardDataState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  totalCount: number;
  hasMore: boolean;
}

export function useLeaderboardData<T = LeaderboardEntry>({
  type,
  round = 1,
  filters = { search: '', group: '', participantsPerPage: 50 },
  autoRefresh = false,
  refreshInterval = 30000 // 30 seconds
}: UseLeaderboardDataProps) {
  const [state, setState] = useState<LeaderboardDataState<T>>({
    data: [],
    loading: true,
    error: null,
    lastUpdated: null,
    totalCount: 0,
    hasMore: false
  });

  const fetchData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const params = new URLSearchParams({
        type,
        ...(type === 'individual' && { round: round.toString() }),
        search: filters.search || '',
        group: filters.group || '',
        participantsPerPage: filters.participantsPerPage?.toString() || '50'
      });

      const response = await fetch(`/api/leaderboard?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch data');
      }

      setState({
        data: result.data || [],
        loading: false,
        error: null,
        lastUpdated: result.timestamp,
        totalCount: result.totalCount || 0,
        hasMore: result.hasMore || false
      });

    } catch (error) {
      console.error('Failed to fetch leaderboard data:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  }, [type, round, filters.search, filters.group, filters.participantsPerPage]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchData]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    refresh
  };
}

// Specialized hooks for different data types
export function useIndividualLeaderboard(round: number, filters?: LeaderboardFilters) {
  return useLeaderboardData<LeaderboardEntry>({
    type: 'individual',
    round,
    filters
  });
}

export function useTeamLeaderboard(filters?: LeaderboardFilters) {
  return useLeaderboardData<TeamEntry>({
    type: 'team',
    filters
  });
}

export function useOverallLeaderboard(filters?: LeaderboardFilters) {
  return useLeaderboardData<OverallEntry>({
    type: 'overall',
    filters
  });
}

export function useGroupLeaderboard(filters?: LeaderboardFilters) {
  return useLeaderboardData<GroupEntry>({
    type: 'group',
    filters
  });
}

// Hook for API configuration and testing
export function useApiConfig() {
  const [config, setConfig] = useState<{
    useMockData: boolean;
    hasApiToken: boolean;
    hasApiUrls: boolean;
  } | null>(null);
  
  const [testResults, setTestResults] = useState<{
    hackerrank: { success: boolean; message: string };
    firebase: { success: boolean; message: string };
  } | null>(null);
  
  const [loading, setLoading] = useState(false);

  const getConfig = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get-config' })
      });

      const result = await response.json();
      if (result.success) {
        setConfig(result.data);
      }
    } catch (error) {
      console.error('Failed to get config:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const testConnections = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test-connections' })
      });

      const result = await response.json();
      if (result.success) {
        setTestResults(result.data);
      }
    } catch (error) {
      console.error('Failed to test connections:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const switchMode = useCallback(async (useMockData: boolean) => {
    try {
      setLoading(true);
      const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'switch-mode', useMockData })
      });

      const result = await response.json();
      if (result.success) {
        // Refresh config after switching
        await getConfig();
      }
    } catch (error) {
      console.error('Failed to switch mode:', error);
    } finally {
      setLoading(false);
    }
  }, [getConfig]);

  useEffect(() => {
    getConfig();
  }, [getConfig]);

  return {
    config,
    testResults,
    loading,
    getConfig,
    testConnections,
    switchMode
  };
}

// Hook for data statistics
export function useDataStatistics() {
  const [stats, setStats] = useState<{
    totalParticipants: number;
    totalTeams: number;
    totalGroups: number;
    averageRound1Score: number;
    averageRound2Score: number;
    topScore: number;
    groupDistribution: Record<string, number>;
  } | null>(null);
  
  const [loading, setLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      // This would be implemented as a separate API endpoint
      // For now, we can derive stats from the leaderboard data
      const [round1Response, groupResponse] = await Promise.all([
        fetch('/api/leaderboard?type=individual&round=1'),
        fetch('/api/leaderboard?type=group')
      ]);

      const round1Data = await round1Response.json();
      const groupData = await groupResponse.json();

      if (round1Data.success && groupData.success) {
        const participants = round1Data.data;
        const groups = groupData.data;

        setStats({
          totalParticipants: participants.length,
          totalTeams: Math.floor(participants.length / 2),
          totalGroups: groups.length,
          averageRound1Score: Math.round(
            participants.reduce((sum: number, p: any) => sum + p.totalPoints, 0) / participants.length
          ),
          averageRound2Score: 0, // Would need round 2 data
          topScore: Math.max(...participants.map((p: any) => p.totalPoints)),
          groupDistribution: groups.reduce((acc: any, group: any) => {
            acc[group.groupId] = group.memberCount;
            return acc;
          }, {})
        });
      }
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    refresh: fetchStats
  };
}
