class TutorialUIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TutorialUIScene' });
        
        // Enhanced Elena Velez tutorial script
        this.tutorialSteps = [
            {
                text: 'Stardate 2247. Three generations have passed since the Great Exodus from dying Earth.\nThis colony—New Terra—is humanity\'s last sanctuary among the stars.\n\nYou stand where Admiral Valderon once stood during the Siege of Proxima,\nwhere Captain Montejo made his final stand at Kepler Station.\n\nWelcome, Tactical Officer. The bloodline of heroes flows through this chair.\n\n(Click to continue)',
                event: null
            },
            {
                text: 'Behold the Velez Deathstar—named after Commander Elena Velez,\nthe first to encounter this harbinger of extinction at Arcturus Prime.\n\nElena held it back with her skeleton crew, saving countless lives\nbut losing her ship in the desperate fight.\n\nIf this asteroid reaches our atmosphere, nothing else matters.\nElena\'s sacrifice taught us that.\n\n(Click to continue)',
                event: 'focusAsteroid'
            },
            {
                text: 'The asteroid spawns Raider ships—living weapons evolved\nfrom centuries of cosmic radiation and war.\n\nElena discovered they\'re drawn to energy signatures.\nThe more we attack the asteroid, the more Raiders emerge.\n\nBut here\'s the terrible choice: destroy the Raiders quickly,\nor they\'ll overwhelm us. Yet focus too much on Raiders,\nand the asteroid itself becomes unstoppable.\n\n(Click to continue)',
                event: 'showRaider'
            },
            {
                text: 'Your fleet awaits your command. These ships carry the hopes\nof every soul in New Terra.\n\nElena commanded with a skeleton crew of just three ships\nat Arcturus Prime. You have the same—or perhaps more.\n\nEvery pilot trusts you with their life. Elena would say:\n"Lead them well, for they are all that stands between hope and oblivion."\n\n(Click to continue)',
                event: 'showAllies'
            },
            {
                text: 'To battle, you must allocate your fleet\'s firepower. Your console provides a lever—forged from the hull of Elena Velez\'s destroyer, salvaged from the wreckage at Arcturus Prime.\n\nTo focus firepower against the asteroid, you must follow Elena\'s doctrine: "The rock is death incarnate." But to hold off the horde, you have to adapt and overcome the Raiders through Tactical Innovation—eliminate immediate threats.\n\nElena\'s final transmission: "Focus fire on what matters most. The fleet will remember your choice."\n\nBut the choice... is yours.\n\n(Click to continue)',
                event: 'showTargetOptions'
            },
            {
                text: 'Before you head into battle, we\'ll take you through a guided wave\nto help you master Elena\'s controls and understand the weight of command.\n\nRemember: Elena faced impossible odds and became a legend.\nEvery commander since has walked in her shadow.\n\nToday, you join their ranks. Today, you decide New Terra\'s fate.\n\n(Click to Begin Elena\'s Training)',
                event: 'prepareForMission'
            }
        ];
    }

    init() {
        this.currentStep = 0;
        
        // Get reference to GameDataManager for narrative integration
        this.gameData = this.registry.get('gameDataManager');
        
        // Initialize ship and lever references
        this.leftShip = null;
        this.rightShip = null;
        this.elenaLever = null;
        
        console.log('TutorialUIScene initialized with Elena Velez narrative system');
    }

    create() {
        console.log('TutorialUIScene created - starting dialogue system');
        
        // Make this scene transparent so the GameScene is visible underneath
        this.cameras.main.setBackgroundColor('rgba(0, 0, 0, 0)');
        
        // Create the tutorial text first - positioned at very TOP of screen
        this.tutorialText = this.add.text(
            this.cameras.main.width / 2, 
            120, // Moved higher from 180 to 120 for consistency with HUDScene
            '',
            {
                fontFamily: 'Arial',
                fontSize: '13px',
                color: '#ffffff',
                align: 'center',
                wordWrap: { width: 650, useAdvancedWrap: true }
            }
        ).setOrigin(0.5);
        this.tutorialText.setDepth(11);
        
        // Create placeholder panel at TOP - will be resized dynamically
        this.textPanel = this.add.rectangle(
            this.cameras.main.width / 2,
            120, // Moved higher from 180 to 120 for consistency
            700,
            160,
            0x000000,
            0.85
        ).setOrigin(0.5);
        this.textPanel.setStrokeStyle(2, 0x3399ff);
        this.textPanel.setDepth(10);
        
        // Add click handler to advance through tutorial
        this.input.on('pointerdown', this.advanceTutorial, this);
        
        // Start with the first step
        this.showCurrentStep();
        
        console.log('Tutorial dialogue box created and positioned at top');
    }
    
    /**
     * Dynamically resize the dialogue panel based on text content
     * @param {string} text - The text content to measure
     */
    resizeDialoguePanel(text) {
        // Set the text to measure its size
        this.tutorialText.setText(text);
        
        // Calculate required dimensions with padding
        const textBounds = this.tutorialText.getBounds();
        const minWidth = 700;
        const minHeight = 160;
        const padding = 40;
        
        const requiredWidth = Math.max(minWidth, textBounds.width + padding);
        const requiredHeight = Math.max(minHeight, textBounds.height + padding);
        
        // Update panel size
        this.textPanel.setSize(requiredWidth, requiredHeight);
        
        // Keep panel at top of screen with higher positioning
        const panelY = 80 + (requiredHeight / 2); // Moved higher from 120 to 80 for better top positioning
        this.textPanel.setY(panelY);
        this.tutorialText.setY(panelY);
        
        console.log(`Resized dialogue panel: ${requiredWidth}x${requiredHeight} at Y:${panelY} (top position)`);
    }
    
    /**
     * Add typewriter effect to progressively reveal text
     * @param {string} text - The full text to reveal
     * @param {function} onComplete - Callback when typewriting is complete
     */
    typewriteText(text, onComplete) {
        // Clear existing text
        this.tutorialText.setText('');
        
        let currentChar = 0;
        const totalChars = text.length;
        
        const typeChar = () => {
            if (currentChar <= totalChars) {
                this.tutorialText.setText(text.substring(0, currentChar));
                currentChar++;
                
                // Variable typing speed for dramatic effect
                let delay = 5;
                if (text[currentChar - 1] === '.') delay = 30;
                else if (text[currentChar - 1] === ',') delay = 15;
                else if (text[currentChar - 1] === '\n') delay = 25;
                else if (text[currentChar - 1] === ' ') delay = 3;
                
                this.time.delayedCall(delay, typeChar);
            } else {
                if (onComplete) onComplete();
            }
        };
        
        typeChar();
    }
    
    showCurrentStep() {
        // Get the current step data
        const step = this.tutorialSteps[this.currentStep];
        
        console.log(`Showing tutorial step ${this.currentStep + 1}/${this.tutorialSteps.length}:`, step.text.substring(0, 50) + '...');
        
        // Resize panel for current text (using full text for sizing)
        this.resizeDialoguePanel(step.text);
        
        // Make sure the panel is visible
        this.textPanel.setVisible(true);
        this.tutorialText.setVisible(true);
        
        // Start typewriter effect
        this.typewriteText(step.text, () => {
            console.log('Typewriter effect completed for step', this.currentStep + 1);
        });
        
        // Trigger the associated event if there is one
        if (step.event) {
            console.log('Triggering event:', step.event);
            this.triggerEvent(step.event);
        }
    }
    
    advanceTutorial() {
        // Move to the next step
        this.currentStep++;
        
        // Check if we've reached the end of the tutorial
        if (this.currentStep >= this.tutorialSteps.length) {
            this.endTutorial();
            return;
        }
        
        // Show the next step
        this.showCurrentStep();
    }
    
    triggerEvent(eventName) {
        // Get a reference to the GameScene
        const gameScene = this.scene.get('GameScene');
        
        // Trigger the appropriate event based on the name
        switch(eventName) {
            case 'focusAsteroid':
                gameScene.focusTutorialAsteroid();
                break;
            case 'showRaider':
                gameScene.showTutorialRaider();
                break;
            case 'showAllies':
                this.showTutorialShips();
                gameScene.showTutorialAllies();
                break;
            case 'showTargetOptions':
                this.showElenasLever();
                gameScene.showTutorialTargetOptions();
                break;
            case 'prepareForMission':
                gameScene.prepareForMission();
                break;
            default:
                console.warn(`Unknown event: ${eventName}`);
        }
    }
    
    /**
     * Show tutorial ships flying in from the sides
     */
    showTutorialShips() {
        console.log('Showing tutorial ships flying in from sides');
        
        // Create left ship - starts off-screen left, flies in facing toward center
        this.leftShip = this.add.image(-100, this.cameras.main.height / 2 + 20, 'allied_ship_green');
        this.leftShip.setScale(0.8);
        this.leftShip.setRotation(0.8); // Much more aggressive angle toward center
        this.leftShip.setDepth(5);
        
        // Create right ship - starts off-screen right, flies in facing toward center  
        this.rightShip = this.add.image(this.cameras.main.width + 100, this.cameras.main.height / 2 + 20, 'allied_ship_orange');
        this.rightShip.setScale(0.8);
        this.rightShip.setRotation(-0.8); // Much more aggressive angle toward center
        this.rightShip.setFlipX(true); // Flip to face inward
        this.rightShip.setDepth(5);
        
        // Animate left ship flying in
        this.tweens.add({
            targets: this.leftShip,
            x: 150,
            duration: 2000,
            ease: 'Power2'
        });
        
        // Animate right ship flying in
        this.tweens.add({
            targets: this.rightShip,
            x: this.cameras.main.width - 150,
            duration: 2000,
            ease: 'Power2'
        });
        
        // Add gentle floating animation to both ships
        this.tweens.add({
            targets: [this.leftShip, this.rightShip],
            y: '+=10',
            duration: 3000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
    }
    
    /**
     * Show Elena's lever with glowing effect
     */
    showElenasLever() {
        console.log('Showing Elena\'s lever with glow effect');
        
        // Destroy any previous lever to avoid duplicates
        if (this.elenaLever) {
            this.elenaLever.destroy();
            this.elenaLever = null;
        }
        
        // Try to create the lever image
        try {
            this.elenaLever = this.add.image(
                this.cameras.main.width / 2, 
                this.cameras.main.height - 250, // Higher position for better visibility
                'standard_marker'
            );
            this.elenaLever.setScale(1.2);
            this.elenaLever.setDepth(100); // Max depth to ensure it's visible above all elements
            this.elenaLever.setTint(0xffd700); // Golden tint for the legendary lever
            this.elenaLever.setAlpha(1); // Ensure it's fully opaque
            // Add debug border (temporary)
            this.elenaLever.setStroke = () => {};
            console.log('Lever image created at', this.elenaLever.x, this.elenaLever.y, 'depth', this.elenaLever.depth);
        } catch (e) {
            // Fallback: draw a rectangle if asset fails
            this.elenaLever = this.add.rectangle(
                this.cameras.main.width / 2,
                this.cameras.main.height - 250,
                60, 60, 0xffd700, 0.7
            );
            this.elenaLever.setDepth(100);
            console.warn('Lever asset missing, drew fallback rectangle.');
        }
        
        // Add pulsing glow effect
        this.tweens.add({
            targets: this.elenaLever,
            scaleX: 1.4,
            scaleY: 1.4,
            duration: 1500,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
        
        // Add alpha pulsing for extra glow
        this.tweens.add({
            targets: this.elenaLever,
            alpha: 0.7,
            duration: 2000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
        
        // Add particles for magical effect
        if (this.add.particles) {
            try {
                const particles = this.add.particles(
                    this.cameras.main.width / 2, 
                    this.cameras.main.height - 250,
                    'standard_marker',
                    {
                        scale: { start: 0.1, end: 0 },
                        speed: { min: 10, max: 30 },
                        quantity: 2,
                        lifespan: 1000,
                        tint: 0xffd700,
                        alpha: { start: 0.8, end: 0 }
                    }
                );
                particles.setDepth(99);
                console.log('Lever particles created successfully');
            } catch (error) {
                console.warn('Particles not available, lever will show without particle effect:', error);
            }
        }
        
        console.log(`Elena's lever created at position: ${this.cameras.main.width / 2}, ${this.cameras.main.height - 250}, depth 100`);
    }
    
    endTutorial() {
        console.log('Tutorial narrative completed, transitioning to interactive training');
        
        // Hide the tutorial narrative UI
        this.tutorialText.setVisible(false);
        this.textPanel.setVisible(false);
        
        // Clean up tutorial ships and lever
        if (this.leftShip) {
            this.leftShip.destroy();
            this.leftShip = null;
        }
        if (this.rightShip) {
            this.rightShip.destroy();
            this.rightShip = null;
        }
        if (this.elenaLever) {
            this.elenaLever.destroy();
            this.elenaLever = null;
        }
        
        // Tell the GameScene to prepare for interactive tutorial
        const gameScene = this.scene.get('GameScene');
        gameScene.prepareForMission(); // This should set up the interactive elements
        
        // Start the HUD for the tutorial trial (don't call startRealGame which changes trials)
        this.scene.launch('HUDScene');
        console.log('HUDScene launched for tutorial interactive training');
        
        // Stop this scene since the tutorial narrative is complete
        this.scene.stop();
    }
}
