/**
 * LoadingUI.js - Handles the loading progress UI
 */
class LoadingUI {
    constructor(scene) {
        this.scene = scene;
        this.progressBar = null;
        this.progressBox = null;
        this.loadingText = null;
    }

    /**
     * Create and display the loading UI
     */
    create() {
        const width = this.scene.cameras.main.width;
        const height = this.scene.cameras.main.height;
        
        this.progressBar = this.scene.add.graphics();
        this.progressBox = this.scene.add.graphics();
        this.progressBox.fillStyle(0x222222, 0.8);
        this.progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);
        
        this.loadingText = this.scene.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        this.loadingText.setOrigin(0.5, 0.5);
        
        // Set up progress event
        this.scene.load.on('progress', this.updateProgress, this);
        
        // Set up complete event
        this.scene.load.on('complete', this.complete, this);
    }

    /**
     * Update the progress bar
     */
    updateProgress(value) {
        this.progressBar.clear();
        this.progressBar.fillStyle(0xffffff, 1);
        this.progressBar.fillRect(
            this.scene.cameras.main.width / 2 - 150, 
            this.scene.cameras.main.height / 2 - 15, 
            300 * value, 
            30
        );
    }

    /**
     * Clean up when loading is complete
     */
    complete() {
        if (this.progressBar) this.progressBar.destroy();
        if (this.progressBox) this.progressBox.destroy();
        if (this.loadingText) this.loadingText.destroy();
        
        this.scene.assetsLoaded = true;
        console.log('BootScene: Asset loading complete.');
    }
}
