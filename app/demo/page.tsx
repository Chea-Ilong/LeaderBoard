"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useIndividualLeaderboard, useTeamLeaderboard, useOverallLeaderboard, useGroupLeaderboard, useApiConfig, useDataStatistics } from '@/hooks/use-leaderboard-data';

export default function DemoPage() {
  const [selectedRound, setSelectedRound] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');

  // API Configuration
  const { config, testResults, loading: configLoading, testConnections, switchMode } = useApiConfig();
  
  // Data Statistics
  const { stats, loading: statsLoading } = useDataStatistics();

  // Leaderboard Data
  const { data: round1Data, loading: round1Loading, error: round1Error } = useIndividualLeaderboard(1, {
    search: searchTerm,
    group: selectedGroup,
    participantsPerPage: 10
  });

  const { data: teamData, loading: teamLoading } = useTeamLeaderboard();
  const { data: overallData, loading: overallLoading } = useOverallLeaderboard();
  const { data: groupData, loading: groupLoading } = useGroupLeaderboard();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">CFCC Competition Demo</h1>
        <p className="text-muted-foreground">
          Testing the new participant data integration system
        </p>
      </div>

      {/* API Configuration Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Configuration</CardTitle>
          <CardDescription>Current API and data source configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {configLoading ? (
            <LoadingSpinner />
          ) : config ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <span>Data Source:</span>
                <Badge variant={config.useMockData ? "secondary" : "default"}>
                  {config.useMockData ? "Mock Data" : "Real API"}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <span>API Token:</span>
                <Badge variant={config.hasApiToken ? "default" : "destructive"}>
                  {config.hasApiToken ? "Configured" : "Missing"}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <span>API URLs:</span>
                <Badge variant={config.hasApiUrls ? "default" : "destructive"}>
                  {config.hasApiUrls ? "Configured" : "Missing"}
                </Badge>
              </div>
            </div>
          ) : null}
          
          <div className="flex space-x-2">
            <Button onClick={testConnections} disabled={configLoading}>
              Test API Connections
            </Button>
            <Button 
              onClick={() => switchMode(!config?.useMockData)} 
              disabled={configLoading}
              variant="outline"
            >
              Switch to {config?.useMockData ? "Real" : "Mock"} Data
            </Button>
          </div>

          {testResults && (
            <div className="space-y-2">
              <h4 className="font-semibold">Connection Test Results:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Badge variant={testResults.hackerrank.success ? "default" : "destructive"}>
                    HackerRank API
                  </Badge>
                  <span className="text-sm">{testResults.hackerrank.message}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={testResults.firebase.success ? "default" : "destructive"}>
                    Firebase
                  </Badge>
                  <span className="text-sm">{testResults.firebase.message}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Competition Statistics</CardTitle>
          <CardDescription>Overview of participant data and scores</CardDescription>
        </CardHeader>
        <CardContent>
          {statsLoading ? (
            <LoadingSpinner />
          ) : stats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.totalParticipants}</div>
                <div className="text-sm text-muted-foreground">Participants</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.totalGroups}</div>
                <div className="text-sm text-muted-foreground">Groups</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.averageRound1Score}</div>
                <div className="text-sm text-muted-foreground">Avg Round 1</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.topScore}</div>
                <div className="text-sm text-muted-foreground">Top Score</div>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search participants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger>
                <SelectValue placeholder="Select group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Groups</SelectItem>
                {Array.from({ length: 10 }, (_, i) => (
                  <SelectItem key={i + 1} value={`G${i + 1}`}>
                    Group {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedRound.toString()} onValueChange={(value) => setSelectedRound(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select round" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Round 1</SelectItem>
                <SelectItem value="2">Round 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard Data */}
      <Tabs defaultValue="individual" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="individual">Individual</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="overall">Overall</TabsTrigger>
          <TabsTrigger value="group">Group</TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Individual Leaderboard - Round {selectedRound}</CardTitle>
              <CardDescription>
                {round1Error ? `Error: ${round1Error}` : `Showing ${round1Data.length} participants`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {round1Loading ? (
                <LoadingSpinner />
              ) : round1Error ? (
                <div className="text-red-500">Failed to load data: {round1Error}</div>
              ) : (
                <div className="space-y-2">
                  {round1Data.slice(0, 10).map((participant, index) => (
                    <div key={participant.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">#{participant.rank}</Badge>
                        <div>
                          <div className="font-semibold">{participant.fullName}</div>
                          <div className="text-sm text-muted-foreground">
                            {participant.hackerRankId} • {participant.group}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{participant.totalPoints} pts</div>
                        <div className="text-sm text-muted-foreground">
                          Bonus: {participant.bonus || 0} • Energizer: {participant.energizer || 0}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Leaderboard</CardTitle>
              <CardDescription>Showing {teamData.length} teams</CardDescription>
            </CardHeader>
            <CardContent>
              {teamLoading ? (
                <LoadingSpinner />
              ) : (
                <div className="space-y-2">
                  {teamData.slice(0, 5).map((team) => (
                    <div key={team.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">#{team.rank}</Badge>
                          <span className="font-semibold">{team.teamName}</span>
                        </div>
                        <div className="font-bold">{team.totalPoints} pts</div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {team.member1.fullName} & {team.member2.fullName}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overall" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Overall Rankings</CardTitle>
              <CardDescription>Combined scores from all rounds</CardDescription>
            </CardHeader>
            <CardContent>
              {overallLoading ? (
                <LoadingSpinner />
              ) : (
                <div className="space-y-2">
                  {overallData.slice(0, 10).map((participant) => (
                    <div key={participant.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">#{participant.rank}</Badge>
                        <div>
                          <div className="font-semibold">{participant.fullName}</div>
                          <div className="text-sm text-muted-foreground">{participant.group}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{participant.totalPoints} pts</div>
                        <div className="text-sm text-muted-foreground">
                          R1: {participant.round1Score} • R2: {participant.round2Score} • Team: {participant.teamScore}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="group" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Group Rankings</CardTitle>
              <CardDescription>Performance by group</CardDescription>
            </CardHeader>
            <CardContent>
              {groupLoading ? (
                <LoadingSpinner />
              ) : (
                <div className="space-y-2">
                  {groupData.map((group) => (
                    <div key={group.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">#{group.rank}</Badge>
                          <span className="font-semibold">{group.groupId}</span>
                          <Badge variant="secondary">{group.memberCount} members</Badge>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{group.totalScore} pts</div>
                          <div className="text-sm text-muted-foreground">
                            Avg: {group.averageScore}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
