class GameDataManager {
    constructor(trialData) {
        // Initialize with trial data
        this.trialData = trialData || [];
        this.totalTrials = this.trialData.length;
        
        // Initialize game state
        this.currentTrialIndex = 0;
        this.playerFleet = [];
        this.alienFleet = [];
        this.asteroidHealth = 100;
        this.reinforcementsAvailable = true;
        
        // Initialize statistics
        this.environmentalLoss = 0;
        this.teamworkLoss = 0;
        this.reception = 0.7; // Default reception rate (70%)
        
        // Multi-trial tracking
        this.trialHistory = [];
        this.totalBonus = 0;
        this.campaignComplete = false;
        
        // Initialize narrative engine for Elena Velez storyline
        this.narrativeEngine = new NarrativeEngine();
        
        console.log('GameDataManager initialized with trial data:', this.trialData);
    }
    
    // Add the missing initialize method that experiment.js is trying to call
    initialize(data) {
        if (data) {
            // Update trial data if provided
            this.trialData = data;
            this.totalTrials = this.trialData.length;
        }
        
        // Reset game state
        this.reset();
        
        // Initialize player fleet
        this.initializePlayerFleet();
        
        console.log('GameDataManager initialized with data:', this.trialData);
        return this;
    }
    
    // Initialize the player fleet with default ships
    initializePlayerFleet() {
        // Create three default ships
        this.playerFleet = [
            { id: 0, sprite: null, status: 'active', type: 'allied_ship_green' },
            { id: 1, sprite: null, status: 'active', type: 'allied_ship_blue' },
            { id: 2, sprite: null, status: 'active', type: 'allied_ship_orange' }
        ];
    }
    
    // Set sprite references for the player fleet
    setPlayerFleetSprites(sprites) {
        if (!sprites || sprites.length === 0) return;
        
        sprites.forEach((sprite, index) => {
            if (index < this.playerFleet.length) {
                this.playerFleet[index].sprite = sprite;
            }
        });
    }
    
    // Set up a trial based on the trial index
    setupTrial(trialIndex) {
        if (trialIndex >= this.totalTrials) {
            console.error('Trial index out of bounds:', trialIndex);
            return null;
        }
        
        // Set current trial index
        this.currentTrialIndex = trialIndex;
        
        // Get trial data
        const trial = this.trialData[trialIndex];
        
        // Set asteroid health if specified
        if (trial.asteroidHealth !== undefined) {
            this.asteroidHealth = trial.asteroidHealth;
        }
        
        // Clear existing alien fleet for new trial
        this.alienFleet = [];
        
        // Check if a new alien should spawn
        if (trial.spawnRaider) {
            this.spawnRaider(trial.raiderType, trial.raiderPosition);
        }
        
        console.log(`Trial ${trialIndex} setup complete:`, trial);
        return trial;
    }
    
    // Spawn a new alien raider
    spawnRaider(type = 'red', position = { x: 0.5, y: 0.3 }) {
        // Generate a unique ID for the raider
        const id = this.alienFleet.length + 1;
        
        // Create the raider object
        const raider = {
            id: id,
            type: `raider_${type}`,
            status: 'active',
            position: position,
            health: 1,
            sprite: null
        };
        
        // Add to alien fleet
        this.alienFleet.push(raider);
        
        console.log('Spawned new raider:', raider);
        return raider;
    }
    
    // Set sprite reference for an alien
    setAlienSprite(alienId, sprite) {
        const alien = this.alienFleet.find(a => a.id === alienId);
        if (alien) {
            alien.sprite = sprite;
        }
    }
    
    // Destroy an alien
    destroyAlien(alienId) {
        const alien = this.alienFleet.find(a => a.id === alienId);
        if (alien) {
            alien.status = 'destroyed';
            return true;
        }
        return false;
    }
    
    // Destroy a friendly ship
    destroyFriendlyShip(shipId) {
        const ship = this.playerFleet.find(s => s.id === shipId);
        if (ship) {
            ship.status = 'destroyed';
            this.teamworkLoss += 1;
            return true;
        }
        return false;
    }
    
    // Damage the asteroid
    damageAsteroid(amount) {
        this.asteroidHealth -= amount;
        if (this.asteroidHealth < 0) {
            this.asteroidHealth = 0;
        }
        return this.asteroidHealth;
    }
    
