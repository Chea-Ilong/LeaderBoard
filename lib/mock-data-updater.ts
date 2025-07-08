import { participantProcessor } from './participant-data-processor';

// Real participant data from CSV
const REAL_PARTICIPANTS = [
    { name: 'Chheng Songheng', group: 1 },
    { name: 'Hal Monytimor', group: 1 },
    { name: 'Jim Seanghai', group: 1 },
    { name: 'Mao Chankruesna', group: 1 },
    { name: 'Meng Panhaoudom', group: 1 },
    { name: 'Mong Gekleang', group: 1 },
    { name: 'Oeuy Omrin', group: 1 },
    { name: 'Po Chanmonyneath', group: 1 },
    { name: 'Seng Dina', group: 1 },
    { name: 'Tho Vicheka', group: 1 },
    { name: 'Thong Nuphea', group: 1 },
    { name: 'Uch Mengyean', group: 1 },
    { name: 'Chann Siekfong', group: 1 },
    { name: 'Chea Kuyhong', group: 2 },
    { name: 'Dan Thidamorokat', group: 2 },
    { name: 'Hong Bonsak', group: 2 },
    { name: 'Kaing Menglay', group: 2 },
    { name: 'Kong Leak Smey', group: 2 },
    { name: 'Mai Sreynuth', group: 2 },
    { name: 'Nhem Sun Serinyuth', group: 2 },
    { name: 'Nuon Soangkeavattanak', group: 2 },
    { name: 'Phea Sreynith', group: 2 },
    { name: 'Say Sorayu', group: 2 },
    { name: 'Sereywath Rathanak', group: 2 },
    { name: 'Sin Hong', group: 2 },
    { name: 'So Channolly', group: 2 },
    { name: 'Chhen Chanthoeurn', group: 3 },
    { name: 'Deng Monyoudom', group: 3 },
    { name: 'Horn Koemhoing', group: 3 },
    { name: 'In Uddam Darren', group: 3 },
    { name: 'Lor Sophy', group: 3 },
    { name: 'Nov Sokpanha', group: 3 },
    { name: 'Sok Chingchheav', group: 3 },
    { name: 'Sokheng Mengly', group: 3 },
    { name: 'Svay Monirath', group: 3 },
    { name: 'Ly Yeak Khai', group: 3 },
    { name: 'Roeurn Sokviseth', group: 3 },
    { name: 'Born Chansothearith', group: 4 },
    { name: 'Chan Veasna', group: 4 },
    { name: 'Chao Vanchhoeurng', group: 4 },
    { name: 'Chay Senghap', group: 4 },
    { name: 'Loun Rotha', group: 4 },
    { name: 'Ly Srongchhay', group: 4 },
    { name: 'Phally Sovanratana', group: 4 },
    { name: 'Phoeurn Rozariya', group: 4 },
    { name: 'Run Chandara', group: 4 },
    { name: 'Rin Layheang', group: 4 },
    { name: 'Ron Sovanrith', group: 4 },
    { name: 'Roth Sorayuth', group: 4 },
    { name: 'Vean Sovanvirak', group: 4 },
    { name: 'Yann Sokmeng', group: 4 },
    { name: 'Yoeung Seyha', group: 4 },
    { name: 'Yun Eychhean', group: 4 },
];

/**
 * Generate mock data for a specific round using real participant names
 */
export function generateMockRoundData(round: number, participants = REAL_PARTICIPANTS) {
    return participants.map(participant => {
        const questions = participantProcessor.generateRealisticCompetitiveProgrammingScores(
            participant.name, 
            round, 
            'medium'
        );
        
        // Ensure all problems have scores (set to 0 if not attempted)
        const completeQuestions = {
            problem_1: questions.problem_1 || 0,
            problem_2: questions.problem_2 || 0,
            problem_3: questions.problem_3 || 0,
            problem_4: questions.problem_4 || 0,
            problem_5: questions.problem_5 || 0,
            problem_6: questions.problem_6 || 0,
        };
        
        const totalScore = Object.values(completeQuestions).reduce((sum, score) => sum + score, 0);
        
        return {
            fullName: participant.name,
            group: participant.group,
            questions: completeQuestions,
            totalScore,
        };
    });
}

/**
 * Generate team data from individual participants
 */
export function generateMockTeamData(participants = REAL_PARTICIPANTS) {
    const teams = [];
    
    // Create teams by pairing participants (can be from different groups)
    for (let i = 0; i < participants.length - 1; i += 2) {
        const member1 = participants[i];
        const member2 = participants[i + 1];
        
        if (member1 && member2) {
            // Generate combined team scores
            const member1Questions = participantProcessor.generateRealisticCompetitiveProgrammingScores(
                member1.name, 1, 'medium'
            );
            const member2Questions = participantProcessor.generateRealisticCompetitiveProgrammingScores(
                member2.name, 1, 'medium'
            );
            
            // Combine scores (take the better score for each problem)
            const combinedQuestions = {
                problem_1: Math.max(member1Questions.problem_1 || 0, member2Questions.problem_1 || 0),
                problem_2: Math.max(member1Questions.problem_2 || 0, member2Questions.problem_2 || 0),
                problem_3: Math.max(member1Questions.problem_3 || 0, member2Questions.problem_3 || 0),
                problem_4: Math.max(member1Questions.problem_4 || 0, member2Questions.problem_4 || 0),
                problem_5: Math.max(member1Questions.problem_5 || 0, member2Questions.problem_5 || 0),
                problem_6: Math.max(member1Questions.problem_6 || 0, member2Questions.problem_6 || 0),
            };
            
            const totalScore = Object.values(combinedQuestions).reduce((sum, score) => sum + score, 0);
            
            teams.push({
                fullNameMember1: member1.name,
                fullNameMember2: member2.name,
                questions: combinedQuestions,
                totalScore,
            });
        }
    }
    
    return teams;
}

/**
 * Generate overall data combining all rounds
 */
export function generateMockOverallData(participants = REAL_PARTICIPANTS) {
    return participants.map(participant => {
        // Generate scores for both rounds
        const round1Questions = participantProcessor.generateRealisticCompetitiveProgrammingScores(
            participant.name, 1, 'medium'
        );
        const round2Questions = participantProcessor.generateRealisticCompetitiveProgrammingScores(
            participant.name, 2, 'medium'
        );
        
        const round1Score = Object.values(round1Questions).reduce((sum, score) => sum + (score || 0), 0);
        const round2Score = Object.values(round2Questions).reduce((sum, score) => sum + (score || 0), 0);
        
        // Generate team score (simplified)
        const teamScore = Math.floor((round1Score + round2Score) * 0.8 + Math.random() * 50);
        
        // Generate bonus score
        const bonusScore = Math.floor(Math.random() * 50);
        
        const totalScore = round1Score + round2Score + teamScore + bonusScore;
        
        return {
            fullName: participant.name,
            group: participant.group,
            round1: round1Score,
            round2: round2Score,
            teamScore,
            bonusScore,
            totalScore,
        };
    });
}

/**
 * Generate formatted mock data strings for direct replacement in api.ts
 */
export function generateFormattedMockData() {
    const round1Data = generateMockRoundData(1);
    const round2Data = generateMockRoundData(2);
    const teamData = generateMockTeamData();
    const overallData = generateMockOverallData();
    
    return {
        round1: JSON.stringify(round1Data, null, 4),
        round2: JSON.stringify(round2Data, null, 4),
        team: JSON.stringify(teamData, null, 4),
        overall: JSON.stringify(overallData, null, 4),
    };
}
