export class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    preload() {
        // Create placeholder graphics for now
        this.load.image('logo', 'https://phaser.io/images/logo.png');
    }

    create() {
        // Add a logo
        this.add.image(400, 150, 'logo').setScale(0.5);
        
        // Add title text
        this.add.text(400, 250, 'Attentional Horizons', { 
            fontSize: '48px', 
            color: '#ffffff' 
        }).setOrigin(0.5);

        // Consent Text
        const consentText = 'Welcome! We are so glad you are here to collaborate on this special project from the Velez Lab at Princeton University. To support this study, we collect gameplay data that is always kept completely anonymous. Your personal information will never be part of our data; that is our firm commitment to you. For any questions at all about this research, please do not hesitate to contact me at azael.montejo.jr@rutgers.edu.';
        this.add.text(400, 350, consentText, { 
            fontSize: '16px', 
            color: '#dddddd', 
            align: 'center', 
            wordWrap: { width: 700 } 
        }).setOrigin(0.5);

        // Create checkbox graphics
        this.add.rectangle(150, 450, 24, 24, 0xffffff).setStrokeStyle(2, 0x000000);
        const checkmark = this.add.text(150, 450, '✓', { 
            fontSize: '20px', 
            color: '#000000' 
        }).setOrigin(0.5);
        checkmark.setVisible(false);
        
        // Checkbox container for interaction
        const checkbox = this.add.rectangle(150, 450, 40, 40, 0x000000, 0)
            .setInteractive()
            .on('pointerdown', () => {
                this.agreed = !this.agreed;
                checkmark.setVisible(this.agreed);
                desktopButton.setAlpha(this.agreed ? 1 : 0.5);
                mobileButton.setAlpha(this.agreed ? 1 : 0.5);
            });
        
        // Agreement text
        this.add.text(170, 450, 'I agree and wish to enter', { 
            fontSize: '20px', 
            color: '#ffffff' 
        }).setOrigin(0, 0.5);
        
        // Desktop Button
        const desktopButton = this.add.rectangle(250, 520, 200, 50, 0x4a6fa5)
            .setInteractive()
            .on('pointerdown', () => {
                if (this.agreed) {
                    this.scene.start('GameScene', { isMobile: false });
                }
            });
        
        this.add.text(250, 520, 'Play on Desktop', { 
            fontSize: '24px', 
            color: '#ffffff' 
        }).setOrigin(0.5);
        
        desktopButton.setAlpha(0.5);

        // Mobile Button
        const mobileButton = this.add.rectangle(550, 520, 200, 50, 0x4a6fa5)
            .setInteractive()
            .on('pointerdown', () => {
                if (this.agreed) {
                    this.scene.start('GameScene', { isMobile: true });
                }
            });
        
        this.add.text(550, 520, 'Play on Mobile', { 
            fontSize: '24px', 
            color: '#ffffff' 
        }).setOrigin(0.5);
        
        mobileButton.setAlpha(0.5);
        
        // Initialize agreed state
        this.agreed = false;
    }
}
