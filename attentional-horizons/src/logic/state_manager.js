// Manages the game state across all scenes and interactions

export class StateManager {
    constructor() {
        this.gameState = {
            stability: 0,
            innovation: 0,
            market_fit: 0,
            act: 1,
            week: 1,
            visits: { engineer: 0, scientist: 0, marketer: 0, ceo: 0 },
            lastChoice: {},
            flags: {},
            history: [], // Each: { npc, act, id, result, timestamp }
            timeRemaining: 300
        };
    }
    
    getState() {
        return this.gameState;
    }
    
    updateState(updates) {
        Object.assign(this.gameState, updates);
    }
    
    logInteraction(npc, choiceId, result, tags) {
        const interaction = {
            npc,
            act: this.gameState.act,
            week: this.gameState.week,
            id: choiceId,
            result,
            tags,
            timestamp: Date.now()
        };
        
        this.gameState.history.push(interaction);
        return interaction;
    }
    
    advanceWeek() {
        this.gameState.week++;
        // Reset weekly visit counts if needed
        return this.gameState.week;
    }
    
    advanceAct() {
        this.gameState.act++;
        this.gameState.week = 1;
        return this.gameState.act;
    }
}
