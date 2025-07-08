import { 
  LeaderboardEntry, 
  TeamEntry, 
  GroupEntry, 
  OverallEntry,
  ParticipantData,
  LeaderboardResponse 
} from '@/types/leaderboard';
import { participantLoader } from './participant-data-loader';
import { participantProcessor } from './participant-data-processor';
import { mockDataGenerator } from './mock-data-generator';
import { dataService } from './data-service';
import { cacheManager } from './cache-manager';

/**
 * Test utilities for validating the CFCC competition data system
 */

export interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  details?: any;
  duration?: number;
}

export interface TestSuite {
  name: string;
  tests: TestResult[];
  passed: boolean;
  totalTests: number;
  passedTests: number;
  duration: number;
}

export class TestRunner {
  private results: TestSuite[] = [];

  /**
   * Run all tests
   */
  public async runAllTests(): Promise<TestSuite[]> {
    console.log('🧪 Starting CFCC Data System Tests...');
    
    this.results = [];
    
    // Run test suites
    await this.runParticipantDataTests();
    await this.runMockDataGenerationTests();
    await this.runDataServiceTests();
    await this.runCacheTests();
    await this.runIntegrationTests();
    
    // Print summary
    this.printTestSummary();
    
    return this.results;
  }

  /**
   * Test participant data loading and processing
   */
  private async runParticipantDataTests(): Promise<void> {
    const suite: TestSuite = {
      name: 'Participant Data Tests',
      tests: [],
      passed: false,
      totalTests: 0,
      passedTests: 0,
      duration: 0
    };

    const startTime = Date.now();

    // Test 1: Load participant data
    suite.tests.push(await this.runTest('Load participant data', async () => {
      const participants = await participantLoader.loadParticipantData();
      if (participants.length === 0) {
        throw new Error('No participants loaded');
      }
      if (participants.length !== 156) {
        throw new Error(`Expected 156 participants, got ${participants.length}`);
      }
      return { participantCount: participants.length };
    }));

    // Test 2: Validate participant data structure
    suite.tests.push(await this.runTest('Validate participant data structure', async () => {
      const participants = await participantLoader.loadParticipantData();
      const validation = participantProcessor.validateParticipantData(participants);
      
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }
      
      return { 
        errors: validation.errors.length,
        warnings: validation.warnings.length 
      };
    }));

    // Test 3: Check group distribution
    suite.tests.push(await this.runTest('Check group distribution', async () => {
      const participants = await participantLoader.loadParticipantData();
      const stats = participantProcessor.getDataStatistics(participants);
      
      // Should have participants in groups 1-10
      const expectedGroups = Array.from({ length: 10 }, (_, i) => i + 1);
      const actualGroups = Object.keys(stats.groupDistribution).map(Number);
      
      for (const group of expectedGroups) {
        if (!actualGroups.includes(group)) {
          throw new Error(`Missing participants in group ${group}`);
        }
      }
      
      return { groupDistribution: stats.groupDistribution };
    }));

    // Test 4: Transform to leaderboard entries
    suite.tests.push(await this.runTest('Transform to leaderboard entries', async () => {
      const participants = await participantLoader.loadParticipantData();
      const entries = participantProcessor.transformToLeaderboardEntries(participants);
      
      if (entries.length !== participants.length) {
        throw new Error('Transformation count mismatch');
      }
      
      // Check required fields
      for (const entry of entries.slice(0, 5)) {
        if (!entry.fullName || !entry.hackerRankId || !entry.group) {
          throw new Error('Missing required fields in transformed entry');
        }
        if (!Array.isArray(entry.scores) || entry.scores.length !== 6) {
          throw new Error('Invalid scores array');
        }
      }
      
      return { transformedCount: entries.length };
    }));

    suite.duration = Date.now() - startTime;
    suite.totalTests = suite.tests.length;
    suite.passedTests = suite.tests.filter(t => t.passed).length;
    suite.passed = suite.passedTests === suite.totalTests;
    
