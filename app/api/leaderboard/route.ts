import { NextRequest, NextResponse } from 'next/server';
import { dataService } from '@/lib/data-service';
import { LeaderboardFilters } from '@/types/leaderboard';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const round = parseInt(searchParams.get('round') || '1');
    const type = searchParams.get('type') || 'individual'; // individual, team, overall, group
    const search = searchParams.get('search') || '';
    const group = searchParams.get('group') || '';
    const participantsPerPage = parseInt(searchParams.get('participantsPerPage') || '50');

    // Create filters object
    const filters: LeaderboardFilters = {
      search,
      group,
      participantsPerPage
    };

    let data;
    
    switch (type) {
      case 'individual':
        const response = await dataService.getLeaderboardData(round, filters);
        return NextResponse.json(response);
        
      case 'team':
        data = await dataService.getTeamData(filters);
        return NextResponse.json({
          success: true,
          type: 'team',
          data: data,
          timestamp: new Date().toISOString(),
          totalCount: data.length,
          hasMore: false
        });
        
      case 'overall':
        data = await dataService.getOverallData(filters);
        return NextResponse.json({
          success: true,
          type: 'overall',
          data: data,
          timestamp: new Date().toISOString(),
          totalCount: data.length,
          hasMore: false
        });
        
      case 'group':
        data = await dataService.getGroupData(filters);
        return NextResponse.json({
          success: true,
          type: 'group',
          data: data,
          timestamp: new Date().toISOString(),
          totalCount: data.length,
          hasMore: false
        });
        
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid leaderboard type' },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Handle POST requests for testing or data updates
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (body.action === 'test-connections') {
      const results = await dataService.testApiConnections();
      return NextResponse.json({
        success: true,
        data: results,
        timestamp: new Date().toISOString()
      });
    }
    
    if (body.action === 'get-config') {
      const config = dataService.getConfiguration();
      return NextResponse.json({
        success: true,
        data: config,
        timestamp: new Date().toISOString()
      });
    }
    
    if (body.action === 'switch-mode') {
      const useMock = body.useMockData === true;
      dataService.setUseMockData(useMock);
      return NextResponse.json({
        success: true,
        message: `Switched to ${useMock ? 'mock' : 'real'} data mode`,
        timestamp: new Date().toISOString()
      });
    }
    
    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('API POST Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
