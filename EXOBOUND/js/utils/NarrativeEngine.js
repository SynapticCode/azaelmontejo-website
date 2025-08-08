/**
 * NarrativeEngine.js - Enhanced narrative system for EXOBOUND
 * Extends the existing narrative.js with Elena Velez storyline and dynamic story generation
 * Based on experimental conditions while preserving all original variables
 */

class NarrativeEngine {
    constructor() {
        // Elena Velez backstory and mythology
        this.elenaLore = {
            background: "Commander Elena Velez was the first to encounter the Velez Deathstar at Arcturus Prime. She held back the asteroid with her skeleton crew, saving countless lives but losing her own ship in the process.",
            doctrineOrigin: "The asteroid-first doctrine emerged from desperate necessity during the Siege of Proxima, when Admiral Valderon's fleet survived by focusing on environmental threats rather than engaging raiders directly.",
            leverHistory: "The allocation lever was forged from the hull of Elena's destroyer, salvaged from the wreckage. Every commander since has used this same control system.",
            sacrifice: "Elena's final transmission: 'The asteroid is everything. If it reaches atmosphere, nothing else matters. Focus fire, save the colonies, remember why we fight.'"
        };

        // Story mapping based on experimental conditions
        this.storyMapping = {
            // Threat levels based on ideal_size (raider focus percentage)
            threat_levels: {
                60: { 
                    level: "minimal", 
                    story: "Light raider patrols detected",
                    elena_context: "This reminds me of the early days at Kepler Station, when Elena first spotted enemy scouts."
                },
                80: { 
                    level: "moderate", 
                    story: "Raider squadron formation confirmed",
                    elena_context: "Elena faced similar formations during the Proxima offensive. She chose to engage directly."
                },
                100: { 
                    level: "significant", 
                    story: "Major raider offensive incoming",
                    elena_context: "The tactical situation mirrors Elena's final battle - overwhelming raider presence."
                },
                120: { 
                    level: "severe", 
                    story: "Massive raider swarm mobilizing",
                    elena_context: "This exceeds even what Elena faced at Arcturus Prime. Her doctrine may not be enough."
                },
                140: { 
                    level: "critical", 
                    story: "Overwhelming raider assault imminent",
                    elena_context: "Elena never had to face odds like these. We're in uncharted tactical territory."
                }
            },
            
            // Communication status based on p_message
            comms_status: {
                0.0: { 
                    status: "dead", 
                    story: "Solar flare has destroyed all communications",
                    tactical_impact: "Complete radio silence - each ship operates independently.",
                    elena_wisdom: "Elena always said: 'When comms fail, fall back to doctrine. The asteroid protocol exists for exactly this scenario.'"
                },
                0.25: { 
                    status: "critical", 
                    story: "Heavy interference corrupting most signals",
                    tactical_impact: "Only 1 in 4 commands will reach the fleet clearly.",
                    elena_wisdom: "During the Proxima siege, Elena learned that broken comms favor those who trust their training."
                },
                0.5: { 
                    status: "degraded", 
                    story: "Partial communications array damage detected",
                    tactical_impact: "Half of all fleet commands will be received properly.",
                    elena_wisdom: "Elena used to say: 'When in doubt, the fleet knows the asteroid comes first. Trust them.'"
                },
                0.75: { 
                    status: "stable", 
                    story: "Minor static in communication channels",
                    tactical_impact: "Most commands will reach the fleet, occasional interference expected.",
                    elena_wisdom: "Elena preferred conditions like these - clear enough for innovation, challenging enough to prove worth."
                },
                1.0: { 
                    status: "perfect", 
                    story: "All systems operational, crystal clear comms",
                    tactical_impact: "Every command will reach the fleet instantly and clearly.",
                    elena_wisdom: "Perfect comms were rare in Elena's time. She'd say we're lucky - don't waste the advantage."
                }
            },
            
            // Fleet size narratives based on n_fleetsize
            fleet_stories: {
                3: {
                    description: "Skeleton crew - every ship counts",
                    elena_connection: "Elena's final battle was fought with just 3 ships. She proved that courage multiplies force.",
                    tactical_note: "Small formations require perfect coordination. No room for error."
                },
                4: {
                    description: "Standard patrol formation",
                    elena_connection: "A classic formation Elena used during the Kepler Station campaigns. Balanced and reliable.",
                    tactical_note: "Standard doctrine was built around 4-ship formations. Well-tested tactics."
                },
                5: {
                    description: "Full squadron deployment",
                    elena_connection: "Elena commanded squadrons this size during the height of the war. Maximum tactical flexibility.",
                    tactical_note: "Five ships offer multiple tactical options. Choose your allocation carefully."
                },
                6: {
                    description: "Heavy battle group assembled",
                    elena_connection: "Elena never had the luxury of commanding this many ships simultaneously. We honor her sacrifice with superior numbers.",
                    tactical_note: "Large formations amplify both success and failure. Coordination becomes paramount."
                }
            }
        };

        // Performance-based reputation tracking
        this.playerLegacy = {
            reputation: 'unknown',
            doctrinalStance: 'neutral',
            performanceHistory: []
        };
    }

