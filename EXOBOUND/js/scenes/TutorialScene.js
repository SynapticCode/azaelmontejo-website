class TutorialScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TutorialScene' });
    }

    init() {
        this.currentStep = 1;
        this.gameDataManager = this.registry.get('gameDataManager');
        console.log('TutorialScene initialized');
    }

    create() {
        // Create the same visual elements as GameScene
        this.createBackground();
        this.createCockpit();
        this.createAsteroid();
        
        // Add the first tutorial instruction (step 1: lever mechanic)
        this.tutorialText = this.add.text(
            this.cameras.main.width / 2, 
            this.cameras.main.height / 2,
            'Welcome, Tactical Officer.\n\nThis mission uses a LEVER to allocate your fleet\'s firepower.\n\nMove the lever LEFT for more firepower on the ASTEROID, RIGHT for more on the RAIDERS.\n\nThe percentages show your current allocation.\n\n(Click to continue)',
            {
                fontFamily: 'Arial',
                fontSize: '28px',
                color: '#ffffff',
                align: 'center',
                stroke: '#000000',
                strokeThickness: 4,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                padding: {
                    left: 20,
                    right: 20,
                    top: 20,
                    bottom: 20
                }
            }
        ).setOrigin(0.5);
        
        // Make the text interactive
        this.input.on('pointerdown', this.handleClick, this);
        this.tutorialStep = 1;
    }
    
    handleClick() {
        if (this.tutorialStep === 1) {
            // Step 2: Explain comms integrity
            this.tutorialText.setText(
                'COMMUNICATIONS INTEGRITY (COMMS)\n\nComms integrity determines how many of your allies follow your allocation.\n\nAt 100% comms, all ships follow your lever. At 0%, all default to the asteroid.\n\nWatch the comms display and plan your allocation!\n\n(Click to begin your mission)'
            );
            this.tutorialStep = 2;
        } else {
            // Proceed to the game scene
            this.scene.start('GameScene');
        }
    }
    
    createBackground() {
        // Create starfield background
        this.starfield = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'starfield');
        this.starfield.setOrigin(0, 0);
        this.starfield.setScrollFactor(0);
    }
    
    createCockpit() {
        // Add the cockpit frame
        this.cockpit = this.add.image(0, 0, 'cockpit');
        this.cockpit.setOrigin(0, 0);
        this.cockpit.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        this.cockpit.setScrollFactor(0);
        this.cockpit.setDepth(10); // Make sure cockpit is in front of other elements
    }
    
    createAsteroid() {
        // Add the main asteroid in the distance
        this.asteroid = this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 - 50,
            'main_asteroid_large'
        );
        this.asteroid.setScale(0.5);
        this.asteroid.setAlpha(0.7); // Make it slightly transparent to indicate it's in the distance
        this.asteroid.setDepth(1);
    }
    
    update() {
        // Slowly scroll the starfield for a space-travel effect
        this.starfield.tilePositionY -= 0.5;
    }
}
