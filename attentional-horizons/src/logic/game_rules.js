// Handles game mechanics, scoring, and progression rules

export class GameRules {
    constructor(stateManager) {
        this.stateManager = stateManager;
    }
    
    applyEffects(npc, choice) {
        const state = this.stateManager.getState();
        
        // Apply stat changes
        for (let stat in choice.result) {
            state[stat] += choice.result[stat];
            
            // Ensure stats stay within bounds (0-100)
            if (state[stat] < 0) state[stat] = 0;
            if (state[stat] > 100) state[stat] = 100;
        }
        
        // Apply time cost
        state.timeRemaining -= choice.timeCost || 15;
        
        // Apply repeat penalty if applicable
        if (choice.repeatPenalty && state.lastChoice[npc] === choice.id) {
            state.timeRemaining -= 10;
        }
        
        // Update visit count and last choice
        state.visits[npc.toLowerCase()]++;
        state.lastChoice[npc] = choice.id;
        
        // Log the interaction
        this.stateManager.logInteraction(npc, choice.id, choice.result, choice.tags);
        
        // Update the state
        this.stateManager.updateState(state);
        
        return {
            newStats: {
                stability: state.stability,
                innovation: state.innovation,
                market_fit: state.market_fit
            },
            timeRemaining: state.timeRemaining
        };
    }
    
    checkActProgression() {
        const state = this.stateManager.getState();
        
        // Example logic: Progress to next act after certain weeks
        if (state.week >= 5 && state.act < 4) {
            return this.stateManager.advanceAct();
        }
        
        return state.act;
    }
    
    checkGameEnd() {
        const state = this.stateManager.getState();
        
        // Game ends if time runs out or we complete Act 4
        return state.timeRemaining <= 0 || (state.act >= 4 && state.week >= 5);
    }
}