    /**
     * Generate rich narrative context for a trial based on experimental conditions
     */
    generateTrialNarrative(trialData) {
        const idealSize = trialData.ideal_size || 100;
        const fleetSize = trialData.n_fleetsize || 3;
        const commsReliability = trialData.p_message || 0.7;

        const threatLevel = this.findClosestThreatLevel(idealSize);
        const commsStatus = this.findClosestCommsStatus(commsReliability);
        const fleetStory = this.storyMapping.fleet_stories[fleetSize] || this.storyMapping.fleet_stories[3];

        return {
            situation: {
                threat: threatLevel.story,
                communications: commsStatus.story,
                fleet: fleetStory.description,
                tactical_assessment: `Raider threat: ${threatLevel.level.toUpperCase()}. Comms integrity: ${commsStatus.status.toUpperCase()}. Fleet status: ${fleetStory.description}.`
            },
            elena_context: {
                threat_wisdom: threatLevel.elena_context,
                comms_guidance: commsStatus.elena_wisdom,
                fleet_legacy: fleetStory.elena_connection,
                tactical_doctrine: this.getDoctrinalGuidance(idealSize, commsReliability)
            },
            tactical_briefing: {
                threat_assessment: threatLevel.story,
                comms_impact: commsStatus.tactical_impact,
                fleet_considerations: fleetStory.tactical_note,
                recommended_approach: this.generateTacticalRecommendation(idealSize, commsReliability, fleetSize)
            }
        };
    }

    findClosestThreatLevel(idealSize) {
        const levels = Object.keys(this.storyMapping.threat_levels).map(Number);
        const closest = levels.reduce((prev, curr) => 
            Math.abs(curr - idealSize) < Math.abs(prev - idealSize) ? curr : prev
        );
        return this.storyMapping.threat_levels[closest];
    }

    findClosestCommsStatus(pMessage) {
        const statuses = Object.keys(this.storyMapping.comms_status).map(Number);
        const closest = statuses.reduce((prev, curr) => 
            Math.abs(curr - pMessage) < Math.abs(prev - pMessage) ? curr : prev
        );
        return this.storyMapping.comms_status[closest];
    }

    getDoctrinalGuidance(idealSize, commsReliability) {
        if (idealSize >= 120) {
            return "Elena faced overwhelming odds at Arcturus Prime. She chose to trust her training and focus on what mattered most - the asteroid threat.";
        } else if (idealSize >= 100) {
            return "Elena's doctrine: 'When raiders mass for attack, eliminate them swiftly. But never forget - if the asteroid reaches the colonies, raiders become irrelevant.'";
        } else if (idealSize >= 80) {
            return "Elena believed in balanced approaches to moderate threats. 'Assess, adapt, but always remember the primary directive - protect the colonies.'";
        } else {
            return "Elena's wisdom for light threats: 'Small raiders are often distractions. Focus on the real danger - the asteroid that could end everything.'";
        }
    }

    generateTacticalRecommendation(idealSize, commsReliability, fleetSize) {
        let recommendation = "";
        
        if (idealSize >= 120) {
            recommendation = "PRIORITY: Eliminate raider swarm immediately. ";
        } else if (idealSize >= 100) {
            recommendation = "PRIORITY: Focus primarily on raider threat. ";
        } else if (idealSize >= 80) {
            recommendation = "PRIORITY: Balance raider engagement with asteroid protocol. ";
        } else {
            recommendation = "PRIORITY: Maintain asteroid focus, monitor raider activity. ";
        }

        if (commsReliability <= 0.25) {
            recommendation += "Poor comms favor standard protocols - lean toward asteroid doctrine.";
        } else if (commsReliability >= 0.75) {
            recommendation += "Excellent comms enable tactical flexibility - trust your judgment.";
        } else {
            recommendation += "Moderate comms require careful balance between innovation and doctrine.";
        }

        return recommendation;
    }

