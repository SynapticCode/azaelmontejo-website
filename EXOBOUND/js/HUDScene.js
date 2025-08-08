class HUDScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HUDScene' });
        // ... existing constructor code ...
    }

    create() {
        // ... existing code ...
        const trial = this.gameDataManager.getCurrentTrial();
        // ... existing code ...
        // Tutorial instruction overlay
        if (trial.isTutorial && trial.tutorialInstruction) {
            this.tutorialInstructionText = this.add.text(
                this.cameras.main.width / 2,
                40,
                trial.tutorialInstruction,
                {
                    fontFamily: 'Arial',
                    fontSize: '22px',
                    color: '#ff9900',
                    align: 'center',
                    wordWrap: { width: 900 }
                }
            ).setOrigin(0.5);
            this.tutorialInstructionText.setDepth(100);
        }
        // Restrict reticle movement for first three tutorial trials
        if (trial.isTutorial && trial.allowedTarget && trial.tutorialStep <= 3) {
            this.restrictReticleToTarget(trial.allowedTarget);
        }
        // ... existing code ...
    }

    restrictReticleToTarget(targetType) {
        // Only allow reticle to move to the specified target ("raider" or "asteroid")
        const trial = this.gameDataManager.getCurrentTrial();
        let targetX = null;
        if (targetType === 'raider') {
            // Raider X position
            if (this.gameScene.tutorialRaider) {
                targetX = this.gameScene.tutorialRaider.x;
            }
        } else if (targetType === 'asteroid') {
            // Asteroid X position
            if (this.gameScene.asteroid) {
                targetX = this.gameScene.asteroid.x;
            }
        }
        if (targetX !== null) {
            this.reticle.x = targetX;
            // Disable input for reticle movement
            this.inputManager.deactivate();
            // Optionally, allow firing only when reticle is at the correct target
            this.input.keyboard.on('keydown-SPACE', () => {}, this);
            this.input.keyboard.on('keydown-ENTER', () => {}, this);
            // Allow firing only if reticle is at the correct X
            this.input.on('pointerdown', (pointer) => {
                if (Math.abs(pointer.x - targetX) < 20) {
                    this.handlePlayerShot(pointer);
                }
            }, this);
        }
    }
    // ... rest of HUDScene class ...
} 