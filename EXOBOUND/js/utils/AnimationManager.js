/**
 * AnimationManager.js - Handles creation of game animations
 */
class AnimationManager {
    constructor(scene) {
        this.scene = scene;
    }

    /**
     * Create all game animations
     */
    createAnimations() {
        console.log('Creating animations...');
        
        try {
            this.createExplosionAnimation();
        } catch (e) {
            console.error('Error creating animations:', e);
        }
    }

    /**
     * Create the explosion animation
     */
    createExplosionAnimation() {
        if (this.scene.textures.exists('explosion')) {
            // Determine how many frames are actually available
            const texture = this.scene.textures.get('explosion');
            const frameCount = Math.min(16, texture.frameTotal);
            
            this.scene.anims.create({
                key: 'explode',
                frames: this.scene.anims.generateFrameNumbers('explosion', { 
                    start: 0, 
                    end: frameCount - 1 
                }),
                frameRate: 20,
                repeat: 0
            });
        }
    }
}
