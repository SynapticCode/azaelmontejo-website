export class EndScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EndScene' });
    }

    init(data) {
        this.score = data.score || 0;
        this.gameData = data.gameData || [];
    }

    create() {
        // Background
        this.add.rectangle(400, 300, 800, 600, 0x1a1a1a);
        
        // Title
        this.add.text(400, 100, 'Game Complete!', {
            fontSize: '48px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Score
        this.add.text(400, 200, `Your Score: ${this.score}`, {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Play Again button
        const playAgainButton = this.add.rectangle(400, 400, 200, 50, 0x4a6fa5)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('TitleScene');
            });
            
        this.add.text(400, 400, 'Play Again', {
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Send data to jsPsych if running in experiment
        if (window.endPhaserTrial) {
            window.endPhaserTrial({ 
                gameData: this.gameData,
                finalScore: this.score
            });
        }
    }
}