    // Use reinforcements
    useReinforcements() {
        if (this.reinforcementsAvailable) {
            this.reinforcementsAvailable = false;
            return true;
        }
        return false;
    }
    
    // Get active aliens
    getActiveAliens() {
        return this.alienFleet.filter(alien => alien.status === 'active');
    }
    
    // Get active player ships
    getActivePlayerShips() {
        return this.playerFleet.filter(ship => ship.status === 'active');
    }
    
    // Get current game state
    getGameState() {
        return {
            currentTrialIndex: this.currentTrialIndex,
            totalTrials: this.totalTrials,
            playerFleet: this.playerFleet,
            alienFleet: this.alienFleet,
            asteroidHealth: this.asteroidHealth,
            environmentalLoss: this.environmentalLoss,
            teamworkLoss: this.teamworkLoss,
            reception: this.reception,
            trialHistory: this.trialHistory,
            totalBonus: this.totalBonus,
            campaignComplete: this.campaignComplete
        };
    }
    
    // Check if there are more trials
    hasMoreTrials() {
        return this.currentTrialIndex + 1 < this.totalTrials;
    }
    
    // Get next trial index
    getNextTrialIndex() {
        return this.currentTrialIndex + 1;
    }
    
    // Reset the game state for a new session
    reset() {
        this.currentTrialIndex = 0;
        this.playerFleet = [];
        this.alienFleet = [];
        this.asteroidHealth = 100;
        this.reinforcementsAvailable = true;
        this.environmentalLoss = 0;
        this.teamworkLoss = 0;
        this.trialHistory = [];
        this.totalBonus = 0;
        this.campaignComplete = false;
    }
    
    // Generate a tutorial trial (Wave 0) with fixed parameters for learning
    generateTutorialTrial() {
        return {
            trialId: 0,
            waveId: 0,
            trialType: 'tutorial',
            ideal_size: 80, // Raider position
            standard_size: 100, // Asteroid position (fixed)
            n_fleetsize: 3, // Small fleet for tutorial
            p_message: 0.75, // High reception for tutorial
            spawnRaider: true,
            raiderType: 'red',
            raiderPosition: { x: 0.35, y: 0.3 }, // Mapped from ideal_size 80
            // Tutorial-specific metadata
            isTutorial: true,
            tutorialStep: 1,
            timestamp: Date.now()
        };
    }

    // Generate staged trials for Wave 1 (learning curve)
    generateWave1Trials() {
        const wave1Trials = [];
        
        // Create 5 staged trials with clear learning progression
        const stagedConfigs = [
            { ideal_size: 70, n_fleetsize: 3, p_message: 1.0 }, // High reception, easy
            { ideal_size: 80, n_fleetsize: 3, p_message: 0.75 }, // Good reception
            { ideal_size: 90, n_fleetsize: 6, p_message: 0.5 }, // Medium reception, larger fleet
            { ideal_size: 120, n_fleetsize: 6, p_message: 0.25 }, // Low reception
            { ideal_size: 130, n_fleetsize: 9, p_message: 0.5 }  // Complex scenario
        ];
        
        stagedConfigs.forEach((config, index) => {
            const raiderX = 0.2 + (config.ideal_size - 60) / (140 - 60) * 0.6;
            wave1Trials.push({
                trialId: index + 1, // Start after tutorial
                waveId: 1,
                trialType: 'wave',
                ideal_size: config.ideal_size,
                standard_size: 100, // Always fixed
                n_fleetsize: config.n_fleetsize,
                p_message: config.p_message,
                spawnRaider: true,
                raiderType: 'blue',
                raiderPosition: { x: raiderX, y: 0.3 },
                timestamp: Date.now()
            });
        });
        
        return wave1Trials;
    }

