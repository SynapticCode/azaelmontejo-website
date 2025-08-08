class HUDScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HUDScene' });
        this.reticleActive = false;
        this.inputManager = null;
        this.globalSettings = null;
        this.allocation = 0.5; // Default allocation: 50% asteroid, 50% raider
    }

    init() {
        this.gameDataManager = this.registry.get('gameDataManager');
        if (!this.gameDataManager) {
            console.error('GameDataManager not found in registry!');
        }
        
        // Initialize global settings
        this.globalSettings = this.registry.get('globalSettings');
        if (!this.globalSettings) {
            this.globalSettings = new GlobalSettings();
            this.registry.set('globalSettings', this.globalSettings);
        }
    }

    create() {
        console.log('HUDScene create method started');
        
        // Get reference to the GameScene
        this.gameScene = this.scene.get('GameScene');
        
        // Get trial data for target positions
        const trial = this.gameDataManager.getCurrentTrial();
        const n_fleetsize = trial.n_fleetsize || 3;
        const raiderType = 'raider_' + (trial.raiderType || 'red');

        // --- Layout constants ---
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Raider (ideal target) at one of four fixed X positions, Y = centerY
        // Choose raider position index (0-3) from trial, or random if not specified
        const raiderPositionsX = [0.2 * width, 0.4 * width, 0.6 * width, 0.8 * width];
        let raiderIndex = typeof trial.raider_position_index === 'number' ? trial.raider_position_index : Phaser.Math.Between(0, 3);
        this.raiderX = raiderPositionsX[raiderIndex];
        this.raider = this.add.image(this.raiderX, centerY, raiderType);
        this.raider.setOrigin(0.5, 0.5);
        this.raider.setScale(0.35);
        this.raider.setDepth(10);
        // Add gentle up-and-down hovering to raider
        this.tweens.add({
            targets: this.raider,
            y: centerY + 20,
            duration: 1800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Asteroid (standard target) always centered
        this.asteroid = this.add.image(centerX, centerY, 'asteroid_large');
        this.asteroid.setOrigin(0.5, 0.5);
        this.asteroid.setScale(0.7);
        this.asteroid.setDepth(10);
        // Add slow circular/elliptical drift to asteroid
        this.asteroidBaseX = centerX;
        this.asteroidBaseY = centerY;
        this.asteroidDriftAngle = 0;

        // Create the laser effect (initially invisible)
        this.createLaserEffect();
        // Create trial information display
        this.createTrialInfo();
        // Only show narrative context for non-tutorial trials (tutorial has its own dialogue)
        const currentTrial = this.gameDataManager.getCurrentTrial();
        if (currentTrial && !currentTrial.isTutorial) {
            this.createNarrativeContext();
        }
        // Initialize input manager
        this.initializeInputManager();

        // --- Cockpit-Style Lever Slider UI for Allocation ---
        this.createLeverSlider();

        // --- FIRE BUTTON ---
        this.createFireButton();

        // FORCE dialogue panel to appear on EVERY trial (for debugging/testing)
        console.log('HUDScene: FORCING dialogue panel creation...');
        console.log('Trial data:', trial);
        
        // Get dialogue text using dynamic dialogue system
        let dialogueText = 'Default dialogue text for testing';
        
        try {
            // Use dynamic dialogue selector for all waves
            if (window.DialogueSelector && trial) {
                const dialogueSelector = new window.DialogueSelector();
                dialogueText = dialogueSelector.getDialogue(trial, this.gameDataManager);
                console.log(`Dynamic dialogue selected for Wave ${trial.waveInfo.waveId}, Trial ${trial.trialInWave}`);
            } else {
                // Fallback to original Wave 1 system
                if (window.wave1TutorialDialogue && trial && trial.waveInfo.waveId === 1) {
                    const trialIndex = Math.min(trial.trialInWave - 1, window.wave1TutorialDialogue.length - 1);
                    dialogueText = window.wave1TutorialDialogue[trialIndex] || window.wave1TutorialDialogue[0];
                    console.log('Using fallback Wave 1 dialogue, index:', trialIndex);
                } else {
                    dialogueText = 'Elena\'s lever responds to your touch. The weight of command rests in your hands.';
                }
            }
        } catch (error) {
            console.error('Error in dialogue selection:', error);
            dialogueText = 'Elena\'s lever awaits your command. Choose your target with wisdom and courage.';
        }
        
        console.log('Creating dialogue panel with text (first 100 chars):', dialogueText.substring(0, 100));
        
        // Create dynamic dialogue panel system
        this.createDynamicDialoguePanel(dialogueText);
        
        // Show tutorial instruction box for lever if this is a tutorial
        if (trial && trial.isTutorial) {
            // Delay showing instruction box to allow dialogue to appear first
            this.time.delayedCall(2000, () => {
                this.showTutorialInstructionBox();
            });
        }
    }
    
    createLaserEffect() {
        // Create a laser beam effect (initially invisible)
        this.laserBeam = this.add.rectangle(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            10, // width
            this.cameras.main.height, // height (will be adjusted based on target)
            0x00ffff // cyan color
        );
        this.laserBeam.setOrigin(0.5, 0);
        this.laserBeam.setAlpha(0.8);
        this.laserBeam.setDepth(14); // Below reticle but above other elements
        this.laserBeam.setVisible(false);
    }
    
    createTrialInfo() {
        if (!this.gameDataManager) return;
        const trial = this.gameDataManager.getCurrentTrial();
        if (!trial) return;
        // Move info panel lower to ensure visibility and avoid overlap with dialogue
        const infoPanelY = 280; // Moved from 180 to 280
        const infoPanelX = this.cameras.main.width - 250;
        const panel = this.add.rectangle(
            infoPanelX,
            infoPanelY,
            350,
            120,
            0x000000,
            0.8
        );
        panel.setStrokeStyle(2, 0x3399ff);
        panel.setDepth(16);
        let titleText;
        if (trial.isTutorial) {
            titleText = 'Tutorial Wave - Interactive Training';
        } else {
            const waveInfo = trial.waveInfo;
            titleText = `Wave ${waveInfo.waveId} - Mission ${trial.trialInWave}/${trial.totalTrialsInWave}`;
        }
        const title = this.add.text(
            infoPanelX,
            infoPanelY - 35,
            titleText,
            { fontFamily: 'Arial', fontSize: 14, color: '#ffffff' }
        ).setOrigin(0.5);
        title.setDepth(16);
        const fleetSize = trial.n_fleetsize || 3;
        const fleetText = this.add.text(
            infoPanelX,
            infoPanelY - 10,
            `Fleet Size: ${fleetSize} ships`,
            { fontFamily: 'Arial', fontSize: 12, color: '#66ccff' }
        ).setOrigin(0.5);
        fleetText.setDepth(16);
        const reception = trial.p_message || 0.7;
        const receptionPercent = Math.round(reception * 100);
        const receptionText = this.add.text(
            infoPanelX,
            infoPanelY + 10,
            `Comms Integrity: ${receptionPercent}%`,
            { fontFamily: 'Arial', fontSize: 12, color: '#ff9900' }
        ).setOrigin(0.5);
        receptionText.setDepth(16);
        const targetInfo = this.add.text(
            infoPanelX,
            infoPanelY + 30,
            'Target: Asteroid (Standard) or Raider (Ideal)',
            { fontFamily: 'Arial', fontSize: 11, color: '#ffff66' }
        ).setOrigin(0.5);
        targetInfo.setDepth(16);
        const instructions = this.add.text(
            infoPanelX,
            infoPanelY + 50,
            'Use lever to aim, click FIRE button to attack',
            { fontFamily: 'Arial', fontSize: 10, color: '#66ff66' }
        ).setOrigin(0.5);
        instructions.setDepth(16);
        this.trialInfoPanel = { panel, title, fleetText, receptionText, targetInfo, instructions };
    }
    
    createNarrativeContext() {
        if (!this.gameDataManager) return;
        const trial = this.gameDataManager.getCurrentTrial();
        if (!trial || !trial.narrative) return;
        // Move context panel lower to match the repositioned right panel
        const contextPanelX = 250;
        const contextPanelY = 280; // Moved from 180 to 280 to match right panel
        const contextPanel = this.add.rectangle(
            contextPanelX,
            contextPanelY,
            380,
            120, // Increased height to match right panel
            0x001122,
            0.85
        );
        contextPanel.setStrokeStyle(1, 0x3399ff);
        contextPanel.setDepth(15);
        // Elena's tactical assessment (on the left side) - fix [object Object] display
        const contextText = this.add.text(
            contextPanelX,
            contextPanelY - 30,
            (trial.narrative.situation && trial.narrative.situation.tactical_assessment) || 'Assessing tactical situation...',
            { fontFamily: 'Arial', fontSize: 13, color: '#66ccff', wordWrap: { width: 350 } }
        ).setOrigin(0.5, 0);
        contextText.setDepth(15);
        const elenaWisdom = trial.elenaContext || "Elena's wisdom guides you.";
        const wisdomText = this.add.text(
            contextPanelX,
            contextPanelY + 10,
            elenaWisdom,
            { fontFamily: 'Arial', fontSize: 12, color: '#ffcc66', wordWrap: { width: 350 } }
        ).setOrigin(0.5, 0);
        wisdomText.setDepth(15);
        this.contextPanel = { contextPanel, contextText, wisdomText };
    }
    
    initializeInputManager() {
        // Create input manager
        this.inputManager = new InputManager(this);
        
        // Initialize with callbacks
        this.inputManager.initialize(
            null,
            this.handlePlayerShot.bind(this)
        );
    }
    
    handlePlayerShot(pointer) {
        // Fire the laser (optional visual effect)
        this.fireLaser();
        // Disable further input temporarily
        if (this.inputManager) {
            this.inputManager.deactivate();
        }
        this.disableFireButton();
        // After a short delay, transition to the feedback scene
        this.time.delayedCall(1000, () => {
            // Gather exact asteroid and raider data
            const asteroidData = {
                x: this.asteroid.x,
                y: this.asteroid.y,
                type: this.asteroid.texture.key
            };
            const raiderData = {
                x: this.raider.x,
                y: this.raider.y,
                type: this.raider.texture.key
            };
            this.scene.launch('FeedbackSceneV2', {
                target: this.allocation,
                asteroid: asteroidData,
                raider: raiderData
            });
            this.scene.pause('GameScene');
            this.scene.pause('HUDScene');
        });
    }
    
    fireLaser() {
        // Play laser sound (optional, no reticle targeting)
        try {
            if (this.sound.get('laserLarge_002')) {
                this.sound.play('laserLarge_002', { volume: 0.7 });
            }
            if (this.sound.get('laserRetro_001')) {
                this.sound.play('laserRetro_001', { volume: 0.7 });
            }
        } catch (e) {
            console.warn('Error playing laser sound:', e);
        }
        // Optionally, you can add a visual effect here if desired
    }
    
    update() {
        // Update trial info if needed
        if (this.trialInfoPanel && this.gameDataManager) {
            const trial = this.gameDataManager.getCurrentTrial();
            if (trial) {
                // Construct title text
                let titleText;
                if (trial.isTutorial) {
                    titleText = 'Tutorial Wave - Interactive Training';
                } else {
                    const waveInfo = trial.waveInfo;
                    titleText = `Wave ${waveInfo.waveId} - Mission ${trial.trialInWave}/${trial.totalTrialsInWave}`;
                }
                this.trialInfoPanel.title.setText(titleText);
                this.trialInfoPanel.fleetText.setText(`Fleet Size: ${trial.n_fleetsize || 3} ships`);
                const receptionPercent = Math.round((trial.p_message || 0.7) * 100);
                this.trialInfoPanel.receptionText.setText(`Comms Integrity: ${receptionPercent}%`);
            }
        }
        // Animate asteroid drifting in a slow circle/ellipse
        if (this.asteroid) {
            this.asteroidDriftAngle = (this.asteroidDriftAngle || 0) + 0.008;
            const driftRadiusX = 18;
            const driftRadiusY = 10;
            this.asteroid.x = this.asteroidBaseX + Math.cos(this.asteroidDriftAngle) * driftRadiusX;
            this.asteroid.y = this.asteroidBaseY + Math.sin(this.asteroidDriftAngle) * driftRadiusY;
        }
    }
    
    resetForNewTrial() {
        console.log('HUDScene: Resetting for new trial');
        
        // Reset reticle position
        if (this.reticle) {
            this.reticle.x = this.cameras.main.width / 2;
            this.reticle.y = this.asteroid.y;
        }
        
        // Reactivate input
        this.reticleActive = true;
        if (this.inputManager) {
            this.inputManager.activate();
        }
        
        // Update trial info
        this.updateTrialInfo();
        
        this.enableFireButton();
        
        console.log('HUDScene: Reset complete');
    }
    
    updateTrialInfo() {
        if (!this.trialInfoPanel || !this.gameDataManager) return;

        const trial = this.gameDataManager.getCurrentTrial();
        if (!trial) return;

        // Update title with current trial info
        let titleText;
        if (trial.isTutorial) {
            titleText = 'Tutorial Wave - Interactive Training';
        } else {
            const waveInfo = trial.waveInfo;
            titleText = `Wave ${waveInfo.waveId} - Mission ${trial.trialInWave}/${trial.totalTrialsInWave}`;
        }
        this.trialInfoPanel.title.setText(titleText);
        this.trialInfoPanel.fleetText.setText(`Fleet Size: ${trial.n_fleetsize || 3} ships`);
        const receptionPercent = Math.round((trial.p_message || 0.7) * 100);
        this.trialInfoPanel.receptionText.setText(`Comms Integrity: ${receptionPercent}%`);
        
        // Update target info and instructions with brighter colors
        this.trialInfoPanel.targetInfo.setColor('#ffff66');
        this.trialInfoPanel.instructions.setText('Use lever to aim, click FIRE button to attack');
        this.trialInfoPanel.instructions.setColor('#66ff66');
    }
    
    cleanup() {
        // Clean up trial info panel
        if (this.trialInfoPanel) {
            Object.values(this.trialInfoPanel).forEach(element => {
                if (element && element.destroy) {
                    element.destroy();
                }
            });
            this.trialInfoPanel = null;
        }
        
        // Clean up input manager
        if (this.inputManager) {
            this.inputManager.cleanup();
            this.inputManager = null;
        }
    }

    // --- Cockpit-Style Lever Slider UI for Allocation ---
    createLeverSlider() {
        // Move lever and labels higher (where FIRE button was)
        const leverWidth = 300;
        const leverHeight = 16;
        // New Y position: where FIRE button was (was height - 140)
        const leverY = this.cameras.main.height - 140;
        const leverX = this.cameras.main.width / 2;
        const knobRadius = 22;

        // Draw lever track (background)
        this.leverTrack = this.add.rectangle(leverX, leverY, leverWidth, leverHeight, 0x222233, 0.8)
            .setOrigin(0.5)
            .setDepth(30);
        // Draw lever border
        this.add.rectangle(leverX, leverY, leverWidth + 4, leverHeight + 4, 0x666699, 0.5)
            .setOrigin(0.5)
            .setDepth(29);

        // Draw lever knob (cockpit style: simple circle for now)
        const startKnobX = leverX; // Centered (50/50)
        this.leverKnob = this.add.circle(startKnobX, leverY, knobRadius, 0x00bfff, 1)
            .setStrokeStyle(4, 0x003366)
            .setDepth(31)
            .setInteractive({ useHandCursor: true, draggable: true });

        // Draw lever handle (vertical line)
        this.leverHandle = this.add.rectangle(startKnobX, leverY, 6, 48, 0x003366, 1)
            .setOrigin(0.5)
            .setDepth(30);

        // Add percentage labels above lever
        this.asteroidLabel = this.add.text(leverX - leverWidth / 2, leverY - 40, 'Asteroid: 50%', {
            fontFamily: 'Arial', fontSize: 18, color: '#00ffcc', fontStyle: 'bold'
        }).setOrigin(0, 0.5).setDepth(32);
        this.raiderLabel = this.add.text(leverX + leverWidth / 2, leverY - 40, 'Raider: 50%', {
            fontFamily: 'Arial', fontSize: 18, color: '#ff6666', fontStyle: 'bold'
        }).setOrigin(1, 0.5).setDepth(32);

        // Add explanatory label below lever
        this.leverInfo = this.add.text(leverX, leverY + 38, 'Allocate firepower: left = asteroid, right = raider', {
            fontFamily: 'Arial', fontSize: 15, color: '#cccccc', fontStyle: 'italic'
        }).setOrigin(0.5).setDepth(32);

        // --- Interactivity ---
        // Allow dragging the knob
        this.input.setDraggable(this.leverKnob);
        this.leverKnob.on('drag', (pointer, dragX) => {
            // Hide tutorial instruction box on first lever interaction
            if (this.tutorialInstructions) {
                this.hideTutorialInstructionBox();
            }
            
            // Clamp knob position to track
            const minX = leverX - leverWidth / 2;
            const maxX = leverX + leverWidth / 2;
            const clampedX = Phaser.Math.Clamp(dragX, minX, maxX);
            this.leverKnob.x = clampedX;
            this.leverHandle.x = clampedX;
            // Update allocation value (0 = left, 1 = right)
            this.allocation = (clampedX - minX) / (maxX - minX);
            this.updateLeverLabels();
        });
        // Snap knob to position on drag end
        this.leverKnob.on('dragend', () => {
            this.leverKnob.x = this.leverHandle.x;
        });

        // Keyboard support: left/right arrows
        this.input.keyboard.on('keydown-LEFT', () => {
            this.setLeverAllocation(this.allocation - 0.01);
        });
        this.input.keyboard.on('keydown-RIGHT', () => {
            this.setLeverAllocation(this.allocation + 0.01);
        });

        // Initial update
        this.updateLeverLabels();

        // Update label positions relative to new leverY
        this.asteroidLabel.setY(leverY - 40);
        this.raiderLabel.setY(leverY - 40);
        this.leverInfo.setY(leverY + 38);
    }

    // Helper to update percentage labels
    updateLeverLabels() {
        const asteroidPct = Math.round((1 - this.allocation) * 100);
        const raiderPct = Math.round(this.allocation * 100);
        this.asteroidLabel.setText(`Asteroid: ${asteroidPct}%`);
        this.raiderLabel.setText(`Raider: ${raiderPct}%`);
    }

    // Helper to set lever position programmatically
    setLeverAllocation(value) {
        const leverWidth = 300;
        const leverX = this.cameras.main.width / 2;
        const minX = leverX - leverWidth / 2;
        const maxX = leverX + leverWidth / 2;
        this.allocation = Phaser.Math.Clamp(value, 0, 1);
        const knobX = minX + this.allocation * (maxX - minX);
        this.leverKnob.x = knobX;
        this.leverHandle.x = knobX;
        this.updateLeverLabels();
    }

    // --- FIRE BUTTON UI ---
    createFireButton() {
        // Move FIRE button higher, above the new lever position
        const fireY = this.cameras.main.height - 210; // 70px above lever
        const fireX = this.cameras.main.width / 2;
        const buttonRadius = 40;
        // Create the button circle and text at the correct position
        this.fireButtonCircle = this.add.circle(fireX, fireY, buttonRadius, 0xc00, 1)
            .setStrokeStyle(5, 0x000000)
            .setDepth(40)
            .setInteractive({ useHandCursor: true });
        this.fireButton = this.add.text(fireX, fireY, 'FIRE', {
            fontFamily: 'Arial Black',
            fontSize: '18px',
            color: '#fff',
            align: 'center',
            stroke: '#000',
            strokeThickness: 3
        })
        .setOrigin(0.5)
        .setDepth(41)
        .setInteractive({ useHandCursor: true });
        // Both the circle and text trigger firing
        this.fireButtonCircle.on('pointerdown', () => {
            if (!this.fireButtonDisabled) {
                this.handlePlayerShot();
                this.disableFireButton();
            }
        });
        this.fireButton.on('pointerdown', () => {
            if (!this.fireButtonDisabled) {
                this.handlePlayerShot();
                this.disableFireButton();
            }
        });
        this.fireButtonDisabled = false;
    }
    disableFireButton() {
        this.fireButtonDisabled = true;
        this.fireButton.setAlpha(0.5);
        this.fireButtonCircle.setAlpha(0.5);
        this.fireButton.disableInteractive();
        this.fireButtonCircle.disableInteractive();
    }
    enableFireButton() {
        this.fireButtonDisabled = false;
        this.fireButton.setAlpha(1);
        this.fireButtonCircle.setAlpha(1);
        this.fireButton.setInteractive({ useHandCursor: true });
        this.fireButtonCircle.setInteractive({ useHandCursor: true });
    }

    /**
     * Create and size dialogue panel dynamically based on content
     * @param {string} dialogueText - The dialogue text to display
     */
    createDynamicDialoguePanel(dialogueText) {
        // Create text object first to measure size
        const tempText = this.add.text(0, 0, dialogueText, { 
            fontFamily: 'Arial', 
            fontSize: 14, 
            color: '#ffffff', 
            align: 'center', 
            wordWrap: { width: Math.min(this.cameras.main.width - 100, 800) }
        });
        
        // Get text bounds
        const textBounds = tempText.getBounds();
        
        // Calculate panel dimensions with padding
        const padding = 30;
        const minWidth = 400;
        const minHeight = 60;
        
        const panelWidth = Math.max(minWidth, textBounds.width + padding);
        const panelHeight = Math.max(minHeight, textBounds.height + padding);
        
        // Position panel higher at the top of screen
        const panelX = this.cameras.main.width / 2;
        const panelY = panelHeight / 2 + 10; // Changed from 20px to 10px from top - positioned higher
        
        // Create the dynamic dialogue panel
        const dialoguePanel = this.add.rectangle(
            panelX,
            panelY,
            panelWidth,
            panelHeight,
            0x000011,
            0.95
        ).setOrigin(0.5);
        dialoguePanel.setStrokeStyle(3, 0x3399ff);
        dialoguePanel.setDepth(25);
        
        // Create the properly positioned dialogue text (initially empty for typewriter effect)
        const dialogue = this.add.text(
            panelX,
            panelY,
            '', // Start empty for typewriter effect
            { 
                fontFamily: 'Arial', 
                fontSize: 14, 
                color: '#ffffff', 
                align: 'center', 
                wordWrap: { width: Math.min(this.cameras.main.width - 100, 800) }
            }
        ).setOrigin(0.5);
        dialogue.setDepth(26);
        
        // Clean up temp text
        tempText.destroy();
        
        this.dialoguePanel = { dialoguePanel, dialogue };
        
        // Start typewriter effect
        this.typewriteDialogue(dialogueText, dialogue);
        
        console.log(`HUDScene: Dynamic dialogue panel created - Size: ${panelWidth}x${panelHeight} at Y:${panelY}`);
    }
    
    /**
     * Add typewriter effect to dialogue text
     * @param {string} fullText - The complete text to reveal
     * @param {Phaser.GameObjects.Text} textObject - The text object to update
     */
    typewriteDialogue(fullText, textObject) {
        let currentChar = 0;
        const totalChars = fullText.length;
        
        const typeChar = () => {
            if (currentChar <= totalChars) {
                textObject.setText(fullText.substring(0, currentChar));
                currentChar++;
                
                // Variable typing speed for dramatic effect
                let delay = 4;
                if (fullText[currentChar - 1] === '.') delay = 25;
                else if (fullText[currentChar - 1] === ',') delay = 12;
                else if (fullText[currentChar - 1] === '\n') delay = 20;
                else if (fullText[currentChar - 1] === ' ') delay = 2;
                else if (fullText[currentChar - 1] === '—') delay = 22; // Em dash pause
                
                this.time.delayedCall(delay, typeChar);
            } else {
                console.log('HUDScene: Typewriter effect completed');
            }
        };
        
        typeChar();
    }

    /**
     * Show tutorial instruction box with arrow pointing to lever
     */
    showTutorialInstructionBox() {
        // Create instruction box positioned next to the lever
        const leverX = this.cameras.main.width / 2;
        const leverY = this.cameras.main.height - 140;
        
        // Position instruction box to the right of the lever
        const boxX = leverX + 200;
        const boxY = leverY - 60;
        const boxWidth = 280;
        const boxHeight = 120;
        
        // Create instruction panel
        this.instructionPanel = this.add.rectangle(
            boxX,
            boxY,
            boxWidth,
            boxHeight,
            0x001133,
            0.95
        ).setOrigin(0.5);
        this.instructionPanel.setStrokeStyle(2, 0xff9900);
        this.instructionPanel.setDepth(50);
        
        // Create instruction text
        const instructionText = this.add.text(
            boxX,
            boxY,
            'LEVER CONTROLS:\n\n← LEFT: Target Asteroid\n→ RIGHT: Target Raider\n\nMove lever, then click FIRE',
            {
                fontFamily: 'Arial',
                fontSize: '14px',
                color: '#ffffff',
                align: 'center',
                lineSpacing: 4
            }
        ).setOrigin(0.5);
        instructionText.setDepth(51);
        
        // Create arrow pointing to lever
        const arrowPoints = [
            boxX - boxWidth/2, boxY + boxHeight/2,  // Start point (bottom left of box)
            leverX + 50, leverY - 20                // End point (above lever)
        ];
        
        this.arrow = this.add.graphics();
        this.arrow.lineStyle(3, 0xff9900);
        this.arrow.beginPath();
        this.arrow.moveTo(arrowPoints[0], arrowPoints[1]);
        this.arrow.lineTo(arrowPoints[2], arrowPoints[3]);
        this.arrow.strokePath();
        
        // Create arrowhead
        const arrowHeadSize = 12;
        const angle = Math.atan2(arrowPoints[3] - arrowPoints[1], arrowPoints[2] - arrowPoints[0]);
        this.arrow.fillStyle(0xff9900);
        this.arrow.beginPath();
        this.arrow.moveTo(arrowPoints[2], arrowPoints[3]);
        this.arrow.lineTo(
            arrowPoints[2] - arrowHeadSize * Math.cos(angle - Math.PI/6),
            arrowPoints[3] - arrowHeadSize * Math.sin(angle - Math.PI/6)
        );
        this.arrow.lineTo(
            arrowPoints[2] - arrowHeadSize * Math.cos(angle + Math.PI/6),
            arrowPoints[3] - arrowHeadSize * Math.sin(angle + Math.PI/6)
        );
        this.arrow.closePath();
        this.arrow.fillPath();
        this.arrow.setDepth(50);
        
        // Add pulsing animation
        this.tweens.add({
            targets: [this.instructionPanel, instructionText, this.arrow],
            alpha: { from: 0.7, to: 1 },
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Store references for cleanup
        this.tutorialInstructions = {
            panel: this.instructionPanel,
            text: instructionText,
            arrow: this.arrow
        };
        
        console.log('Tutorial instruction box with arrow created');
        
        // Hide instruction box after 8 seconds or when lever is first moved
        this.time.delayedCall(8000, () => {
            this.hideTutorialInstructionBox();
        });
    }
    
    /**
     * Hide the tutorial instruction box
     */
    hideTutorialInstructionBox() {
        if (this.tutorialInstructions) {
            // Fade out animation
            this.tweens.add({
                targets: [
                    this.tutorialInstructions.panel,
                    this.tutorialInstructions.text,
                    this.tutorialInstructions.arrow
                ],
                alpha: 0,
                duration: 500,
                onComplete: () => {
                    // Destroy objects after fade out
                    this.tutorialInstructions.panel.destroy();
                    this.tutorialInstructions.text.destroy();
                    this.tutorialInstructions.arrow.destroy();
                    this.tutorialInstructions = null;
                }
            });
            
            console.log('Tutorial instruction box hidden');
        }
    }
}
