class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.tutorialMode = true;
    }

    init() {
        this.gameDataManager = this.registry.get('gameDataManager');
        if (!this.gameDataManager) {
            console.error('GameDataManager not found in registry!');
        } else {
            console.log('GameScene initialized with GameDataManager');
        }
    }

    create() {
        console.log('GameScene create method started');
        
        // Get current trial data to check if this is a tutorial
        const currentTrial = this.gameDataManager.getCurrentTrial();
        const isTutorial = currentTrial && currentTrial.isTutorial;
        
        console.log('Current trial:', currentTrial);
        console.log('Is tutorial:', isTutorial);
        
        // Set tutorial mode based on current trial
        this.tutorialMode = isTutorial;
        
        // Create explosion animation with exact frame numbers
        this.anims.create({
            key: 'explosion_anim',
            frames: this.anims.generateFrameNumbers('explosion_sprite_strip', {
                frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
            }),
            frameRate: 20,
            repeat: 0
        });
        
        // Draw the static environment
        this.createBackground();
        this.createCockpit();
        this.createAsteroid();
        
        // Create tutorial-specific objects (initially hidden)
        this.createTutorialObjects();
        
        if (isTutorial) {
            // For tutorial wave, launch TutorialUIScene
            this.scene.launch('TutorialUIScene');
            console.log('TutorialUIScene launched for tutorial wave');
        } else {
            // For regular trials, set up trial data and launch HUDScene
            this.setupTrialForGame();
            this.scene.launch('HUDScene');
            console.log('HUDScene launched for regular trial');
        }
    }
    
    createBackground() {
        // Create starfield background
        this.starfield = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'starfield');
        this.starfield.setOrigin(0, 0);
        this.starfield.setScrollFactor(0);
    }
    
    createCockpit() {
        // Add the cockpit frame with the correct asset name
        this.cockpit = this.add.image(0, 0, 'cockpit');
        this.cockpit.setOrigin(0, 0);
        this.cockpit.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        this.cockpit.setScrollFactor(0);
        this.cockpit.setDepth(10); // Make sure cockpit is in front of other elements
    }
    
    createAsteroid() {
        // Add the main asteroid in the distance with the correct asset name
        this.asteroid = this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'asteroid_large'  // Using the correct asset name
        );
        this.asteroid.setScale(0.5);
        this.asteroid.setAlpha(0.7); // Make it slightly transparent to indicate it's in the distance
        this.asteroid.setDepth(1);
    }
    
    createTutorialObjects() {
        try {
            // Create the tutorial raider (initially hidden) with the correct asset name
            this.tutorialRaider = this.add.image(
                this.cameras.main.width * 0.4,
                this.cameras.main.height * 0.5,
                'raider_red'  // Using the correct asset name
            );
            this.tutorialRaider.setScale(0.3);
            this.tutorialRaider.setDepth(2);
            this.tutorialRaider.setVisible(false);
            
            // Remove creation of extra allied ships in the cockpit window area
            this.tutorialAllies = [];
            // (No allied ships created in the window area)
            
            // Create the target markers (initially hidden)
            this.standardMarker = this.add.image(
                this.asteroid.x,
                this.asteroid.y,
                'standard_marker'
            );
            this.standardMarker.setScale(0.5);
            this.standardMarker.setDepth(3);
            this.standardMarker.setVisible(false);
            
            this.tacticalMarker = this.add.image(
                this.tutorialRaider.x,
                this.tutorialRaider.y,
                'standard_marker'
            );
            this.tacticalMarker.setScale(0.5);
            this.tacticalMarker.setDepth(3);
            this.tacticalMarker.setTint(0xff0000); // Red tint for tactical marker
            this.tacticalMarker.setVisible(false);
            
            console.log('Tutorial objects created successfully');
        } catch (error) {
            console.error('Error creating tutorial objects:', error);
        }
    }
    
    // Tutorial event functions called by TutorialUIScene
    focusTutorialAsteroid() {
        try {
            // Highlight the asteroid with a pulsing effect
            this.tweens.add({
                targets: this.asteroid,
                scale: 0.6,
                duration: 1000,
                yoyo: true,
                repeat: 1,
                ease: 'Sine.easeInOut'
            });
            console.log('Asteroid focus animation started');
        } catch (error) {
            console.error('Error in focusTutorialAsteroid:', error);
        }
    }
    
    showTutorialRaider() {
        try {
            // Show the raider ship with an entrance animation
            this.tutorialRaider.setVisible(true);
            this.tutorialRaider.setAlpha(0);
            this.tutorialRaider.setScale(0.1);
            
            // Animate the raider flying in
            this.tweens.add({
                targets: this.tutorialRaider,
                alpha: 1,
                scale: 0.3,
                x: this.cameras.main.width * 0.6,
                y: this.cameras.main.height * 0.5,
                duration: 1500,
                ease: 'Power2'
            });
            console.log('Raider animation started');
        } catch (error) {
            console.error('Error in showTutorialRaider:', error);
        }
    }
    
    showTutorialAllies() {
        try {
            // No allied ships to show in the cockpit window area
            console.log('No extra allies to show in cockpit window area');
        } catch (error) {
            console.error('Error in showTutorialAllies:', error);
        }
    }
    
    showTutorialTargetOptions() {
        try {
            // Show the standard and tactical markers
            this.standardMarker.setVisible(true);
            this.tacticalMarker.setVisible(true);
            
            // Add pulsing animation to both markers
            this.tweens.add({
                targets: [this.standardMarker, this.tacticalMarker],
                alpha: { from: 0.5, to: 1 },
                scale: { from: 0.4, to: 0.5 },
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            console.log('Target markers animation started');
        } catch (error) {
            console.error('Error in showTutorialTargetOptions:', error);
        }
    }
    
    prepareForMission() {
        try {
            console.log('Preparing tutorial for interactive training mode');
            
            // Keep tutorial mode active for interactive training
            this.tutorialMode = true;
            
            // Make sure tutorial raider is visible and positioned correctly
            if (this.tutorialRaider) {
                this.tutorialRaider.setVisible(true);
                this.tutorialRaider.setAlpha(1);
                this.tutorialRaider.setScale(0.3);
            }
            
            // Create dynamic fleet for tutorial (if not already created)
            this.createTutorialFleet();
            
            console.log('Tutorial interactive mode prepared');
        } catch (error) {
            console.error('Error in prepareForMission:', error);
        }
    }
    
    // Create tutorial fleet for interactive training
    createTutorialFleet() {
        if (this.trialFleet) {
            // Fleet already exists
            return;
        }
        
        console.log('Creating tutorial fleet for interactive training');
        
        this.trialFleet = [];
        const fleetSize = 3; // Tutorial uses 3 ships
        const shipTypes = ['allied_ship_green', 'allied_ship_blue', 'allied_ship_orange'];
        
        // Place ships along the bottom row, evenly spaced
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const margin = 60;
        const bottomY = height - margin;
        
        // Store fleet data in GameDataManager for consistency with FeedbackScene
        const fleetData = [];
        
        for (let i = 0; i < fleetSize; i++) {
            const shipType = shipTypes[i % shipTypes.length];
            const x = width * (i + 1) / (fleetSize + 1);
            const y = bottomY;
            const ship = this.add.image(x, y, shipType);
            ship.setScale(0.25);
            ship.setDepth(11);
            ship.setAlpha(1);
            this.trialFleet.push(ship);
            
            // Store fleet data for FeedbackScene consistency
            fleetData.push({
                id: i,
                type: shipType,
                originalX: x,
                originalY: y,
                scale: 0.25
            });
        }
        
        // Store fleet data in GameDataManager
        this.gameDataManager.setCurrentFleetData(fleetData);
        
        console.log(`Tutorial fleet created with ${fleetSize} ships`);
    }
    
    startRealGame() {
        console.log('Starting the real game (Trial 1)');
        
        try {
            // Clean up tutorial objects
            this.tutorialRaider.setVisible(false);
            this.tutorialAllies.forEach(ally => ally.setVisible(false));
            this.standardMarker.setVisible(false);
            this.tacticalMarker.setVisible(false);
            
            // Set tutorial mode to false
            this.tutorialMode = false;
            
            // Start the first trial from the GameDataManager
            if (this.gameDataManager) {
                const trial = this.gameDataManager.setupTrial(0); // Start with trial index 0
                console.log('First trial set up from GameDataManager:', trial);
                
                // Create raiders based on trial data
                this.createTrialRaiders();
                
                // Create dynamic fleet based on trial data
                this.createDynamicFleet();
            } else {
                console.error('GameDataManager not available!');
            }
            
            // Launch the HUD scene for the real game
            this.scene.launch('HUDScene');
            console.log('HUDScene launched for real game');
        } catch (error) {
            console.error('Error in startRealGame:', error);
        }
    }
    
    // Create raiders based on current trial data
    createTrialRaiders() {
        if (!this.gameDataManager || this.tutorialMode) return;
        
        const trial = this.gameDataManager.getCurrentTrial();
        if (!trial || !trial.spawnRaider) {
            console.log('No trial data or spawnRaider is false');
            return;
        }
        
        console.log('Creating raider for trial:', trial);
        
        // Clear any existing raiders
        if (this.trialRaiders) {
            this.trialRaiders.forEach(raider => raider.destroy());
        }
        this.trialRaiders = [];
        
        // Create raider based on trial data
        const raider = this.add.image(
            this.cameras.main.width * trial.raiderPosition.x,
            this.cameras.main.height * trial.raiderPosition.y,
            `raider_${trial.raiderType}`
        );
        raider.setScale(0.3);
        raider.setDepth(2);
        
        // Add entrance animation
        raider.setAlpha(0);
        raider.setScale(0.1);
        this.tweens.add({
            targets: raider,
            alpha: 1,
            scale: 0.3,
            duration: 1000,
            ease: 'Power2'
        });
        
        this.trialRaiders.push(raider);
        
        // Register with GameDataManager
        const alienFleet = this.gameDataManager.getActiveAliens();
        if (alienFleet.length > 0) {
            this.gameDataManager.setAlienSprite(alienFleet[0].id, raider);
        }
        
        console.log('Trial raider created:', raider);
    }
    
    // Create dynamic fleet based on trial data
    createDynamicFleet() {
        if (!this.gameDataManager || this.tutorialMode) return;
        
        const trial = this.gameDataManager.getCurrentTrial();
        if (!trial) {
            console.log('No trial data for fleet creation');
            return;
        }
        
        console.log('Creating dynamic fleet for trial:', trial);
        
        // Clear any existing trial fleet
        if (this.trialFleet) {
            this.trialFleet.forEach(ship => ship.destroy());
        }
        this.trialFleet = [];
        
        const fleetSize = trial.n_fleetsize || 3;
        const shipTypes = ['allied_ship_green', 'allied_ship_blue', 'allied_ship_orange'];
        
        console.log(`Creating fleet with ${fleetSize} ships`);
        
        // Place ships along the bottom row, evenly spaced
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const margin = 60;
        const bottomY = height - margin;
        
        // Store fleet data in GameDataManager for consistency with FeedbackScene
        const fleetData = [];
        
        for (let i = 0; i < fleetSize; i++) {
            const shipType = shipTypes[i % shipTypes.length];
            const x = width * (i + 1) / (fleetSize + 1);
            const y = bottomY;
            const ship = this.add.image(x, y, shipType);
            ship.setScale(0.25);
            ship.setDepth(11);
            // Add entrance animation
            ship.setAlpha(0);
            ship.setScale(0.1);
            this.tweens.add({
                targets: ship,
                alpha: 1,
                scale: 0.25,
                duration: 800,
                delay: i * 200,
                ease: 'Power2'
            });
            this.trialFleet.push(ship);
            
            // Store fleet data for FeedbackScene consistency
            fleetData.push({
                id: i,
                type: shipType,
                originalX: x,
                originalY: y,
                scale: 0.25
            });
        }
        
        // Store fleet data in GameDataManager
        this.gameDataManager.setCurrentFleetData(fleetData);
        
        console.log(`Dynamic fleet created with ${fleetSize} ships`);
    }
    
    createExplosion(x, y) {
        // Create an explosion sprite and play the animation
        const explosion = this.add.sprite(x, y, 'explosion_sprite_strip');
        explosion.play('explosion_anim');
        
        // Play explosion sound
        try {
            if (this.sound.get('explosionCrunch_002')) {
                this.sound.play('explosionCrunch_002', { volume: 0.7 });
            }
            if (this.sound.get('lowFrequency_explosion_000')) {
                this.sound.play('lowFrequency_explosion_000', { volume: 0.5 });
            }
        } catch (e) {
            console.warn('Error playing explosion sound:', e);
        }
        
        return explosion;
    }
    
    update() {
        // Slowly scroll the starfield for a space-travel effect
        this.starfield.tilePositionY -= 0.5;
        
        // If in tutorial mode, make the raider slowly move
        if (this.tutorialMode && this.tutorialRaider && this.tutorialRaider.visible) {
            this.tutorialRaider.x += Math.sin(this.time.now / 1000) * 0.5;
            this.tutorialRaider.y += Math.cos(this.time.now / 1000) * 0.3;
        }
    }
    
    /**
     * Reset the scene for a new trial
     */
    resetForNewTrial() {
        console.log('GameScene: Resetting for new trial');
        
        // Reset tutorial mode to false for real game trials
        this.tutorialMode = false;
        
        // Hide tutorial objects
        if (this.tutorialRaider) {
            this.tutorialRaider.setVisible(false);
        }
        
        if (this.tutorialAllies) {
            this.tutorialAllies.forEach(ally => ally.setVisible(false));
        }
        
        if (this.standardMarker) {
            this.standardMarker.setVisible(false);
        }
        
        if (this.tacticalMarker) {
            this.tacticalMarker.setVisible(false);
        }
        
        // Reset asteroid to default state
        if (this.asteroid) {
            this.asteroid.setScale(0.5);
            this.asteroid.setAlpha(0.7);
        }
        
        // Create new trial raiders and fleet
        this.createTrialRaiders();
        this.createDynamicFleet();
        
        console.log('GameScene: Reset complete');
    }

    // Set up trial data for non-tutorial trials
    setupTrialForGame() {
        console.log('Setting up trial for regular game');
        
        try {
            // Clean up any tutorial objects
            if (this.tutorialRaider) this.tutorialRaider.setVisible(false);
            if (this.tutorialAllies) {
                this.tutorialAllies.forEach(ally => ally.setVisible(false));
            }
            if (this.standardMarker) this.standardMarker.setVisible(false);
            if (this.tacticalMarker) this.tacticalMarker.setVisible(false);
            
            // Create raiders based on trial data
            this.createTrialRaiders();
            
            // Create dynamic fleet based on trial data
            this.createDynamicFleet();
            
            console.log('Trial setup complete for regular game');
        } catch (error) {
            console.error('Error in setupTrialForGame:', error);
        }
    }
}