    // Generate randomized trials for Waves 2-10
    generateRandomizedWaves() {
        const allTrials = [];
        
        // Parameter pools based on original experiment
        const idealSizes = [60, 70, 80, 120, 130, 140];
        const standardSizes = [100]; // Fixed standard size
        const nFleetsizes = [3, 6, 9]; // Fleet sizes
        const pMessages = [0.25, 0.5, 0.75, 1.0]; // Reception rates
        const raiderTypes = ['red', 'blue', 'green'];
        
        // Create all possible combinations
        const allCombinations = [];
        idealSizes.forEach(ideal_size => {
            standardSizes.forEach(standard_size => {
                nFleetsizes.forEach(n_fleetsize => {
                    pMessages.forEach(p_message => {
                        raiderTypes.forEach(raiderType => {
                            allCombinations.push({
                                ideal_size,
                                standard_size,
                                n_fleetsize,
                                p_message,
                                raiderType
                            });
                        });
                    });
                });
            });
        });
        
        // Randomly sample 45 unique trials (9 waves × 5 trials)
        const sampledCombinations = this.shuffleArray([...allCombinations]);
        const selectedCombinations = sampledCombinations.slice(0, 45);
        
        // Create trials for waves 2-10
        let trialId = 6; // Start after tutorial (1) + wave 1 (5)
        for (let wave = 2; wave <= 10; wave++) {
            for (let trialInWave = 0; trialInWave < 5; trialInWave++) {
                const comboIndex = (wave - 2) * 5 + trialInWave;
                const combo = selectedCombinations[comboIndex];
                
                const raiderX = 0.2 + (combo.ideal_size - 60) / (140 - 60) * 0.6;
                allTrials.push({
                    trialId: trialId++,
                    waveId: wave,
                    trialType: 'wave',
                    ideal_size: combo.ideal_size,
                    standard_size: combo.standard_size,
                    n_fleetsize: combo.n_fleetsize,
                    p_message: combo.p_message,
                    spawnRaider: true,
                    raiderType: combo.raiderType,
                    raiderPosition: { x: raiderX, y: 0.3 },
                    timestamp: Date.now()
                });
            }
        }
        
        // Randomize trials within each wave but keep waves in sequential order (2→3→4→5→6→7→8→9→10)
        const finalTrials = [];
        for (let wave = 2; wave <= 10; wave++) {
            const waveTrials = allTrials.filter(trial => trial.waveId === wave);
            this.shuffleArray(waveTrials); // Only randomize trials within each wave
            finalTrials.push(...waveTrials);
        }
        
        return finalTrials;
    }

    // Generate the complete campaign with tutorial + 10 waves
    generateCompleteCampaign() {
        console.log('Generating complete campaign with tutorial wave and 10 main waves...');
        
        const tutorialTrial = this.generateTutorialTrial();
        const wave1Trials = this.generateWave1Trials();
        const waves2to10Trials = this.generateRandomizedWaves();
        
        const baseCampaign = [tutorialTrial, ...wave1Trials, ...waves2to10Trials];
        
        // Enhanced campaign with narrative context
        const enhancedCampaign = baseCampaign.map((trial, index) => {
            // Calculate wave info for this trial
            const waveTrials = baseCampaign.filter(t => t.waveId === trial.waveId);
            const trialInWave = waveTrials.findIndex(t => t.trialId === trial.trialId) + 1;
            const totalTrialsInWave = waveTrials.length;
            
            // Create waveInfo object that other parts of the system expect
            const waveInfo = {
                waveId: trial.waveId,
                trialType: trial.trialType,
                isTutorial: trial.isTutorial || false,
                trialInWave: trialInWave,
                totalTrialsInWave: totalTrialsInWave
            };
            
            // Generate narrative context for each trial
            const narrative = this.narrativeEngine.generateTrialNarrative(trial);
            const waveContext = this.generateWaveContext(trial.waveId, index);
            
            return {
                ...trial, // All existing experimental data preserved
                waveInfo: waveInfo, // Add the waveInfo structure that other code expects
                trialInWave: trialInWave,
                totalTrialsInWave: totalTrialsInWave,
                isLastInWave: trialInWave === totalTrialsInWave,
                narrative: narrative,
                waveContext: waveContext,
                elenaContext: this.generateElenaContext(trial, index),
                playerHistory: this.getPlayerHistoryContext(index)
            };
        });
        
        console.log(`Enhanced campaign generated: ${enhancedCampaign.length} total trials`);
        console.log(`- Tutorial Wave (Wave 0): 1 trial`);
        console.log(`- Wave 1 (Staged): 5 trials`);
        console.log(`- Waves 2-10 (Randomized): 45 trials`);
        console.log('- Each trial enhanced with Elena Velez narrative context');
        
        return enhancedCampaign;
    }

