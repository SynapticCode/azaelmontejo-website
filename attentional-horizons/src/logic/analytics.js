export class Analytics {
    constructor(gameState) {
        this.gameState = gameState;
    }
    
    generatePlayerProfile() {
        const history = this.gameState.history;
        
        // Calculate exploration vs exploitation ratio
        const explorationChoices = history.filter(h => h.tags && h.tags.includes("explore")).length;
        const exploitationChoices = history.filter(h => h.tags && h.tags.includes("exploit")).length;
        
        // Calculate NPC interaction distribution
        const npcInteractions = {
            engineer: history.filter(h => h.npc === "Engineer").length,
            scientist: history.filter(h => h.npc === "Scientist").length,
            marketer: history.filter(h => h.npc === "Marketer").length,
            ceo: history.filter(h => h.npc === "CEO").length
        };
        
        // Determine player style
        let playerStyle = "";
        if (explorationChoices > exploitationChoices * 1.5) {
            playerStyle = "Visionary Explorer";
        } else if (exploitationChoices > explorationChoices * 1.5) {
            playerStyle = "Methodical Optimizer";
        } else {
            playerStyle = "Balanced Strategist";
        }
        
        // Determine focus area
        let focusArea = "";
        const maxInteractions = Math.max(
            npcInteractions.engineer,
            npcInteractions.scientist,
            npcInteractions.marketer,
            npcInteractions.ceo
        );
        
        if (npcInteractions.engineer === maxInteractions) {
            focusArea = "Technical Focus";
        } else if (npcInteractions.scientist === maxInteractions) {
            focusArea = "Innovation Focus";
        } else if (npcInteractions.marketer === maxInteractions) {
            focusArea = "Market Focus";
        } else if (npcInteractions.ceo === maxInteractions) {
            focusArea = "Strategic Focus";
        }
        
        // Generate final profile
        return {
            playerStyle,
            focusArea,
            stats: {
                stability: this.gameState.stability,
                innovation: this.gameState.innovation,
                market_fit: this.gameState.market_fit
            },
            explorationRatio: explorationChoices / (explorationChoices + exploitationChoices),
            interactionDistribution: npcInteractions,
            finalAct: this.gameState.act,
            totalWeeks: this.gameState.week,
            decisions: history.length
        };
    }
    
    generateCSVData() {
        const history = this.gameState.history;
        let csvContent = "timestamp,act,week,npc,decision_id,stability_change,innovation_change,market_fit_change,tags\n";
        
        history.forEach(decision => {
            const row = [
                decision.timestamp,
                decision.act,
                decision.week || 1,
                decision.npc,
                decision.id,
                decision.result.stability || 0,
                decision.result.innovation || 0,
                decision.result.market_fit || 0,
                decision.tags ? decision.tags.join("|") : ""
            ].join(",");
            
            csvContent += row + "\n";
        });
        
        return csvContent;
    }
    
    getEndingType() {
        const { stability, innovation, market_fit } = this.gameState;
        
        // Determine which ending the player gets based on their final stats
        if (stability > 70 && innovation < 30) {
            return "stable_stagnant";
        } else if (innovation > 70 && stability < 30) {
            return "innovative_chaotic";
        } else if (market_fit > 70) {
            return "market_success";
        } else if (stability > 50 && innovation > 50 && market_fit > 50) {
            return "balanced_success";
        } else if (stability < 30 && innovation < 30 && market_fit < 30) {
            return "total_failure";
        } else {
            return "moderate_outcome";
        }
    }
}
