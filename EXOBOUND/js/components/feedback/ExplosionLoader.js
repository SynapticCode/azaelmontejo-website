// Helper component to ensure explosion sprite is properly loaded
function ExplosionLoader() {
    this.preloadExplosion = function(scene) {
        // Check if explosion sprite is already loaded
        if (!scene.textures.exists('explosion')) {
            // Load explosion sprite sheet
            scene.load.spritesheet('explosion', 
                'assets/Explosion_sprite_strip.png',
                { frameWidth: 128, frameHeight: 128 }
            );
        }
    }
    
    this.createExplosionAnimation = function(scene) {
        // Create the explosion animation if it doesn't exist
        if (!scene.anims.exists('explode')) {
            scene.anims.create({
                key: 'explode',
                frames: scene.anims.generateFrameNumbers('explosion', { start: 0, end: 15 }),
                frameRate: 20,
                repeat: 0
            });
        }
    }
}