    // Generate wave-level narrative context
    generateWaveContext(waveId, trialIndex) {
        const waveThemes = {
            0: {
                theme: "Elena's Legacy Training",
                description: "Learn the allocation lever forged from Elena's destroyer",
                context: "This is where every commander's journey begins - with Elena's own controls."
            },
            1: {
                theme: "First Command",
                description: "Your first live-fire mission as tactical officer",
                context: "Elena's ghost watches over your first real battle. Prove yourself worthy of her legacy."
            },
            2: {
                theme: "Communication Crisis",
                description: "Solar interference challenges fleet coordination",
                context: "Elena faced similar blackouts during the Proxima siege. Trust in doctrine when words fail."
            },
            3: {
                theme: "The Raider Swarm",
                description: "Massive enemy formations test tactical flexibility",
                context: "These numbers exceed what Elena faced at Arcturus Prime. Adapt her wisdom to new threats."
            },
            4: {
                theme: "Stealth Protocols",
                description: "Advanced enemy technology demands precision",
                context: "Elena never faced stealth raiders. Your innovation honors her memory."
            },
            5: {
                theme: "Environmental Priority",
                description: "Volatile asteroids threaten nearby colonies",
                context: "Elena died protecting colonies from asteroids. The threat remains as real as ever."
            }
        };

        const defaultTheme = {
            theme: "Tactical Evolution",
            description: "Advanced combat scenarios test command mastery",
            context: "Elena's doctrine evolves through your decisions. Honor the past, embrace the future."
        };

        return waveThemes[waveId] || defaultTheme;
    }

    // Generate Elena-specific context for trial
    generateElenaContext(trial, trialIndex) {
        const elenaContexts = [
            "Elena Velez first touched this lever during the battle of Kepler Station. Feel the weight of history in your hands.",
            "The allocation system responds to your touch just as it did to Elena's. Her final choice saved three colonies.",
            "Elena's tactical doctrine emphasized asteroid threats. 'The rock is death incarnate,' she would say.",
            "Commander Velez faced impossible odds with a skeleton crew. You have more ships - use them wisely.",
            "Elena's last transmission: 'Focus fire on what matters most. The fleet will remember your choice.'"
        ];

        // Cycle through contexts or pick based on trial characteristics
        const contextIndex = trialIndex % elenaContexts.length;
        return elenaContexts[contextIndex];
    }

    // Generate player history context for personalization
    getPlayerHistoryContext(trialIndex) {
        if (trialIndex === 0) {
            return "Your command begins here. Elena herself once stood where you stand now.";
        }

        // Use narrative engine to get personalized context based on performance
        const reputation = this.narrativeEngine.playerLegacy.reputation;
        const stance = this.narrativeEngine.playerLegacy.doctrinalStance;

        return this.narrativeEngine.getPersonalizedNarrative();
    }

    // Generate a random trial with randomized parameters based on original experiment
    generateRandomTrial() {
        // Parameter pools based on original experiment
        const idealSizes = [60, 70, 80, 90, 100, 110, 120, 130, 140];
        const standardSizes = [100]; // Fixed standard size
        const nEngineers = [3, 6, 9]; // Fleet sizes
        const pMessages = [0, 0.25, 0.5, 0.75, 1.0]; // Reception rates
        const raiderTypes = ['red', 'blue', 'green'];
        
        // Randomly select parameters
        const ideal_size = idealSizes[Math.floor(Math.random() * idealSizes.length)];
        const standard_size = standardSizes[0]; // Always 100
        const n_fleetsize = nEngineers[Math.floor(Math.random() * nEngineers.length)];
        const p_message = pMessages[Math.floor(Math.random() * pMessages.length)];
        const raiderType = raiderTypes[Math.floor(Math.random() * raiderTypes.length)];
        
        // Map ideal_size to raider position (0.2 to 0.8 range)
        const raiderX = 0.2 + (ideal_size - 60) / (140 - 60) * 0.6;
        const raiderPosition = { x: raiderX, y: 0.3 };
        
        return {
            trialId: this.trialData.length,
            ideal_size,
            standard_size,
            n_fleetsize,
            p_message,
            spawnRaider: true,
            raiderType,
            raiderPosition,
            // Additional metadata
            trialType: 'random',
            timestamp: Date.now()
        };
    }

