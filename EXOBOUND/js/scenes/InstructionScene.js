/**
 * InstructionScene.js
 * Displays mission briefing and instructions for EXOBOUND v2.0
 */
class InstructionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'InstructionScene' });
    }

    create() {
        // Get reference to the game data manager
        this.gameDataManager = this.registry.get('gameDataManager');

        // Background
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000)
            .setOrigin(0, 0)
            .setAlpha(0.9);

        // Add starfield background
        this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'starfield')
            .setAlpha(0.3);

        // Title
        this.add.text(this.cameras.main.width / 2, 60, 'EXOBOUND v2.0: TACTICAL FLEET COMMAND', {
            fontFamily: 'Arial',
            fontSize: '32px',
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        // Mission briefing container
        const briefingContainer = this.add.container(this.cameras.main.width / 2, 150);

        // Mission briefing text
        const missionText = [
            { text: 'MISSION BRIEFING', style: { fontSize: '24px', fontStyle: 'bold', color: '#ffff00' } },
            { text: '\n', style: { fontSize: '10px' } },
            { text: 'You are the tactical officer of the command ship in a small fleet defending', style: { fontSize: '18px' } },
            { text: 'our planet from an alien-infested asteroid. Your primary mission is to destroy', style: { fontSize: '18px' } },
            { text: 'the asteroid before it reaches the planet.', style: { fontSize: '18px' } },
            { text: '\n', style: { fontSize: '10px' } },
            { text: 'WARNING: The asteroid periodically launches smaller, fast-moving "Raider"', style: { fontSize: '18px', color: '#ff9900' } },
            { text: 'ships that will attack your allied fleet if not neutralized.', style: { fontSize: '18px', color: '#ff9900' } },
            { text: '\n', style: { fontSize: '10px' } },
            { text: 'TACTICAL DECISION FRAMEWORK', style: { fontSize: '24px', fontStyle: 'bold', color: '#ffff00' } },
            { text: '\n', style: { fontSize: '10px' } },
            { text: 'You will now allocate your fleet\'s firepower between two targets using a lever:', style: { fontSize: '18px' } },
            { text: '\n', style: { fontSize: '10px' } },
            { text: '• Move the lever LEFT to allocate more firepower to the ASTEROID (standard target)', style: { fontSize: '18px', color: '#00ff00' } },
            { text: '• Move the lever RIGHT to allocate more firepower to the RAIDERS (ideal target)', style: { fontSize: '18px', color: '#ff3333' } },
            { text: '• The percentage shown indicates how much of your fleet will attempt to attack each target', style: { fontSize: '18px' } },
            { text: '\n', style: { fontSize: '10px' } },
            { text: 'COMMUNICATIONS INTEGRITY (COMMS)', style: { fontSize: '20px', fontStyle: 'bold', color: '#00bfff' } },
            { text: 'Comms integrity determines how many of your allies will follow your allocation.', style: { fontSize: '18px' } },
            { text: 'At 100% comms, all ships follow your allocation. At 0%, all default to the asteroid.', style: { fontSize: '18px' } },
            { text: '\n', style: { fontSize: '10px' } },
            { text: 'SCORING', style: { fontSize: '20px', fontStyle: 'bold', color: '#ffff00' } },
            { text: 'You will receive feedback on:', style: { fontSize: '18px' } },
            { text: '• Adaptation Loss: How far your allocation was from the ideal (raider) split', style: { fontSize: '18px' } },
            { text: '• Coordination Loss: How far your allocation was from the standard (asteroid) split', style: { fontSize: '18px' } },
            { text: '• Bonus: Based on your total performance', style: { fontSize: '18px' } },
            { text: '\n', style: { fontSize: '10px' } },
            { text: 'CONTROLS', style: { fontSize: '24px', fontStyle: 'bold', color: '#ffff00' } },
            { text: '\n', style: { fontSize: '10px' } },
            { text: '• Use your MOUSE or ARROW KEYS to move the lever', style: { fontSize: '18px' } },
            { text: '• The lever shows your current allocation in real time', style: { fontSize: '18px' } },
            { text: '• The "R" KEY can be used to request reinforcements (limited availability)', style: { fontSize: '18px' } },
        ];

        let yOffset = 0;
        missionText.forEach(line => {
            const textObject = this.add.text(0, yOffset, line.text, {
                fontFamily: 'Arial',
                fontSize: line.style.fontSize,
                fontStyle: line.style.fontStyle || 'normal',
                color: line.style.color || '#ffffff',
                align: 'center',
                wordWrap: { width: 800 }
            }).setOrigin(0.5, 0);
            
            briefingContainer.add(textObject);
            yOffset += textObject.height;
        });

        // Call to action
        const callToAction = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height - 80,
            'Press SPACEBAR to begin your mission',
            {
                fontFamily: 'Arial',
                fontSize: '24px',
                fontStyle: 'bold',
                color: '#ffffff',
                align: 'center'
            }
        ).setOrigin(0.5);

        // Make the call to action text pulse
        this.tweens.add({
            targets: callToAction,
            alpha: 0.5,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        // Add spacebar input handler
        this.input.keyboard.once('keydown-SPACE', () => {
            // Play a sound effect
            if (this.sound.get('switch1')) {
                this.sound.play('switch1');
            }
            
            // Transition to the game scene
            this.scene.start('GameScene');
            
            // If this is the first trial, set up the initial trial
            if (this.gameDataManager && this.gameDataManager.getGameState().currentTrialIndex === 0) {
                this.gameDataManager.setupTrial(0);
                console.log('First trial set up from InstructionScene');
            }
        });

        // Add a skip option for testing/debugging
        const skipText = this.add.text(
            this.cameras.main.width - 20,
            20,
            'Skip [S]',
            {
                fontFamily: 'Arial',
                fontSize: '14px',
                color: '#888888'
            }
        ).setOrigin(1, 0);

        this.input.keyboard.once('keydown-S', () => {
            if (this.gameDataManager && this.gameDataManager.getGameState().currentTrialIndex === 0) {
                this.gameDataManager.setupTrial(0);
            }
            this.scene.start('GameScene');
        });
    }
}
