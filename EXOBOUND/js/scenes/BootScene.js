class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        console.log('BootScene: Delegating all asset loading to AssetLoader.js');
                
        // Create an instance of the asset loader and run it
        const assetLoader = new AssetLoader(this);
        assetLoader.loadAllAssets();

        // You can still have a loading bar here if you wish
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x333333, 0.8);
        progressBox.fillRect(320, 270, 320, 50);

        this.load.on('progress', function (value) {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(330, 280, 300 * value, 30);
        });
    }

    create() {
        console.log('BootScene: Loading complete. Creating animations and starting GameScene.');

        // Create explosion animation
        this.anims.create({
            key: 'explosion_anim',
            frames: this.anims.generateFrameNumbers('explosion_sprite_strip', { start: 0, end: 15 }),
            frameRate: 24,
            repeat: 0
        });

        // Hide the loading message
        const loadingDiv = document.getElementById('loading');
        if (loadingDiv) loadingDiv.style.display = 'none';

        // Start the game scene
        this.scene.start('GameScene');
    }
}