    // Generate a complete campaign of trials (legacy method - use generateCompleteCampaign instead)
    generateCampaignTrials(numTrials = 10) {
        console.log(`Generating campaign with ${numTrials} trials...`);
        
        const campaign = [];
        
        // Generate trials
        for (let i = 0; i < numTrials; i++) {
            const trial = this.generateRandomTrial();
            trial.trialId = i;
            campaign.push(trial);
        }
        
        // Shuffle the trials for randomization
        this.shuffleArray(campaign);
        
        console.log('Campaign trials generated:', campaign);
        return campaign;
    }
    
    // Shuffle array utility function
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // Record trial results with narrative tracking
    recordTrialResult(trialData) {
        // New lever mechanic: allocation is a value 0-1 (1 = 100% raider, 0 = 100% asteroid)
        // Store actual fleet assignments and scoring
        const result = {
            trialIndex: this.currentTrialIndex,
            trialId: trialData.trialId || this.currentTrialIndex,
            allocation: trialData.allocation, // 0-1, from lever
            fleetToRaider: trialData.fleetToRaider, // number of ships that attacked raider
            fleetToAsteroid: trialData.fleetToAsteroid, // number of ships that attacked asteroid
            adaptationLoss: trialData.adaptationLoss, // distance from ideal allocation
            coordinationLoss: trialData.coordinationLoss, // distance from standard allocation
            bonus: trialData.bonus, // bonus for the round
            n_received: trialData.n_received, // comms integrity (ships that received message)
            n_fleetsize: trialData.n_fleetsize, // fleet size
            p_message: trialData.p_message, // comms integrity (probability)
            ideal_size: trialData.ideal_size, // ideal allocation (for adaptation)
            standard_size: trialData.standard_size, // standard allocation (for coordination)
            timestamp: Date.now(),
            // Narrative metadata (doesn't affect experimental analysis)
            narrative_context: {
                player_reputation: this.narrativeEngine.playerLegacy.reputation,
                doctrinal_stance: this.narrativeEngine.playerLegacy.doctrinalStance,
                elena_wisdom: this.narrativeEngine.getElenaLore('sacrifice'),
                trial_narrative: trialData.narrative || {}
            }
        };
        
        // Update narrative engine with performance data
        this.narrativeEngine.updatePlayerLegacy(result);
        
        // Remove legacy fields: playerChoice, targetType, env_loss, social_loss, total_loss
        this.trialHistory.push(result);
        this.totalBonus += trialData.bonus || 0;
        console.log('Trial result recorded with narrative context:', result);
        return result;
    }
    
    // Get trial briefing text based on current trial parameters
    getTrialBriefing() {
        const trial = this.getCurrentTrial();
        if (!trial) return "Mission briefing unavailable.";
        
        const waveInfo = trial.waveInfo;
        const fleetSize = trial.n_fleetsize || 3;
        const reception = trial.p_message || 0.7;
        const receptionPercent = Math.round(reception * 100);
        
        let title, briefing;
        
        if (trial.isTutorial) {
            title = "Tutorial Wave - Interactive Training";
            briefing = `Welcome to your first simulation! This tutorial will teach you the basics of fleet command. Fleet Size: ${fleetSize} ships | Comms Integrity: ${receptionPercent}% | Pay attention to the targeting system.`;
        } else {
            title = `Wave ${waveInfo.waveId} - Mission ${trial.trialInWave}/${trial.totalTrialsInWave}`;
            briefing = `Fleet Size: ${fleetSize} ships | Comms Integrity: ${receptionPercent}% | Choose your target wisely.`;
        }
        
        return {
            title: title,
            waveId: waveInfo.waveId,
            trialInWave: trial.trialInWave,
            totalTrialsInWave: trial.totalTrialsInWave,
            fleetSize: fleetSize,
            reception: reception,
            receptionPercent: receptionPercent,
            briefing: briefing,
            isTutorial: trial.isTutorial
        };
    }
    
    // Check if campaign is complete
    isCampaignComplete() {
        return this.currentTrialIndex >= this.totalTrials - 1;
    }
    
