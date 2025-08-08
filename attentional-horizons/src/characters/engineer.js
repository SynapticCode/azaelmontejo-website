// Engineer character interactions

export class Engineer {
    constructor(gameRules) {
        this.gameRules = gameRules;
        this.name = "Engineer";
    }
    
    getDialogueForAct(act) {
        switch(act) {
            case 1: return this.getAct1Dialogue();
            case 2: return this.getAct2Dialogue();
            case 3: return this.getAct3Dialogue();
            case 4: return this.getAct4Dialogue();
            default: return this.getAct1Dialogue();
        }
    }
    
    getAct1Dialogue() {
        return {
            text: "We need to decide on our tech stack for the product. What approach should we take?",
            choices: [
                {
                    id: "eng_a1_c1",
                    text: "Use proven technologies we know well",
                    type: "exploitation",
                    tags: ["exploit", "technical", "low_risk"],
                    result: { stability: 15, innovation: -5, market_fit: 5 },
                    timeCost: 10
                },
                {
                    id: "eng_a1_c2",
                    text: "Experiment with cutting-edge frameworks",
                    type: "exploration",
                    tags: ["explore", "technical", "high_risk"],
                    result: { stability: -10, innovation: 20, market_fit: 5 },
                    timeCost: 20
                }
            ]
        };
    }
    
    getAct2Dialogue() {
        return {
            text: "The codebase is growing. How should we handle technical debt?",
            choices: [
                {
                    id: "eng_a2_c1",
                    text: "Refactor existing code for stability",
                    type: "exploitation",
                    tags: ["exploit", "technical", "maintenance"],
                    result: { stability: 20, innovation: 0, market_fit: 5 },
                    timeCost: 15
                },
                {
                    id: "eng_a2_c2",
                    text: "Focus on new features, deal with tech debt later",
                    type: "exploration",
                    tags: ["explore", "technical", "feature_driven"],
                    result: { stability: -15, innovation: 25, market_fit: 10 },
                    timeCost: 10
                }
            ]
        };
    }
    
    getAct3Dialogue() {
        return {
            text: "We're scaling rapidly. What's our engineering priority?",
            choices: [
                {
                    id: "eng_a3_c1",
                    text: "Optimize existing systems for reliability",
                    type: "exploitation",
                    tags: ["exploit", "technical", "scaling"],
                    result: { stability: 25, innovation: -5, market_fit: 10 },
                    timeCost: 15
                },
                {
                    id: "eng_a3_c2",
                    text: "Rebuild architecture for future growth",
                    type: "exploration",
                    tags: ["explore", "technical", "long_term"],
                    result: { stability: -10, innovation: 20, market_fit: 15 },
                    timeCost: 25
                }
            ]
        };
    }
    
    getAct4Dialogue() {
        return {
            text: "Final push before launch. Where should engineering focus?",
            choices: [
                {
                    id: "eng_a4_c1",
                    text: "Squash bugs and polish existing features",
                    type: "exploitation",
                    tags: ["exploit", "technical", "quality"],
                    result: { stability: 30, innovation: 0, market_fit: 15 },
                    timeCost: 20
                },
                {
                    id: "eng_a4_c2",
                    text: "Add one more breakthrough feature",
                    type: "exploration",
                    tags: ["explore", "technical", "risky"],
                    result: { stability: -20, innovation: 35, market_fit: 20 },
                    timeCost: 30
                }
            ]
        };
    }
    
    interact(act) {
        return this.getDialogueForAct(act);
    }
}