    updatePlayerLegacy(trialResult) {
        this.playerLegacy.performanceHistory.push({
            adaptationLoss: trialResult.adaptationLoss,
            coordinationLoss: trialResult.coordinationLoss,
            allocation: trialResult.allocation,
            bonus: trialResult.bonus,
            timestamp: Date.now()
        });

        this.calculateReputation();
        this.calculateDoctrinalStance();
    }

    calculateReputation() {
        if (this.playerLegacy.performanceHistory.length === 0) {
            this.playerLegacy.reputation = 'unknown';
            return;
        }

        const recentPerformance = this.playerLegacy.performanceHistory.slice(-5);
        const avgBonus = recentPerformance.reduce((sum, trial) => sum + (trial.bonus || 0), 0) / recentPerformance.length;

        if (avgBonus >= 80) {
            this.playerLegacy.reputation = 'legendary';
        } else if (avgBonus >= 60) {
            this.playerLegacy.reputation = 'veteran';
        } else if (avgBonus >= 40) {
            this.playerLegacy.reputation = 'competent';
        } else if (avgBonus >= 20) {
            this.playerLegacy.reputation = 'developing';
        } else {
            this.playerLegacy.reputation = 'untested';
        }
    }

    calculateDoctrinalStance() {
        if (this.playerLegacy.performanceHistory.length < 3) {
            this.playerLegacy.doctrinalStance = 'neutral';
            return;
        }

        const recentAllocations = this.playerLegacy.performanceHistory.slice(-5).map(trial => trial.allocation);
        const avgAllocation = recentAllocations.reduce((sum, alloc) => sum + alloc, 0) / recentAllocations.length;

        if (avgAllocation <= 30) {
            this.playerLegacy.doctrinalStance = 'elena_follower';
        } else if (avgAllocation >= 70) {
            this.playerLegacy.doctrinalStance = 'tactical_innovator';
        } else {
            this.playerLegacy.doctrinalStance = 'balanced_commander';
        }
    }

    getElenaLore(context = 'background') {
        return this.elenaLore[context] || this.elenaLore.background;
    }

    getPersonalizedNarrative() {
        const reputation = this.playerLegacy.reputation;
        const stance = this.playerLegacy.doctrinalStance;

        const narratives = {
            legendary: {
                elena_follower: "Your unwavering dedication to Elena's asteroid doctrine has made you a legend. The fleet speaks of you in the same breath as Elena herself.",
                tactical_innovator: "Your innovative raider-focused tactics have revolutionized fleet doctrine. Elena would be proud of your tactical evolution.",
                balanced_commander: "Your balanced approach has earned legendary status. You embody both Elena's wisdom and tactical innovation.",
                neutral: "Your legendary reputation precedes you. The fleet follows your every command without question."
            },
            veteran: {
                elena_follower: "Your adherence to Elena's doctrine marks you as a veteran commander. The old ways still prove their worth.",
                tactical_innovator: "Your raider-focused tactics show veteran insight. You understand threats Elena never faced.",
                balanced_commander: "Your balanced approach demonstrates veteran wisdom. You adapt Elena's legacy to modern challenges.",
                neutral: "Your veteran status commands respect throughout the fleet. Experience guides your decisions."
            },
            competent: {
                elena_follower: "Your respect for Elena's doctrine shows competent command instincts. The asteroid protocol serves you well.",
                tactical_innovator: "Your focus on raiders demonstrates competent tactical thinking. Sometimes innovation trumps doctrine.",
                balanced_commander: "Your balanced decisions show competent leadership. You're learning to blend doctrine with adaptation.",
                neutral: "Your competent command is evident. The fleet trusts your developing judgment."
            },
            developing: {
                elena_follower: "Your adherence to asteroid doctrine shows promise. Elena's wisdom guides those willing to learn.",
                tactical_innovator: "Your raider focus shows developing tactical instincts. Bold choices carry both risk and reward.",
                balanced_commander: "Your attempts at balance show developing wisdom. Finding the middle path takes practice.",
                neutral: "Your command skills are developing. Each decision teaches valuable lessons."
            },
            untested: {
                elena_follower: "Following Elena's doctrine is wise for an untested commander. The asteroid protocol has saved countless lives.",
                tactical_innovator: "Aggressive raider targeting shows boldness, but untested commanders should consider proven doctrine.",
                balanced_commander: "Attempting balance shows wisdom for an untested commander. Learn from each decision.",
                neutral: "Every commander starts untested. Elena herself once stood where you stand now."
            }
        };

        return narratives[reputation]?.[stance] || narratives[reputation]?.neutral || "Your journey as a tactical officer continues.";
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NarrativeEngine;
} 