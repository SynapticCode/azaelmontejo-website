// Component for animating the battle sequence
function BattleAnimator(scene) {
    this.scene = scene;
    this.effectsContainer = scene.add.container(0, 0);
    
    // Pre-check audio availability
    this.audioAvailable = {
        laserRetro_001: scene.sound && scene.sound.get('laserRetro_001'),
        laserLarge_002: scene.sound && scene.sound.get('laserLarge_002'),
        explosionCrunch_002: scene.sound && scene.sound.get('explosionCrunch_002'),
        lowFrequency_explosion_000: scene.sound && scene.sound.get('lowFrequency_explosion_000')
    };
    
    console.log('BattleAnimator initialized with audio availability:', this.audioAvailable);
}

BattleAnimator.prototype.animatePlayerVolley = function(playerShips, enemyShips, asteroid, playerTarget) {
    // Determine which ships are coordinated vs uncoordinated based on reception
    const reception = this.scene.gameDataManager ? this.scene.gameDataManager.reception : 0.7; // Default 70% if not set
    
    // Play combined laser sound
    this.playLaserSound();
    
    // For each player ship, decide if it's coordinated
    playerShips.forEach(ship => {
        // Skip if ship is not active or visible
        if (!ship || !ship.visible || ship.status !== 'active') return;
        
        const isCoordinated = Math.random() < reception;
        
        // Determine target based on coordination
        let target;
        if (isCoordinated) {
            // Target what the player targeted
            target = playerTarget.type === 'raider' ? 
                enemyShips.find(enemy => enemy.id === playerTarget.id) : 
                asteroid;
        } else {
            // Default to asteroid
            target = asteroid;
        }
        
        // If no valid target, default to asteroid
        if (!target) target = asteroid;
        
        // Create laser effect
        this.createLaserEffect(ship, target, 0x00ff00); // Green laser
        
        // Apply damage to target
        this.scene.time.delayedCall(500, () => {
            if (target === asteroid) {
                // Damage asteroid
                if (this.scene.gameDataManager) {
                    this.scene.gameDataManager.damageAsteroid(1);
                }
                // Play asteroid hit sound
                this.playExplosionSound('low');
                // Create explosion effect
                this.createExplosionEffect(target.x, target.y, 0.5);
            } else if (target.visible) {
                // Damage enemy ship
                target.health = (target.health || 1) - 1;
                if (target.health <= 0) {
                    target.status = 'destroyed';
                    if (this.scene.gameDataManager && target.id) {
                        this.scene.gameDataManager.destroyAlien(target.id);
                    }
                    // Play explosion sound
                    this.playExplosionSound('high');
                    // Create explosion effect
                    this.createExplosionEffect(target.x, target.y, 0.3);
                    // Hide the ship
                    target.setVisible(false);
                }
            }
        });
    });
}

BattleAnimator.prototype.animateEnemyCounterAttack = function(enemyShips, playerShips) {
    // Only active enemy ships can attack
    const activeEnemies = enemyShips.filter(ship => ship && ship.visible && ship.status === 'active');
    
    if (activeEnemies.length === 0) return;
    
    // Play enemy laser sound
    this.playLaserSound('enemy');
    
    activeEnemies.forEach(enemy => {
        // Randomly select a player ship to attack
        const activePlayerShips = playerShips.filter(ship => ship && ship.visible && ship.status === 'active');
        if (activePlayerShips.length === 0) return;
        
        const targetIndex = Math.floor(Math.random() * activePlayerShips.length);
        const target = activePlayerShips[targetIndex];
        
        if (target) {
            // Create laser effect
            this.createLaserEffect(enemy, target, 0xff0000); // Red laser
            
            // Apply damage to player ship
            this.scene.time.delayedCall(500, () => {
                // Destroy player ship
                target.status = 'destroyed';
                if (this.scene.gameDataManager && target.id !== undefined) {
                    this.scene.gameDataManager.destroyFriendlyShip(target.id);
                }
                // Play explosion sound
                this.playExplosionSound('high');
                // Create explosion effect
                this.createExplosionEffect(target.x, target.y, 0.3);
                // Hide the ship
                target.setVisible(false);
            });
        }
    });
}

BattleAnimator.prototype.createLaserEffect = function(source, target, color) {
    if (!source || !target) return;
    
    // Create a line from source to target
    const laser = this.scene.add.line(
        0, 0,
        source.x, source.y,
        target.x, target.y,
        color
    );
    laser.setLineWidth(3);
    this.effectsContainer.add(laser);
    
    // Animate the laser
    this.scene.tweens.add({
        targets: laser,
        alpha: 0,
        duration: 500,
        ease: 'Power2',
        onComplete: () => {
            laser.destroy();
        }
    });
}

BattleAnimator.prototype.createExplosionEffect = function(x, y, scale) {
    try {
        // Create explosion sprite
        const explosion = this.scene.add.sprite(x, y, 'explosion');
        explosion.setScale(scale || 0.5);
        this.effectsContainer.add(explosion);
        
        // Create the animation if it doesn't exist
        if (!this.scene.anims.exists('explode')) {
            this.scene.anims.create({
                key: 'explode',
                frames: this.scene.anims.generateFrameNumbers('explosion', { start: 0, end: 15 }),
                frameRate: 20,
                repeat: 0
            });
        }
        
        // Play the explosion animation
        explosion.play('explode');
        
        // Remove the explosion when animation completes
        explosion.once('animationcomplete', () => {
            explosion.destroy();
        });
    } catch (error) {
        console.error('Error creating explosion effect:', error);
    }
}

BattleAnimator.prototype.playLaserSound = function(type = 'player') {
    try {
        if (type === 'player') {
            // Try to play both laser sounds for player
            if (this.audioAvailable.laserRetro_001) {
                this.scene.sound.play('laserRetro_001', { volume: 0.7 });
            }
            if (this.audioAvailable.laserLarge_002) {
                this.scene.sound.play('laserLarge_002', { volume: 0.7 });
            }
        } else {
            // Enemy laser sound
            if (this.audioAvailable.laserLarge_002) {
                this.scene.sound.play('laserLarge_002', { volume: 0.7 });
            }
        }
    } catch (e) {
        console.warn('Error playing laser sound:', e);
    }
}

BattleAnimator.prototype.playExplosionSound = function(type = 'high') {
    try {
        if (type === 'high') {
            if (this.audioAvailable.explosionCrunch_002) {
                this.scene.sound.play('explosionCrunch_002', { volume: 0.7 });
            }
        } else {
            if (this.audioAvailable.lowFrequency_explosion_000) {
                this.scene.sound.play('lowFrequency_explosion_000', { volume: 0.7 });
            }
        }
    } catch (e) {
        console.warn('Error playing explosion sound:', e);
    }
}
