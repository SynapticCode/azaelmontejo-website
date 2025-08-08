/**
 * PerformanceTracker.js - Calculates player performance metrics for dynamic dialogue
 * Integrates with existing GameDataManager.trialHistory data
 */

class PerformanceTracker {
    constructor() {
        this.reputationThresholds = {
            legendary: 0.8,
            respected: 0.6, 
            promising: 0.4
        };
    }

    /**
     * Calculate performance metrics from GameDataManager trial history
     * @param {Array} trialHistory - Array of completed trial results
     * @returns {Object} Performance metrics and reputation
     */
    calculateMetrics(trialHistory) {
        if (!trialHistory || trialHistory.length === 0) {
            return {
                adaptationRate: 0.5,
                coordinationRate: 0.5, 
                overallScore: 0.5,
                reputation: 'unknown',
                stance: 'neutral'
            };
        }

        // Analyze recent performance (last 5 trials or all if fewer)
        const recentTrials = trialHistory.slice(-5);
        
        // Calculate adaptation rate (low environmental loss)
        const adaptationRate = recentTrials.reduce((sum, trial) => {
            const envLoss = trial.environmentalLoss || 0;
            return sum + (envLoss < 0.3 ? 1 : 0);
        }, 0) / recentTrials.length;

        // Calculate coordination rate (low teamwork loss)  
        const coordinationRate = recentTrials.reduce((sum, trial) => {
            const teamLoss = trial.teamworkLoss || 0;
            return sum + (teamLoss < 0.3 ? 1 : 0);
        }, 0) / recentTrials.length;

        const overallScore = (adaptationRate + coordinationRate) / 2;

        // Determine reputation level
        let reputation = 'struggling';
        if (overallScore >= this.reputationThresholds.legendary) {
            reputation = 'legendary';
        } else if (overallScore >= this.reputationThresholds.respected) {
            reputation = 'respected';
        } else if (overallScore >= this.reputationThresholds.promising) {
            reputation = 'promising';
        }

        // Determine tactical stance
        let stance = 'balanced';
        if (adaptationRate > coordinationRate + 0.2) {
            stance = 'innovator';
        } else if (coordinationRate > adaptationRate + 0.2) {
            stance = 'traditionalist';
        }

        return {
            adaptationRate,
            coordinationRate,
            overallScore,
            reputation,
            stance,
            recentTrials: recentTrials.length,
            totalTrials: trialHistory.length
        };
    }

    /**
     * Get reputation-based nickname
     * @param {Object} metrics - Performance metrics from calculateMetrics()
     * @returns {string} Appropriate nickname for the player
     */
    getNickname(metrics) {
        const nicknames = {
            legendary: {
                innovator: ['The Visionary', 'The Evolution', 'Elena\'s Successor'],
                traditionalist: ['The Faithful', 'Doctrine Master', 'Elena\'s Voice'],
                balanced: ['The Legendary', 'Master Commander', 'The Bridge Builder']
            },
            respected: {
                innovator: ['The Innovator', 'The Adapter', 'The Pioneer'],
                traditionalist: ['The Steadfast', 'The Disciplined', 'Elena\'s Student'],
                balanced: ['The Balanced', 'The Wise', 'The Measured']
            },
            promising: {
                innovator: ['The Learner', 'The Bold', 'The Questioner'],
                traditionalist: ['The Devoted', 'The Loyal', 'The Believer'],
                balanced: ['The Developing', 'The Promising', 'The Growing']
            },
            struggling: {
                innovator: ['The Reckless', 'The Unproven', 'The Hasty'],
                traditionalist: ['The Rigid', 'The Inflexible', 'The Bound'],
                balanced: ['The Uncertain', 'The Searching', 'The Challenged']
            }
        };

        const stanceNicknames = nicknames[metrics.reputation] || nicknames.struggling;
        const availableNames = stanceNicknames[metrics.stance] || stanceNicknames.balanced;
        
        return availableNames[Math.floor(Math.random() * availableNames.length)];
    }

    /**
     * Get trial progression phase based on trial number
     * @param {number} trialId - Current trial ID (1-50)
     * @returns {Object} Story phase information
     */
    getStoryPhase(trialId) {
        if (trialId <= 10) {
            return { phase: 1, name: "The First Contact", theme: "honor_tradition" };
        } else if (trialId <= 20) {
            return { phase: 2, name: "The Evolution", theme: "growing_tension" };
        } else if (trialId <= 30) {
            return { phase: 3, name: "The Schism", theme: "crisis_faith" };
        } else if (trialId <= 40) {
            return { phase: 4, name: "The Crucible", theme: "ultimate_test" };
        } else {
            return { phase: 5, name: "The New Legend", theme: "new_doctrine" };
        }
    }
}

// Export for use in other modules
window.PerformanceTracker = PerformanceTracker; 