    // Get campaign summary
    getCampaignSummary() {
        // Add allocation-based summary fields
        const totalAdaptationLoss = this.trialHistory.reduce((sum, r) => sum + (r.adaptationLoss || 0), 0);
        const totalCoordinationLoss = this.trialHistory.reduce((sum, r) => sum + (r.coordinationLoss || 0), 0);
        return {
            totalTrials: this.totalTrials,
            completedTrials: this.trialHistory.length,
            totalBonus: this.totalBonus,
            averageBonus: this.trialHistory.length > 0 ? this.totalBonus / this.trialHistory.length : 0,
            totalAdaptationLoss,
            totalCoordinationLoss,
            averageAdaptationLoss: this.trialHistory.length > 0 ? totalAdaptationLoss / this.trialHistory.length : 0,
            averageCoordinationLoss: this.trialHistory.length > 0 ? totalCoordinationLoss / this.trialHistory.length : 0,
            campaignComplete: this.campaignComplete
        };
    }

    // Get current wave information
    getCurrentWave() {
        const currentTrial = this.trialData[this.currentTrialIndex];
        if (!currentTrial) return null;
        
        return {
            waveId: currentTrial.waveId,
            trialType: currentTrial.trialType,
            isTutorial: currentTrial.isTutorial || false,
            trialInWave: this.getTrialInCurrentWave(),
            totalTrialsInWave: this.getTotalTrialsInCurrentWave()
        };
    }
    
    // Get the trial number within the current wave (1-5)
    getTrialInCurrentWave() {
        const currentTrial = this.trialData[this.currentTrialIndex];
        if (!currentTrial) return 0;
        
        if (currentTrial.isTutorial) return 1; // Tutorial is always trial 1 of wave 0
        
        // Count trials in current wave up to this point
        const waveTrials = this.trialData.filter(trial => trial.waveId === currentTrial.waveId);
        const trialIndexInWave = waveTrials.findIndex(trial => trial.trialId === currentTrial.trialId);
        return trialIndexInWave + 1;
    }
    
    // Get total number of trials in current wave
    getTotalTrialsInCurrentWave() {
        const currentTrial = this.trialData[this.currentTrialIndex];
        if (!currentTrial) return 0;
        
        if (currentTrial.isTutorial) return 1; // Tutorial wave has 1 trial
        
        const waveTrials = this.trialData.filter(trial => trial.waveId === currentTrial.waveId);
        return waveTrials.length;
    }
    
    // Get all trials in current wave
    getCurrentWaveTrials() {
        const currentTrial = this.trialData[this.currentTrialIndex];
        if (!currentTrial) return [];
        
        return this.trialData.filter(trial => trial.waveId === currentTrial.waveId);
    }
    
    // Check if current trial is the last in the wave
    isLastTrialInWave() {
        return this.getTrialInCurrentWave() === this.getTotalTrialsInCurrentWave();
    }
    
    // Get wave summary for the current wave
    getCurrentWaveSummary() {
        const currentTrial = this.trialData[this.currentTrialIndex];
        if (!currentTrial) return null;
        
        const waveTrials = this.getCurrentWaveTrials();
        const waveResults = this.trialHistory.filter(result => 
            waveTrials.some(trial => trial.trialId === result.trialId)
        );
        
        const totalBonus = waveResults.reduce((sum, result) => sum + (result.bonus || 0), 0);
        const averageBonus = waveResults.length > 0 ? totalBonus / waveResults.length : 0;
        
        return {
            waveId: currentTrial.waveId,
            trialType: currentTrial.trialType,
            isTutorial: currentTrial.isTutorial || false,
            totalTrials: waveTrials.length,
            completedTrials: waveResults.length,
            totalBonus: totalBonus,
            averageBonus: averageBonus,
            isComplete: waveResults.length === waveTrials.length
        };
    }

    // Get current trial data with wave information
    getCurrentTrial() {
        const trial = this.trialData[this.currentTrialIndex];
        if (!trial) return null;
        
        return {
            ...trial,
            waveInfo: this.getCurrentWave(),
            trialInWave: this.getTrialInCurrentWave(),
            totalTrialsInWave: this.getTotalTrialsInCurrentWave(),
            isLastInWave: this.isLastTrialInWave()
        };
    }
    
    // Store fleet data for consistency between scenes
    setCurrentFleetData(fleetData) {
        this.currentFleetData = fleetData;
        console.log('Fleet data stored in GameDataManager:', fleetData);
    }
    
    // Get current fleet data
    getCurrentFleetData() {
        return this.currentFleetData || [];
    }
}
