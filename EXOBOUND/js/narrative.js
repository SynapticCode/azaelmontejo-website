/**
 * narrative.js - Complete narrative script for EXOBOUND campaign
 * Contains all FLEETCOM dialogue for tutorial, briefings, outcomes, and campaign progression
 */

const NARRATIVE_SCRIPT = {
    // Campaign Introduction
    campaign_intro: {
        "0.1": "Welcome, Tactical Officer. Let's begin your mission briefing.",
        "0.2": "You are in command of our defensive fleet. Your decisions will determine our survival."
    },
    
    // Tutorial Wave (1 trial)
    tutorial: {
        "T.1": "First, let's run a simulation. We'll walk you through targeting protocols. Pay attention, your performance matters."
    },
    
    // Wave 1: The Proving Ground (Staged Trials - Learning Curve)
    wave_1: {
        "1.1": "This is Operation EXOBOUND. Your first live-fire mission. Conditions are stable. Comms integrity is high. Show us what you've got.",
        "1.2": "Solid performance, Officer. You've proven you can handle the basics. Don't get cocky.",
        "1.3": "A messy start. Coordination was sloppy. The fleet needs a commander, not a gambler. Review the data and learn from your mistakes."
    },
    
    // Wave 2: Communication Blackout
    wave_2: {
        "2.1": "Intel reports a solar flare is disrupting communications. Expect significant signal degradation. You'll have to rely on standard fleet doctrine more often.",
        "2.2": "Impressive work under pressure. You balanced risk and discipline perfectly. The fleet is intact.",
        "2.3": "That was chaotic. The comms blackout led to heavy losses. You need to adapt to changing conditions."
    },
    
    // Wave 3: The Swarm
    wave_3: {
        "3.1": "We've detected an unusually large fleet of Raiders. We're deploying more of our own ships to match them. Managing a larger fleet requires greater care.",
        "3.2": "Excellent command of a large fleet. Your clear orders punched a hole right through their formation.",
        "3.3": "A larger fleet means larger consequences for error. We lost too many friendlies due to mis-coordination."
    },
    
    // Wave 4: Stealth Raiders
    wave_4: {
        "4.1": "The Raiders have upgraded their stealth systems. The ideal targets are harder to detect and require more precise targeting. Trust your instincts.",
        "4.2": "Outstanding precision work. You found and eliminated the stealth threats with minimal collateral damage.",
        "4.3": "The stealth Raiders exploited our hesitation. We need to be more decisive in future engagements."
    },
    
    // Wave 5: Volatile Asteroids
    wave_5: {
        "5.1": "These asteroids contain volatile compounds. Standard targeting may cause chain reactions. Consider the environmental impact of your decisions.",
        "5.2": "Perfect balance of tactical and environmental concerns. You minimized collateral damage while maintaining mission effectiveness.",
        "5.3": "The chain reactions caused significant environmental damage. We need to be more careful about secondary effects."
    },
    
    // Wave 6: Fleet Coordination Test
    wave_6: {
        "6.1": "This wave will test your fleet coordination under varying communication conditions. Some trials will have excellent comms, others will be severely degraded.",
        "6.2": "Exceptional coordination across all conditions. You've mastered fleet communication protocols.",
        "6.3": "Coordination failures cost us dearly. We need to improve our communication strategies."
    },
    
    // Wave 7: High-Stakes Engagement
    wave_7: {
        "7.1": "This is a high-stakes engagement. The Raiders are more aggressive, and the consequences of poor decisions are severe. Every choice matters.",
        "7.2": "Outstanding performance under pressure. You maintained composure and made the right calls when it counted.",
        "7.3": "The pressure got to us. We made too many mistakes in critical moments. We need to improve our stress management."
    },
    
    // Wave 8: Environmental Priority
    wave_8: {
        "8.1": "Environmental protection is the primary concern this wave. The asteroids pose a significant threat to nearby colonies. Prioritize environmental safety.",
        "8.2": "Excellent environmental stewardship. You protected the colonies while maintaining tactical effectiveness.",
        "8.3": "Environmental damage was unacceptable. We need to better balance tactical and environmental priorities."
    },
    
    // Wave 9: Tactical Innovation
    wave_9: {
        "9.1": "The Raiders are adapting to our tactics. We need innovative approaches. Don't rely on standard procedures - think outside the box.",
        "9.2": "Brilliant tactical innovation. Your creative solutions caught the Raiders completely off guard.",
        "9.3": "We were too predictable. The Raiders anticipated our moves. We need to develop more flexible tactics."
    },
    
    // Wave 10: The Final Stand
    wave_10: {
        "10.1": "This is it, Officer. The Raider command ship has been located. All our forces are committed. The conditions are unstable, but the target is critical. Everything comes down to this.",
        "10.2": "Victory! Your command decisions were flawless. The Raider threat has been neutralized. Exceptional work.",
        "10.3": "We drove them off, but the cost was too high. The command ship escaped. We survived, but did not win."
    },
    
    // Campaign End
    campaign_end: {
        "E.1": "Your tour of duty is complete, Tactical Officer. Your final performance has been logged. Thank you for your service."
    }
};