    this.results.push(suite);
  }

  /**
   * Test mock data generation
   */
  private async runMockDataGenerationTests(): Promise<void> {
    const suite: TestSuite = {
      name: 'Mock Data Generation Tests',
      tests: [],
      passed: false,
      totalTests: 0,
      passedTests: 0,
      duration: 0
    };

    const startTime = Date.now();

    // Test 1: Generate all mock data
    suite.tests.push(await this.runTest('Generate all mock data', async () => {
      const data = await mockDataGenerator.generateAllMockData();
      
      if (!data.round1 || !data.round2 || !data.team || !data.overall || !data.groups) {
        throw new Error('Missing data categories');
      }
      
      return {
        round1Count: data.round1.length,
        round2Count: data.round2.length,
        teamCount: data.team.length,
        overallCount: data.overall.length,
        groupCount: data.groups.length
      };
    }));

    // Test 2: Validate round data consistency
    suite.tests.push(await this.runTest('Validate round data consistency', async () => {
      const data = await mockDataGenerator.generateAllMockData();
      
      if (data.round1.length !== data.round2.length) {
        throw new Error('Round 1 and Round 2 participant counts do not match');
      }
      
      // Check that same participants exist in both rounds
      const round1Ids = new Set(data.round1.map(p => p.hackerRankId));
      const round2Ids = new Set(data.round2.map(p => p.hackerRankId));
      
      for (const id of round1Ids) {
        if (!round2Ids.has(id)) {
          throw new Error(`Participant ${id} missing from Round 2`);
        }
      }
      
      return { consistentParticipants: round1Ids.size };
    }));

    // Test 3: Validate team generation
    suite.tests.push(await this.runTest('Validate team generation', async () => {
      const data = await mockDataGenerator.generateAllMockData();
      
      // Teams should be roughly half the number of participants
      const expectedTeamCount = Math.floor(data.round1.length / 2);
      if (Math.abs(data.team.length - expectedTeamCount) > 2) {
        throw new Error(`Unexpected team count: expected ~${expectedTeamCount}, got ${data.team.length}`);
      }
      
      // Check team structure
      for (const team of data.team.slice(0, 3)) {
        if (!team.member1 || !team.member2) {
          throw new Error('Team missing members');
        }
        if (!team.teamName || team.rank === undefined) {
          throw new Error('Team missing required fields');
        }
      }
      
      return { teamCount: data.team.length };
    }));

    // Test 4: Validate rankings
    suite.tests.push(await this.runTest('Validate rankings', async () => {
      const data = await mockDataGenerator.generateAllMockData();
      
      // Check that rankings are sequential and start from 1
      const checkRankings = (entries: any[], name: string) => {
        for (let i = 0; i < entries.length; i++) {
          if (entries[i].rank !== i + 1) {
            throw new Error(`${name} ranking error at position ${i}: expected ${i + 1}, got ${entries[i].rank}`);
          }
        }
      };
      
      checkRankings(data.round1, 'Round 1');
      checkRankings(data.round2, 'Round 2');
      checkRankings(data.team, 'Team');
      checkRankings(data.overall, 'Overall');
      checkRankings(data.groups, 'Group');
      
      return { validatedCategories: 5 };
    }));

    suite.duration = Date.now() - startTime;
    suite.totalTests = suite.tests.length;
    suite.passedTests = suite.tests.filter(t => t.passed).length;
    suite.passed = suite.passedTests === suite.totalTests;
    
    this.results.push(suite);
  }

  /**
   * Test data service functionality
   */
  private async runDataServiceTests(): Promise<void> {
    const suite: TestSuite = {
      name: 'Data Service Tests',
      tests: [],
      passed: false,
      totalTests: 0,
      passedTests: 0,
      duration: 0
    };

    const startTime = Date.now();

    // Test 1: Get leaderboard data
    suite.tests.push(await this.runTest('Get leaderboard data', async () => {
      const response = await dataService.getLeaderboardData(1);
      
      if (!response.success) {
        throw new Error(`API call failed: ${response.error}`);
      }
      
      if (!response.data || response.data.length === 0) {
        throw new Error('No data returned');
      }
      
      return { 
        dataCount: response.data.length,
        timestamp: response.timestamp 
      };
    }));

    // Test 2: Test filtering
    suite.tests.push(await this.runTest('Test filtering', async () => {
      const response = await dataService.getLeaderboardData(1, {
        search: 'Chheng',
        group: '',
        participantsPerPage: 50
      });
      
      if (!response.success) {
        throw new Error('Filtered request failed');
      }
      
      // Should find at least one participant with "Chheng" in name
      const foundParticipant = response.data.find(p => 
        p.fullName.toLowerCase().includes('chheng')
      );
      
      if (!foundParticipant) {
        throw new Error('Search filter not working');
      }
      
      return { filteredCount: response.data.length };
    }));

    // Test 3: Get team data
    suite.tests.push(await this.runTest('Get team data', async () => {
      const teams = await dataService.getTeamData();
      
      if (!teams || teams.length === 0) {
        throw new Error('No team data returned');
      }
      
      return { teamCount: teams.length };
    }));

    // Test 4: Get configuration
    suite.tests.push(await this.runTest('Get configuration', async () => {
      const config = dataService.getConfiguration();
      
      if (typeof config.useMockData !== 'boolean') {
        throw new Error('Invalid configuration structure');
      }
      
      return config;
    }));

    suite.duration = Date.now() - startTime;
    suite.totalTests = suite.tests.length;
    suite.passedTests = suite.tests.filter(t => t.passed).length;
    suite.passed = suite.passedTests === suite.totalTests;
    
    this.results.push(suite);
  }

  /**
   * Test caching functionality
   */
  private async runCacheTests(): Promise<void> {
    const suite: TestSuite = {
      name: 'Cache Tests',
      tests: [],
      passed: false,
      totalTests: 0,
      passedTests: 0,
      duration: 0
    };

    const startTime = Date.now();

    // Test 1: Basic cache operations
    suite.tests.push(await this.runTest('Basic cache operations', async () => {
      const testKey = 'test_cache_key';
      const testData = { message: 'Hello, Cache!', timestamp: Date.now() };
      
      // Set cache
      const setResult = cacheManager.set(testKey, testData);
      if (!setResult) {
        throw new Error('Failed to set cache');
      }
      
      // Get cache
      const cachedData = cacheManager.get(testKey);
      if (!cachedData || cachedData.message !== testData.message) {
        throw new Error('Failed to retrieve cached data');
      }
      
      // Remove cache
      cacheManager.remove(testKey);
      const removedData = cacheManager.get(testKey);
      if (removedData !== null) {
        throw new Error('Failed to remove cached data');
      }
      
      return { success: true };
    }));

    // Test 2: Cache expiration
    suite.tests.push(await this.runTest('Cache expiration', async () => {
      const testKey = 'test_expiry_key';
      const testData = { message: 'Expiring data' };
      
      // Set cache with 100ms TTL
      cacheManager.set(testKey, testData, { ttl: 100 });
      
      // Should exist immediately
      if (!cacheManager.has(testKey)) {
        throw new Error('Cache not set properly');
      }
      
      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Should be expired
      if (cacheManager.has(testKey)) {
        throw new Error('Cache did not expire');
      }
      
      return { success: true };
    }));

    suite.duration = Date.now() - startTime;
    suite.totalTests = suite.tests.length;
    suite.passedTests = suite.tests.filter(t => t.passed).length;
    suite.passed = suite.passedTests === suite.totalTests;
    
    this.results.push(suite);
  }

  /**
   * Test integration scenarios
   */
  private async runIntegrationTests(): Promise<void> {
    const suite: TestSuite = {
      name: 'Integration Tests',
      tests: [],
      passed: false,
      totalTests: 0,
      passedTests: 0,
      duration: 0
    };

    const startTime = Date.now();

    // Test 1: End-to-end data flow
    suite.tests.push(await this.runTest('End-to-end data flow', async () => {
      // Clear cache to ensure fresh data
      cacheManager.clearAll();
      
      // Load participants -> Generate mock data -> Get via service
      const participants = await participantLoader.loadParticipantData();
      const mockData = await mockDataGenerator.generateAllMockData();
      const serviceData = await dataService.getLeaderboardData(1);
      
      if (!serviceData.success) {
        throw new Error('Service data retrieval failed');
      }
      
      // Data should be consistent
      if (serviceData.data.length !== participants.length) {
        throw new Error('Data count inconsistency in flow');
      }
      
      return {
        participantsLoaded: participants.length,
        mockDataGenerated: mockData.round1.length,
        serviceDataReturned: serviceData.data.length
      };
    }));

    // Test 2: Performance test
    suite.tests.push(await this.runTest('Performance test', async () => {
      const iterations = 5;
      const times: number[] = [];
      
      for (let i = 0; i < iterations; i++) {
        const start = Date.now();
        await dataService.getLeaderboardData(1);
        times.push(Date.now() - start);
      }
      
      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      
      // Should be reasonably fast (under 1 second on average)
      if (avgTime > 1000) {
        throw new Error(`Performance too slow: ${avgTime}ms average`);
      }
      
      return {
        averageTime: Math.round(avgTime),
        iterations,
        times
      };
    }));

    suite.duration = Date.now() - startTime;
    suite.totalTests = suite.tests.length;
    suite.passedTests = suite.tests.filter(t => t.passed).length;
    suite.passed = suite.passedTests === suite.totalTests;
    
    this.results.push(suite);
  }

  /**
   * Run a single test with error handling
   */
  private async runTest(name: string, testFn: () => Promise<any>): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      const result = await testFn();
      const duration = Date.now() - startTime;
      
      return {
        name,
        passed: true,
        message: 'Test passed',
        details: result,
        duration
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      
      return {
        name,
        passed: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        duration
      };
    }
  }

  /**
   * Print test summary to console
   */
  private printTestSummary(): void {
    console.log('\n📊 Test Summary:');
    console.log('================');
    
    let totalTests = 0;
    let totalPassed = 0;
    
    for (const suite of this.results) {
      const status = suite.passed ? '✅' : '❌';
      console.log(`${status} ${suite.name}: ${suite.passedTests}/${suite.totalTests} passed (${suite.duration}ms)`);
      
      totalTests += suite.totalTests;
      totalPassed += suite.passedTests;
      
      // Show failed tests
      const failedTests = suite.tests.filter(t => !t.passed);
      if (failedTests.length > 0) {
        for (const test of failedTests) {
          console.log(`   ❌ ${test.name}: ${test.message}`);
        }
      }
    }
    
    console.log('================');
    console.log(`Overall: ${totalPassed}/${totalTests} tests passed`);
    
    if (totalPassed === totalTests) {
      console.log('🎉 All tests passed! System is ready for production.');
    } else {
      console.log('⚠️  Some tests failed. Please review and fix issues.');
    }
  }

  /**
   * Get test results
   */
  public getResults(): TestSuite[] {
    return this.results;
  }
}

// Export singleton instance
export const testRunner = new TestRunner();
