class FeedbackScene extends Phaser.Scene {
    constructor() {
        super({ key: 'FeedbackScene' });
    }

    init(data) {
        this.playerChoice = data.playerChoice;
        this.trialData = data.trialData;
        
        // --- Perform Loss Calculations Here ---
        const envLossRaw = Math.pow(this.playerChoice - this.trialData.idealPosition, 2);
        // We'll normalize this to a 0-1 scale for visual effects. Assume max raw loss is from a 400px error.
        this.environmentalLoss = Phaser.Math.Clamp(envLossRaw / Math.pow(400, 2), 0, 1);
        
        const teamLossRaw = Math.pow(this.playerChoice - this.trialData.standardPosition, 2) * this.trialData.numTeammates * (1 - this.trialData.reception);
        // Normalize this too. Assume max raw loss is from 400px error with 15 teammates.
        this.teamworkLoss = Phaser.Math.Clamp(teamLossRaw / (Math.pow(400, 2) * 15), 0, 1);
        
        // A simple bonus calculation for display
        this.bonus = Math.max(0, 1 - (this.environmentalLoss + this.teamworkLoss));
    }

    create() {
        // --- Setup the visual environment ---
        this.add.image(512, 384, 'starfield').setDepth(5);
        this.add.image(512, 384, 'asteroid').setScale(0.15).setDepth(10);
        this.add.image(0, 0, 'background').setOrigin(0, 0).setDisplaySize(1024, 768).setDepth(20);
        this.add.rectangle(512, 384, 1024, 768, 0x000000, 0.7).setDepth(30);

        // --- Play laser firing sounds with specific config ---
        this.sound.play('laser_1', { volume: 0.5 });
        this.sound.play('laser_2', { volume: 0.3 });

        // --- Calculate Team Dynamics ---
        const coordinatedMates = Math.round(this.trialData.numTeammates * this.trialData.reception);
        const standardMates = this.trialData.numTeammates - coordinatedMates;
        const playerTargetX = this.playerChoice;
        const standardTargetX = (this.game.config.width / 2) + this.trialData.standardPosition;

        // --- Animate Laser Volley ---
        // Player's Laser (bright cyan)
        const playerLaser = this.add.rectangle(playerTargetX, 768, 7, 25, 0x00ffff).setDepth(40);
        this.tweens.add({ targets: playerLaser, y: 384, duration: 500, ease: 'Power2' });

        // Coordinated Teammate Lasers (dimmer cyan)
        for (let i = 0; i < coordinatedMates; i++) {
            const laser = this.add.rectangle(playerTargetX + Phaser.Math.Between(-5, 5), 768, 4, 20, 0x00ffff, 0.7).setDepth(40);
            this.tweens.add({ targets: laser, y: 384, duration: 500, ease: 'Power2', delay: 100 + Math.random() * 200 });
        }

        // Uncoordinated Teammate Lasers (green)
        for (let i = 0; i < standardMates; i++) {
            const laser = this.add.rectangle(standardTargetX + Phaser.Math.Between(-5, 5), 768, 4, 20, 0x00ff00, 0.7).setDepth(40);
            this.tweens.add({ targets: laser, y: 384, duration: 500, ease: 'Power2', delay: 100 + Math.random() * 200 });
        }

        // --- Display Results After Delay ---
        this.time.delayedCall(2000, () => {
            // Play explosion sounds with specific config
            this.sound.play('explosion_1', { volume: 0.7 });
            this.sound.play('explosion_2', { volume: 0.6 });
            
            // Add visual explosion effect
            const explosionSize = 30 + (this.bonus * 70); // Size based on damage
            const explosion = this.add.circle(512, 384, explosionSize, 0xff0000, 0.7).setDepth(15);
            this.tweens.add({
                targets: explosion,
                alpha: 0,
                scale: 2,
                duration: 1000,
                ease: 'Power2'
            });
            
            const shotPower = (1 - this.environmentalLoss) * 100;
            const teamSync = (1 - this.teamworkLoss) * 100;
            const totalDamage = this.bonus * 100;
            this.add.text(512, 200, `Shot Power (Adaptation): ${shotPower.toFixed(0)}%`, { font: '24px monospace', fill: '#ff0000' }).setOrigin(0.5).setDepth(50);
            this.add.text(512, 240, `Team Sync (Coordination): ${teamSync.toFixed(0)}%`, { font: '24px monospace', fill: '#00ff00' }).setOrigin(0.5).setDepth(50);
            this.add.text(512, 300, `TOTAL ASTEROID DAMAGE: ${totalDamage.toFixed(0)}%`, { font: '32px monospace', fill: '#00ffff' }).setOrigin(0.5).setDepth(50);
                
            const continueButton = this.add.text(512, 650, 'CONTINUE', {
                font: 'bold 20px Arial',
                fill: '#ffffff',
                backgroundColor: '#3B1EFF',
                padding: { x: 22, y: 8 },
                align: 'center',
            }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(50);
            continueButton.setShadow(0, 0, '#3B1EFF', 18, true, true);
            continueButton.setStyle({
                backgroundColor: '#3B1EFF',
                borderRadius: '999px',
                border: '2px solid #3B1EFF',
                fontWeight: 'bold',
                boxShadow: '0 0 12px 2px #3B1EFF',
                fontSize: '20px',
                padding: '8px 22px',
            });
            continueButton.on('pointerover', () => {
                continueButton.setShadow(0, 0, '#6C4DFF', 24, true, true);
                continueButton.setStyle({ backgroundColor: '#6C4DFF', boxShadow: '0 0 20px 4px #6C4DFF' });
            });
            continueButton.on('pointerout', () => {
                continueButton.setShadow(0, 0, '#3B1EFF', 18, true, true);
                continueButton.setStyle({ backgroundColor: '#3B1EFF', boxShadow: '0 0 12px 2px #3B1EFF' });
            });
            continueButton.on('pointerdown', () => {
                // Play click sound with specific config
                this.sound.play('switch_click', { volume: 0.5 });
                this.time.delayedCall(100, () => {
                    window.location.reload();
                });
            });
        });
    }
}
