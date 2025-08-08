/**
 * DialogueSelector.js - Dynamic dialogue selection based on performance
 * Works with existing global dialogue arrays (window.waveXDialogue)
 */

class DialogueSelector {
    constructor() {
        this.performanceTracker = new PerformanceTracker();
        
        // Dynamic content templates for performance-based insertion
        this.dynamicContent = {
            reputationInserts: {
                legendary: [
                    "The fleet calls you legend now, a title that carries weight beyond rank.",
                    "Your name is spoken alongside Elena's in the tactical academies.",
                    "Command whispers that you may surpass even Elena's legacy."
                ],
                respected: [
                    "The crew speaks your name with growing respect in the mess halls.",
                    "Your tactical decisions have earned nods of approval from veteran pilots.",
                    "The fleet has begun to trust your judgment over standard doctrine."
                ],
                promising: [
                    "Some pilots begin to whisper your callsign with cautious hope.",
                    "Your growing reputation precedes you through fleet communications.",
                    "The crew watches your decisions with increasing interest."
                ],
                struggling: [
                    "Doubt creeps through the fleet channels about your command decisions.",
                    "The crew still searches for confidence in your leadership.",
                    "Whispered concerns echo through the ship's corridors."
                ]
            },

            performanceBranches: {
                highAdaptation: [
                    "Your willingness to evolve beyond Elena's limitations has not gone unnoticed.",
                    "Your tactical innovation inspires confidence in the fleet.",
                    "The crew has learned to trust your bold adaptations."
                ],
                highCoordination: [
                    "Elena's spirit guides your unified command, and the fleet follows with trust.",
                    "Your disciplined adherence to doctrine brings order to chaos.",
                    "The crew moves as one under your coordinated leadership."
                ],
                balanced: [
                    "You walk the careful line between Elena's wisdom and tactical necessity.",
                    "Your balanced approach earns respect from both traditionalists and innovators.",
                    "The fleet sees wisdom in your measured command style."
                ],
                poor: [
                    "The weight of command decisions grows heavier with each questionable choice.",
                    "Uncertainty clouds the bridge as tactical errors mount.",
                    "The crew's faith in your leadership wavers with each setback."
                ]
            },

            enemyEvolution: {
                early: "The enemy shows signs of learning from your encounters.",
                developing: "Raider tactics have evolved to counter your previous strategies.",  
                advanced: "The enemy now anticipates and counters your tactical preferences.",
                mastery: "Enemy formations seem to predict your every tactical decision.",
                evolved: "The raiders fight as if they've studied every choice you've ever made."
            }
        };
    }

    /**
     * Get dialogue for a trial with performance-based dynamic content
     * @param {Object} trial - Current trial data
     * @param {Object} gameDataManager - Reference to GameDataManager for history
     * @returns {string} Selected dialogue with dynamic content
     */
    getDialogue(trial, gameDataManager) {
        // Use existing Wave 1 system unchanged
        if (trial.waveInfo.waveId === 1 && window.wave1TutorialDialogue) {
            const trialIndex = Math.min(trial.trialInWave - 1, window.wave1TutorialDialogue.length - 1);
            return window.wave1TutorialDialogue[trialIndex] || window.wave1TutorialDialogue[0];
        }

        // For tutorial, return basic dialogue
        if (trial.isTutorial) {
            return "Welcome to the tutorial simulation. This is Elena's lever, forged from her destroyer's hull.";
        }

        // Get the base dialogue from global arrays
        const waveDialogueArray = window[`wave${trial.waveInfo.waveId}Dialogue`];
        if (!waveDialogueArray || waveDialogueArray.length === 0) {
            return this.getFallbackDialogue(trial);
        }

        const trialIndex = Math.min(trial.trialInWave - 1, waveDialogueArray.length - 1);
        let baseDialogue = waveDialogueArray[trialIndex] || waveDialogueArray[0];

        // Apply performance-based modifications
        const performance = this.performanceTracker.calculateMetrics(gameDataManager.trialHistory);
        const dynamicDialogue = this.applyDynamicContent(baseDialogue, performance, trial.trialId);

        return dynamicDialogue;
    }

    /**
     * Apply dynamic content to base dialogue
     * @param {string} baseDialogue - Base dialogue text with placeholders
     * @param {Object} performance - Performance metrics
     * @param {number} trialId - Current trial ID for progression
     * @returns {string} Dialogue with dynamic content applied
     */
    applyDynamicContent(baseDialogue, performance, trialId) {
        let dialogue = baseDialogue;

        // Replace reputation placeholders
        const reputationInsert = this.getRandomContent(this.dynamicContent.reputationInserts[performance.reputation]);
        dialogue = dialogue.replace('[REPUTATION_INSERT]', reputationInsert);

        // Replace performance branch placeholders
        const perfBranch = this.getPerformanceBranch(performance);
        dialogue = dialogue.replace('[PERFORMANCE_BRANCH]', perfBranch);

        // Replace enemy evolution notices
        const evolutionLevel = Math.min(Math.floor((trialId - 1) / 10), 4);
        const evolutionKeys = Object.keys(this.dynamicContent.enemyEvolution);
        const evolutionNotice = this.dynamicContent.enemyEvolution[evolutionKeys[evolutionLevel]];
        dialogue = dialogue.replace('[ENEMY_EVOLUTION]', evolutionNotice);

        // Add nickname if available
        const nickname = this.performanceTracker.getNickname(performance);
        dialogue = dialogue.replace('[NICKNAME]', nickname);

        // Clean up any remaining placeholders
        dialogue = dialogue.replace(/\[.*?\]/g, '');

        return dialogue;
    }

    /**
     * Get performance-specific branch content
     * @param {Object} performance - Performance metrics
     * @returns {string} Appropriate performance branch text
     */
    getPerformanceBranch(performance) {
        if (performance.overallScore < 0.4) {
            return this.getRandomContent(this.dynamicContent.performanceBranches.poor);
        } else if (performance.adaptationRate > performance.coordinationRate + 0.2) {
            return this.getRandomContent(this.dynamicContent.performanceBranches.highAdaptation);
        } else if (performance.coordinationRate > performance.adaptationRate + 0.2) {
            return this.getRandomContent(this.dynamicContent.performanceBranches.highCoordination);
        } else {
            return this.getRandomContent(this.dynamicContent.performanceBranches.balanced);
        }
    }

    /**
     * Get random content from an array
     * @param {Array} contentArray - Array of content options
     * @returns {string} Random content or empty string if array is empty
     */
    getRandomContent(contentArray) {
        if (!contentArray || contentArray.length === 0) return '';
        return contentArray[Math.floor(Math.random() * contentArray.length)];
    }

    /**
     * Fallback dialogue when wave-specific dialogue is not available
     * @param {Object} trial - Current trial data
     * @returns {string} Fallback dialogue
     */
    getFallbackDialogue(trial) {
        return `Wave ${trial.waveInfo.waveId}, Mission ${trial.trialInWave}: Elena's legacy guides your command. The lever responds to your touch as it did to hers. Choose your target with the wisdom of experience and the courage of innovation.`;
    }
}

// Export for global use
window.DialogueSelector = DialogueSelector; 