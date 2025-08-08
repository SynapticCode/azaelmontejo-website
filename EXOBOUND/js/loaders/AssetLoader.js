/**
 * AssetLoader.js - Handles loading of game assets with fallbacks
 */
class AssetLoader {
    constructor(scene) {
        this.scene = scene;
    }

    /**
     * Load all game assets with fallbacks
     */
    loadAllAssets() {
        // Set up error handling for file loading
        this.scene.load.on('loaderror', (fileObj) => {
            console.error(`Error loading file: ${fileObj.key}`, fileObj);
        });
        
        // Load all assets using the exact mappings
        this.loadAllMappedAssets();
    }

    /**
     * Load all assets using the exact mappings provided
     */
    loadAllMappedAssets() {
        // Load all images with exact paths and extensions
        this.scene.load.image('raider_blue', 'assets/Alien_raider_Blue.png');
        this.scene.load.image('raider_green', 'assets/Alien_raider_Green.png');
        this.scene.load.image('raider_red', 'assets/Alien_raider_Red.png');
        this.scene.load.image('allied_ship_green', 'assets/alliedship1_green.png');
        this.scene.load.image('allied_ship_orange', 'assets/Alliedship2_orange.png');
        this.scene.load.image('allied_ship_blue', 'assets/Player1ship_blue.png');
        this.scene.load.image('asteroid_large', 'assets/asteroid_large.png');
        this.scene.load.image('asteroid_medium', 'assets/asteroid_medium.png');
        this.scene.load.image('asteroid_small', 'assets/asteroid_small.png');
        this.scene.load.image('reticle', 'assets/Crosshairs.png');
        this.scene.load.image('cockpit', 'assets/Spaship cockpit window.png');
        this.scene.load.image('standard_marker', 'assets/standard_marker.png');
        this.scene.load.image('starfield', 'assets/starfield_window.png');
        this.scene.load.image('laser_shot', 'assets/laser_shot.png');
        
        // Load explosion spritesheet correctly with 64x64 frame dimensions
        this.scene.load.spritesheet('explosion_sprite_strip', 'assets/Explosion_sprite_strip.png', {
            frameWidth: 64,
            frameHeight: 64
        });
        
        // Load all audio files with exact paths and extensions
        this.scene.load.audio('sfx_ui_click', 'assets/clickingbuttonsound.ogg');
        this.scene.load.audio('explosionCrunch_002', 'assets/explosionCrunch_002.ogg');
        this.scene.load.audio('forceField_000', 'assets/forceField_000.ogg');
        this.scene.load.audio('laserLarge_002', 'assets/laserLarge_002.ogg');
        this.scene.load.audio('laserRetro_001', 'assets/laserRetro_001.ogg');
        this.scene.load.audio('lowFrequency_explosion_000', 'assets/lowFrequency_explosion_000.ogg');
    }
}
