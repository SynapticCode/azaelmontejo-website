class FeedbackSceneV2 extends Phaser.Scene {
    constructor() {
        super({ key: 'FeedbackSceneV2' });
    }

    init(data) {
        // Store the target data and exact asteroid/raider positions passed from HUDScene
        this.targetData = data.target || { type: 'asteroid' };
        this.asteroidData = data.asteroid;
        this.raiderData = data.raider;
        console.log('FeedbackSceneV2 initialized with target data:', this.targetData, this.asteroidData, this.raiderData);
        
        // Get reference to the GameDataManager
        this.gameDataManager = this.registry.get('gameDataManager');
        if (!this.gameDataManager) {
            console.error('GameDataManager not found in registry!');
        }
    }

    create() {
        console.log('FeedbackSceneV2 create method started');
        
        // Add tactical background
        this.createTacticalBackground();
        
        // Add fleet representations
        this.createFleetRepresentations();
        
        // Show the battle outcome
        this.showBattleOutcome();
    }
    
    createTacticalBackground() {
        // Add a dark background with grid lines
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000)
            .setOrigin(0, 0);
            
        // Add grid lines
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0x333333, 0.8);
        
        // Draw horizontal grid lines
        for (let y = 0; y < this.cameras.main.height; y += 50) {
            graphics.beginPath();
            graphics.moveTo(0, y);
            graphics.lineTo(this.cameras.main.width, y);
            graphics.closePath();
            graphics.strokePath();
        }
        
        // Draw vertical grid lines
        for (let x = 0; x < this.cameras.main.width; x += 50) {
            graphics.beginPath();
            graphics.moveTo(x, 0);
            graphics.lineTo(x, this.cameras.main.height);
            graphics.closePath();
            graphics.strokePath();
        }
    }
    
    createFleetRepresentations() {
        // Use passed-in asteroid/raider data if available
        const asteroidData = this.asteroidData;
        const raiderData = this.raiderData;
        
        // Get trial data for fleet size and target positions
        let n_fleetsize = 3;
        let ideal_size = 100;
        let raiderType = 'raider_red';
        if (this.gameDataManager && this.gameDataManager.trialData) {
            const trial = this.gameDataManager.trialData[this.gameDataManager.currentTrialIndex];
            if (trial) {
                if (trial.n_fleetsize) n_fleetsize = trial.n_fleetsize;
                if (trial.ideal_size) ideal_size = trial.ideal_size;
                if (trial.raiderType) raiderType = `raider_${trial.raiderType}`;
            }
        }
        
        // Get fleet data from GameDataManager for consistency with GameScene
        const fleetData = this.gameDataManager.getCurrentFleetData();
        
        // Create player fleet icons using the same data as GameScene
        this.playerShips = [];
        
        if (fleetData.length > 0) {
            // Use fleet data from GameScene for consistency
            fleetData.forEach((shipData, index) => {
                const shipIcon = this.add.image(
                    shipData.originalX,
                    shipData.originalY,
                    shipData.type
                );
                shipIcon.setScale(shipData.scale);
                shipIcon.setData('id', shipData.id);
                shipIcon.setData('status', 'active');
                shipIcon.setData('originalX', shipData.originalX);
                shipIcon.setData('originalY', shipData.originalY);
                shipIcon.setData('target', null); // Will be set during battle
                shipIcon.setData('isCoordinated', false); // Will be set during battle
                this.playerShips.push(shipIcon);
                
                // Add subtle idle movement to each ship
                this.addIdleMovement(shipIcon);
            });
        } else {
            // Fallback to original method if no fleet data available
            console.warn('No fleet data available, using fallback method');
            const shipTypes = ['allied_ship_green', 'allied_ship_blue', 'allied_ship_orange'];
            const shipSpacing = 100;
            const startX = this.cameras.main.width / 2 - ((n_fleetsize - 1) * shipSpacing) / 2;
            for (let i = 0; i < n_fleetsize; i++) {
                const shipType = shipTypes[i % shipTypes.length];
                const shipIcon = this.add.image(
                    startX + i * shipSpacing,
                    this.cameras.main.height - 100,
                    shipType
                );
                shipIcon.setScale(0.3);
                shipIcon.setData('id', i);
                shipIcon.setData('status', 'active');
                shipIcon.setData('originalX', startX + i * shipSpacing);
                shipIcon.setData('originalY', this.cameras.main.height - 100);
                shipIcon.setData('target', null); // Will be set during battle
                shipIcon.setData('isCoordinated', false); // Will be set during battle
                this.playerShips.push(shipIcon);
                
                // Add subtle idle movement to each ship
                this.addIdleMovement(shipIcon);
            }
        }
        
        // Place the asteroid at the correct position
        this.asteroid = this.add.image(asteroidData.x, asteroidData.y, asteroidData.type);
        this.asteroid.setOrigin(0.5, 0.5);
        this.asteroid.setScale(0.7);
        this.asteroid.setDepth(10);
        
        // Place the raider at the correct position
        this.raider = this.add.image(raiderData.x, raiderData.y, raiderData.type);
        this.raider.setOrigin(0.5, 0.5);
        this.raider.setScale(0.7);
        this.raider.setDepth(10);
        
        // Add gentle hovering animation to raider
        this.tweens.add({
            targets: this.raider,
            y: raiderData.y + 10,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Store target references for easy access
        this.targets = {
            asteroid: this.asteroid,
            raider: this.raider
        };
    }
    
    // Shuffle array utility function
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    // Binomial distribution function (from original experiment)
    binomial(n, p) {
        let successes = 0;
        for (let i = 0; i < n; i++) {
            if (Math.random() < p) {
                successes++;
            }
        }
        return successes;
    }
    
    // Add subtle idle movement to ships
    addIdleMovement(ship) {
        const originalX = ship.getData('originalX');
        const originalY = ship.getData('originalY');
        
        // Store tween references so we can stop them later
        const hoverTween = this.tweens.add({
            targets: ship,
            y: originalY - 5,
            duration: 2000 + Math.random() * 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        const sideTween = this.tweens.add({
            targets: ship,
            x: originalX + 3,
            duration: 3000 + Math.random() * 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Store tween references in ship data for cleanup
        ship.setData('idleTweens', [hoverTween, sideTween]);
    }
    
    // Stop idle movement for a ship (called before battle sequence)
    stopIdleMovement(ship) {
        const idleTweens = ship.getData('idleTweens');
        if (idleTweens) {
            idleTweens.forEach(tween => {
                if (tween && tween.isPlaying()) {
                    tween.stop();
                }
            });
        }
    }
    
    // Add hovering movement for ships that have reached their target positions
    addHoverMovement(ship, baseX, baseY) {
        // Subtle hovering movement around the base position
        this.tweens.add({
            targets: ship,
            y: baseY - 8,
            duration: 2500 + Math.random() * 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Very subtle side-to-side movement
        this.tweens.add({
            targets: ship,
            x: baseX + 5,
            duration: 3500 + Math.random() * 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    showBattleOutcome() {
        // Get trial parameters from GameDataManager
        const trialData = this.gameDataManager.trialData[this.gameDataManager.currentTrialIndex] || {};
        const n_fleetsize = trialData.n_fleetsize || 3;
        const p_message = trialData.p_message || 0.7;
        const ideal_size = trialData.ideal_size || 100;
        const standard_size = trialData.standard_size || 100;

        // Get allocation value (0-1) from HUDScene (passed as this.targetData)
        const allocation = typeof this.targetData === 'number' ? this.targetData : 0.5;
        // allocation = 0 means 100% asteroid, allocation = 1 means 100% raider
        const n_asteroid = Math.round(n_fleetsize * (1 - allocation));
        const n_raider = n_fleetsize - n_asteroid;

        // Assign ships: with probability p_message, follow allocation; else, default to asteroid
        const assignments = [];
        let raiderAssigned = 0;
        let asteroidAssigned = 0;
        for (let i = 0; i < n_fleetsize; i++) {
            if (Math.random() < p_message) {
                // Assign to raider if raider slots remain, else asteroid
                if (raiderAssigned < n_raider) {
                    assignments.push('raider');
                    raiderAssigned++;
                } else {
                    assignments.push('asteroid');
                    asteroidAssigned++;
                }
            } else {
                assignments.push('asteroid');
                asteroidAssigned++;
            }
        }
        Phaser.Utils.Array.Shuffle(assignments);
        this._shipAssignments = assignments; // Store for feedback

        // Calculate losses using original experiment formulas
        // Adaptation loss: how far allocation is from ideal (assume ideal is all raider for now)
        const env_loss = 0.1 * Math.pow(allocation - 1, 2) * 10000; // scale for feedback
        // Coordination loss: how far allocation is from standard (assume standard is all asteroid)
        const ind_loss = Math.pow(allocation - 0, 2) * 10000;
        const social_loss = 0.05 * (n_fleetsize - raiderAssigned) * ind_loss;
        const total_loss = env_loss + social_loss;
        // Bonus calculation
        const max_bonus = 5 / 45;
        const raw_bonus = max_bonus - (1 / 2000) * total_loss;
        const bounded_bonus = Math.max(0, Math.min(max_bonus, raw_bonus));
        this.bonus = bounded_bonus;

        // Show enhanced battle sequence with new assignments
        this.time.delayedCall(500, () => {
            this.executeEnhancedBattleSequence(assignments);
        });

        // Show results text after all ships have completed their sequences
        const totalSequenceTime = (this.playerShips.length * 400) + 3000;
        this.time.delayedCall(totalSequenceTime, () => {
            // Center the results panel and bring to front
            const resultsContainer = this.add.container(this.cameras.main.width / 2, this.cameras.main.height / 2);
            const panel = this.add.rectangle(0, 0, 500, 320, 0x000000, 0.92);
            panel.setStrokeStyle(4, 0x3B1EFF);
            panel.setDepth(100);
            resultsContainer.add(panel);
            const titleText = this.add.text(0, -120, 'MISSION RESULTS', { fontFamily: 'Arial', fontSize: 24, color: '#ffffff', align: 'center' }).setOrigin(0.5);
            const allocText = this.add.text(0, -80, `Your Allocation: ${Math.round(allocation*100)}% Raider, ${Math.round((1-allocation)*100)}% Asteroid`, { fontFamily: 'Arial', fontSize: 18, color: '#00ffcc' }).setOrigin(0.5);
            const commsText = this.add.text(0, -50, `Comms Integrity: ${Math.round(p_message*100)}%`, { fontFamily: 'Arial', fontSize: 16, color: '#ff9900' }).setOrigin(0.5);
            const raiderText = this.add.text(0, -20, `Fleet Attacking Raider: ${raiderAssigned} / ${n_fleetsize}`, { fontFamily: 'Arial', fontSize: 16, color: '#ff6666' }).setOrigin(0.5);
            const asteroidText = this.add.text(0, 10, `Fleet Attacking Asteroid: ${asteroidAssigned} / ${n_fleetsize}`, { fontFamily: 'Arial', fontSize: 16, color: '#00ffcc' }).setOrigin(0.5);
            const envLossText = this.add.text(0, 40, `Adaptation Loss: ${env_loss.toFixed(2)}`, { fontFamily: 'Arial', fontSize: 16, color: '#ff6666' }).setOrigin(0.5);
            const socialLossText = this.add.text(0, 70, `Coordination Loss: ${social_loss.toFixed(2)}`, { fontFamily: 'Arial', fontSize: 16, color: '#ffcc66' }).setOrigin(0.5);
            const totalLossText = this.add.text(0, 100, `Total Loss: ${total_loss.toFixed(2)}`, { fontFamily: 'Arial', fontSize: 18, color: '#ffffff' }).setOrigin(0.5);
            const bonusText = this.add.text(0, 130, `Bonus: ${this.bonus.toFixed(3)}`, { fontFamily: 'Arial', fontSize: 20, color: '#00ffcc' }).setOrigin(0.5);
            [titleText, allocText, commsText, raiderText, asteroidText, envLossText, socialLossText, totalLossText, bonusText].forEach(t => t.setDepth(101));
            resultsContainer.add([titleText, allocText, commsText, raiderText, asteroidText, envLossText, socialLossText, totalLossText, bonusText]);
            resultsContainer.setDepth(100);
            resultsContainer.setAlpha(0);
            this.tweens.add({ targets: resultsContainer, alpha: 1, duration: 500, ease: 'Power2' });

            // Add continue button after a delay to emphasize results
            this.time.delayedCall(2000, () => {
                const continueButton = this.add.text(0, 190, 'CONTINUE', {
                    fontFamily: 'Arial',
                    fontSize: 20,
                    color: '#ffffff',
                    backgroundColor: '#3B1EFF',
                    padding: { x: 22, y: 8 },
                    align: 'center',
                }).setOrigin(0.5);
                continueButton.setDepth(102);
                continueButton.setAlpha(0);
                continueButton.setInteractive({ useHandCursor: true });
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
                    this.sound.play('sfx_ui_click');
                    const jsPsych = this.registry.get('jsPsych');
                    const gameDataManager = this.registry.get('gameDataManager');
                    const globalSettings = this.registry.get('globalSettings');
                    if (jsPsych) jsPsych.finishTrial(this._trialResults);
                    if (gameDataManager && gameDataManager.hasMoreTrials()) {
                        const nextTrialIndex = gameDataManager.getNextTrialIndex();
                        const nextTrial = gameDataManager.setupTrial(nextTrialIndex);
                        if (globalSettings && nextTrial) globalSettings.updateTrialFromData(nextTrial);
                        this.resetScenesForNewTrial();
                    } else {
                        console.log('All trials completed');
                        gameDataManager.campaignComplete = true;
                        this.scene.resume('GameScene');
                        this.scene.resume('HUDScene');
                        this.scene.stop();
                    }
                });
                resultsContainer.add(continueButton);
                this.tweens.add({ targets: continueButton, alpha: 1, duration: 500, ease: 'Power2' });
            });
        });

        // Store results for jsPsych
        this._trialResults = {
            trialIndex: this.gameDataManager.currentTrialIndex,
            allocation,
            bonus: this.bonus,
            env_loss,
            social_loss,
            total_loss,
            raiderAssigned,
            asteroidAssigned,
            comms: p_message,
            n_fleetsize,
            timestamp: Date.now()
        };
        if (this.gameDataManager) {
            this.gameDataManager.recordTrialResult(this._trialResults);
        }
    }
    
    // Enhanced battle sequence with proper ship targeting and movement
    executeEnhancedBattleSequence(assignments) {
        // Assign targets to ships based on assignments array
        this.playerShips.forEach((ship, index) => {
            const targetType = assignments[index];
            const target = targetType === 'raider' ? this.targets.raider : this.targets.asteroid;
            ship.setData('target', target);
            ship.setData('isCoordinated', targetType === 'raider');
        });
        // Execute ship movements and firing sequence with proper staggering
        this.playerShips.forEach((ship, index) => {
            const delay = index * 400;
            this.time.delayedCall(delay, () => {
                this.stopIdleMovement(ship);
                this.executeShipBattleSequence(ship, index);
            });
        });
    }
    
    // Execute individual ship battle sequence
    executeShipBattleSequence(ship, shipIndex) {
        const target = ship.getData('target');
        const isCoordinated = ship.getData('isCoordinated');
        
        if (!target) return;
        
        // Calculate angle to target for ship rotation
        const angle = Phaser.Math.Angle.Between(ship.x, ship.y, target.x, target.y);
        const degrees = Phaser.Math.RadToDeg(angle);
        
        // Rotate ship to face target
        this.tweens.add({
            targets: ship,
            angle: degrees,
            duration: 500,
            ease: 'Power2'
        });
        
        // Move ship toward target in a curved path
        this.time.delayedCall(300, () => {
            this.moveShipToTarget(ship, target, isCoordinated);
        });
    }
    
    // Complete ship battle sequence: fly to target, hover, fire, return
    moveShipToTarget(ship, target, isCoordinated) {
        const originalX = ship.getData('originalX');
        const originalY = ship.getData('originalY');
        const startX = ship.x;
        const startY = ship.y;
        
        // Calculate hover position near target (not directly on target)
        const hoverDistance = 80 + Math.random() * 40; // 80-120 pixels from target
        const hoverAngle = Math.random() * Math.PI * 2; // Random angle around target
        const hoverX = target.x + Math.cos(hoverAngle) * hoverDistance;
        const hoverY = target.y + Math.sin(hoverAngle) * hoverDistance;
        
        // Create curved path to hover position
        const controlX = (startX + hoverX) / 2 + (Math.random() - 0.5) * 60;
        const controlY = (startY + hoverY) / 2 + (Math.random() - 0.5) * 60;
        
        // Phase 1: Fly to hover position (800ms - faster speed)
        this.tweens.add({
            targets: ship,
            x: hoverX,
            y: hoverY,
            duration: 800,
            ease: 'Power2',
            onUpdate: (tween) => {
                // Apply curved path
                const progress = tween.progress;
                const x = Phaser.Math.Interpolation.QuadraticBezier(progress, startX, controlX, hoverX);
                const y = Phaser.Math.Interpolation.QuadraticBezier(progress, startY, controlY, hoverY);
                ship.x = x;
                ship.y = y;
            },
            onComplete: () => {
                // Phase 2: Hover and fire (300ms delay, then fire)
                this.time.delayedCall(300, () => {
                    this.fireShipLaser(ship, target, isCoordinated);
                    
                    // Phase 3: Continue hovering for 500ms after firing
                    this.time.delayedCall(500, () => {
                        // Phase 4: Return to original position (800ms - faster speed)
                        this.returnShipToBase(ship, originalX, originalY, hoverX, hoverY);
                    });
                });
            }
        });
    }
    
    // Return ship to its original position
    returnShipToBase(ship, originalX, originalY, currentX, currentY) {
        // Create curved return path
        const controlX = (currentX + originalX) / 2 + (Math.random() - 0.5) * 60;
        const controlY = (currentY + originalY) / 2 + (Math.random() - 0.5) * 60;
        
        this.tweens.add({
            targets: ship,
            x: originalX,
            y: originalY,
            duration: 800,
            ease: 'Power2',
            onUpdate: (tween) => {
                // Apply curved path
                const progress = tween.progress;
                const x = Phaser.Math.Interpolation.QuadraticBezier(progress, currentX, controlX, originalX);
                const y = Phaser.Math.Interpolation.QuadraticBezier(progress, currentY, controlY, originalY);
                ship.x = x;
                ship.y = y;
            },
            onComplete: () => {
                // Reset ship angle to original orientation
                this.tweens.add({
                    targets: ship,
                    angle: 0,
                    duration: 300,
                    ease: 'Power2'
                });
                
                // Resume idle movement
                this.addIdleMovement(ship);
            }
        });
    }
    
    // Fire ship laser with explosion and sound effects
    fireShipLaser(ship, target, isCoordinated) {
        const shotType = isCoordinated ? 'powerful' : 'weak';
        const laserColor = isCoordinated ? 0x00ffcc : 0xffff00;
        const laserWidth = isCoordinated ? 8 : 3;
        
        // Add some accuracy variation - coordinated ships are more accurate
        let accuracyOffset = 0;
        if (!isCoordinated) {
            // Uncoordinated ships have more spread (miss more often)
            accuracyOffset = (Math.random() - 0.5) * 60; // ±30 pixels spread
        } else {
            // Coordinated ships are more accurate but still have slight spread
            accuracyOffset = (Math.random() - 0.5) * 20; // ±10 pixels spread
        }
        
        // Calculate target position with accuracy offset
        const targetX = target.x + accuracyOffset;
        const targetY = target.y + accuracyOffset;
        
        console.log(`Ship firing: coordinated=${isCoordinated}, target=(${target.x}, ${target.y}), actual=(${targetX}, ${targetY}), offset=${accuracyOffset}`);
        
        // Play appropriate laser sound
        try {
            if (shotType === 'powerful') {
                this.sound.play('laserRetro_001', { volume: 0.7 });
            } else {
                this.sound.play('laserLarge_002', { volume: 0.7 });
            }
        } catch (e) {
            console.warn('Error playing laser sound:', e);
        }
        
        // Create laser effect
        const laser = this.add.line(0, 0, ship.x, ship.y, targetX, targetY, laserColor);
        laser.setLineWidth(laserWidth);
        laser.setOrigin(0, 0);
        laser.setBlendMode(Phaser.BlendModes.ADD);
        
        // Add glow effect for powerful shots
        if (shotType === 'powerful') {
            const glow = this.add.line(0, 0, ship.x, ship.y, targetX, targetY, 0x00ffff);
            glow.setLineWidth(laserWidth + 2);
            glow.setOrigin(0, 0);
            glow.setBlendMode(Phaser.BlendModes.ADD);
            glow.setAlpha(0.5);
            
            this.tweens.add({ 
                targets: glow, 
                alpha: 0, 
                duration: 400, 
                ease: 'Power2', 
                onComplete: () => { glow.destroy(); } 
            });
        }
        
        // Animate laser
        const duration = shotType === 'powerful' ? 400 : 300;
        this.tweens.add({ 
            targets: laser, 
            alpha: 0, 
            duration: duration, 
            ease: 'Power2', 
            onComplete: () => { laser.destroy(); } 
        });
        
        // Trigger explosion at actual hit position with slight delay
        this.time.delayedCall(duration, () => {
            this.createExplosionAtTarget({ x: targetX, y: targetY }, shotType);
        });
    }
    
    // Create explosion at target position
    createExplosionAtTarget(target, shotType) {
        const explosion = this.add.sprite(target.x, target.y, 'explosion_sprite_strip')
            .play('explosion_anim')
            .setDepth(15);
        
        // Play explosion sound
        this.sound.play('explosionCrunch_002', { volume: 0.5 });
        
        // Add additional low frequency explosion for powerful shots
        if (shotType === 'powerful') {
            this.sound.play('lowFrequency_explosion_000', { volume: 0.3 });
        }
    }
    
    /**
     * Reset scenes for a new trial
     */
    resetScenesForNewTrial() {
        console.log('FeedbackSceneV2: Resetting scenes for new trial');
        
        // Resume scenes
        this.scene.resume('GameScene');
        this.scene.resume('HUDScene');
        
        // Reset GameScene for new trial
        const gameScene = this.scene.get('GameScene');
        if (gameScene && typeof gameScene.resetForNewTrial === 'function') {
            gameScene.resetForNewTrial();
        }
        
        // Reset HUD scene for new trial
        const hudScene = this.scene.get('HUDScene');
        if (hudScene && typeof hudScene.resetForNewTrial === 'function') {
            hudScene.resetForNewTrial();
        }
        
        // Stop this scene
        this.scene.stop();
        
        console.log('FeedbackSceneV2: Scenes reset for new trial');
    }
}