/**
 * Get narrative dialogue for specific wave and type
 * @param {number} waveId - Wave number (0 for tutorial, 1-10 for campaign)
 * @param {string} type - 'briefing', 'success', 'failure', or 'end'
 * @returns {string} The dialogue text
 */
function getNarrativeDialogue(waveId, type) {
    if (waveId === 0) {
        // Tutorial wave
        if (type === 'intro') return NARRATIVE_SCRIPT.campaign_intro["0.1"];
        if (type === 'intro2') return NARRATIVE_SCRIPT.campaign_intro["0.2"];
        return NARRATIVE_SCRIPT.tutorial["T.1"]; // Default tutorial dialogue
    }
    
    if (waveId >= 1 && waveId <= 10) {
        const waveKey = `wave_${waveId}`;
        if (NARRATIVE_SCRIPT[waveKey]) {
            if (type === 'briefing') return NARRATIVE_SCRIPT[waveKey][`${waveId}.1`];
            if (type === 'success') return NARRATIVE_SCRIPT[waveKey][`${waveId}.2`];
            if (type === 'failure') return NARRATIVE_SCRIPT[waveKey][`${waveId}.3`];
        }
    }
    
    if (type === 'end') return NARRATIVE_SCRIPT.campaign_end["E.1"];
    
    return "Mission briefing in progress...";
}

/**
 * Get tutorial dialogue for specific trial
 * @param {number} trialIndex - Tutorial trial index (0 for single tutorial)
 * @returns {string} The tutorial dialogue
 */
function getTutorialDialogue(trialIndex) {
    return NARRATIVE_SCRIPT.tutorial["T.1"];
}

/**
 * Get wave theme description
 * @param {number} waveId - Wave number
 * @returns {string} Theme description
 */
function getWaveTheme(waveId) {
    const themes = {
        0: "Tutorial Wave - Interactive Training",
        1: "The Proving Ground - Basic Training",
        2: "Communication Blackout - Signal Degradation",
        3: "The Swarm - Large Fleet Management",
        4: "Stealth Raiders - Precision Targeting",
        5: "Volatile Asteroids - Environmental Concerns",
        6: "Fleet Coordination Test - Communication Variability",
        7: "High-Stakes Engagement - Pressure Management",
        8: "Environmental Priority - Colony Protection",
        9: "Tactical Innovation - Adaptive Strategies",
        10: "The Final Stand - Command Ship Engagement"
    };
    return themes[waveId] || "Unknown Wave";
}

/**
 * Get parameter description in narrative format
 * @param {Object} trialData - Trial parameters
 * @returns {Object} Narrative descriptions
 */
function getParameterNarrative(trialData) {
    const fleetSize = trialData.n_fleetsize || 3;
    const reception = trialData.p_message || 0.7;
    const receptionPercent = Math.round(reception * 100);
    
    return {
        fleetSize: `${fleetSize} ships`,
        commsIntegrity: `${receptionPercent}%`,
        fleetDescription: getFleetSizeDescription(fleetSize),
        commsDescription: getCommsDescription(reception)
    };
}

function getFleetSizeDescription(fleetSize) {
    if (fleetSize <= 3) return "small tactical squadron";
    if (fleetSize <= 6) return "standard fleet formation";
    return "large battle group";
}

function getCommsDescription(reception) {
    if (reception >= 0.9) return "excellent";
    if (reception >= 0.7) return "good";
    if (reception >= 0.5) return "moderate";
    if (reception >= 0.3) return "poor";
    return "critical";
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        NARRATIVE_SCRIPT,
        getNarrativeDialogue,
        getTutorialDialogue,
        getWaveTheme,
        getParameterNarrative
    };
} 