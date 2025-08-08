export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init(data) {
        // Receive the isMobile flag from the TitleScene
        this.isMobile = data.isMobile;
        
        // Initialize game data
        this.gameData = [];
        this.score = 0;
        
        // Game duration in seconds (5 minutes)
        this.gameDuration = 300;
    }

    preload() {
        // Create placeholder graphics for now
        this.load.image('player', 'https://labs.phaser.io/assets/sprites/mushroom2.png');
        this.load.image('npc_operations', 'https://labs.phaser.io/assets/sprites/bluemushroom.png');
        this.load.image('npc_rnd', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
        
        // Load the rexUI plugin for dialogs if on mobile
        if (this.isMobile) {
            this.load.plugin('rexvirtualjoystickplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js', true);
        }
        
        // Load the rexUI plugin for dialogs
        this.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
    }
    create() {
        // Create a simple background
        this.add.rectangle(400, 300, 800, 600, 0x333333);
        
        // Create a simple "office" layout with rectangles
        this.add.rectangle(200, 200, 300, 200, 0x666666); // "Operations" area
        this.add.rectangle(600, 200, 300, 200, 0x666666); // "R&D" area
        
        // Add area labels
        this.add.text(200, 200, 'Operations', { fontSize: '24px', color: '#ffffff' }).setOrigin(0.5);
        this.add.text(600, 200, 'R&D', { fontSize: '24px', color: '#ffffff' }).setOrigin(0.5);
        
        // Create the player
        this.player = this.physics.add.sprite(400, 300, 'player');
        this.player.setCollideWorldBounds(true);
        
        // Create NPCs
        this.npcOperations = this.physics.add.sprite(200, 200, 'npc_operations');
        this.npcRnD = this.physics.add.sprite(600, 200, 'npc_rnd');
        
        // Create interaction zones around NPCs
        this.interactionZones = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
        
        const opsZone = this.interactionZones.create(200, 200, 100, 100);
        opsZone.name = 'Operations';
        
        const rndZone = this.interactionZones.create(600, 200, 100, 100);
        rndZone.name = 'RnD';
        
        // Set up overlap detection
        this.physics.add.overlap(this.player, this.interactionZones, this.onZoneOverlap, null, this);
        
        // Set up controls
        this.setupControls();
        
        // Set up UI
        this.setupUI();
        
        // Start the game timer
        this.gameTimer = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
        
        // Log game start
        this.logEvent('game_start', {
            device_type: this.isMobile ? 'mobile' : 'desktop'
        });
    }
    setupControls() {
        if (this.isMobile) {
            // Mobile controls using virtual joystick
            if (this.rexVirtualJoystick) {
                this.joyStick = this.rexVirtualJoystick.add(this, {
                    x: 100,
                    y: 500,
                    radius: 50,
                    base: this.add.circle(0, 0, 50, 0x888888, 0.5),
                    thumb: this.add.circle(0, 0, 25, 0xcccccc, 0.7),
                }).setScrollFactor(0);
            }
            
            // Add interaction button for mobile
            this.interactButton = this.add.circle(700, 500, 40, 0x4a6fa5, 0.7)
                .setScrollFactor(0)
                .setInteractive()
                .on('pointerdown', () => {
                    this.checkInteraction();
                });
                
            this.add.text(700, 500, 'E', { 
                fontSize: '32px', 
                color: '#ffffff' 
            }).setOrigin(0.5).setScrollFactor(0);
        } else {
            // Desktop controls
            this.cursors = this.input.keyboard.createCursorKeys();
            this.interactKey = this.input.keyboard.addKey('E');
            
            // Add key prompt
            this.add.text(400, 550, 'Press E to interact when near an NPC', {
                fontSize: '18px',
                color: '#ffffff'
            }).setOrigin(0.5).setScrollFactor(0);
        }
    }
    
    setupUI() {
        // Score display
        this.scoreText = this.add.text(16, 16, 'Score: 0', { 
            fontSize: '24px', 
            color: '#ffffff',
            backgroundColor: '#000000'
        }).setScrollFactor(0);
        
        // Timer display
        this.timerText = this.add.text(16, 50, `Time: ${this.gameDuration}`, { 
            fontSize: '24px', 
            color: '#ffffff',
            backgroundColor: '#000000'
        }).setScrollFactor(0);
    }
    updateTimer() {
        this.gameDuration--;
        this.timerText.setText(`Time: ${this.gameDuration}`);
        
        if (this.gameDuration <= 0) {
            this.endGame();
        }
    }
    
    deductTime(seconds) {
        this.gameDuration -= seconds;
        if (this.gameDuration < 0) this.gameDuration = 0;
        this.timerText.setText(`Time: ${this.gameDuration}`);
    }
    
    endGame() {
        this.gameTimer.remove();
        
        // Log game end
        this.logEvent('game_end', {
            final_score: this.score
        });
        
        // Transition to EndScene
        this.scene.start('EndScene', { 
            score: this.score,
            gameData: this.gameData
        });
    }
    onZoneOverlap(player, zone) {
        // Visual indicator that interaction is possible
        if (!this.interactionIndicator) {
            this.interactionIndicator = this.add.text(player.x, player.y - 40, 'Press E', {
                fontSize: '16px',
                color: '#ffffff',
                backgroundColor: '#000000'
            }).setOrigin(0.5);
        } else {
            this.interactionIndicator.setPosition(player.x, player.y - 40);
            this.interactionIndicator.setVisible(true);
        }
        
        // Check for interaction key press
        if (this.interactKey && Phaser.Input.Keyboard.JustDown(this.interactKey)) {
            this.initiateInteraction(zone.name);
        }
    }
    
    checkInteraction() {
        // For mobile button press
        let closestZone = null;
        let minDistance = 100; // Maximum interaction distance
        
        this.interactionZones.getChildren().forEach(zone => {
            const distance = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                zone.x, zone.y
            );
            
            if (distance < minDistance) {
                minDistance = distance;
                closestZone = zone;
            }
        });
        
        if (closestZone) {
            this.initiateInteraction(closestZone.name);
        }
    }
    initiateInteraction(zoneName) {
        if (zoneName === 'Operations') {
            this.createDialogue(
                'Operations',
                'A new shipment has arrived. How should we process it?',
                { text: 'Follow SOP', type: 'exploitation' },
                { text: 'Try New Algorithm', type: 'exploration' }
            );
        } else if (zoneName === 'RnD') {
            this.createDialogue(
                'R&D',
                'We have a prototype idea. Should we pursue it?',
                { text: 'Refine Existing Tech', type: 'exploitation' },
                { text: 'Develop Blue-Sky Project', type: 'exploration' }
            );
        }
    }
    
    createDialogue(npcId, text, choiceA, choiceB) {
        // Prevent creating multiple dialogues
        if (this.dialog) {
            return;
        }
        
        // Create dialog using rexUI
        const dialogConfig = {
            x: 400,
            y: 300,
            width: 500,
            
            background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x1565c0),
            
            title: this.rexUI.add.label({
                background: this.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x003c8f),
                text: this.add.text(0, 0, npcId, { fontSize: '24px' }),
                space: { left: 15, right: 15, top: 10, bottom: 10 }
            }),
            
            content: this.add.text(0, 0, text, { 
                fontSize: '20px', 
                wordWrap: { width: 480 }, 
                align: 'center' 
            }),
            
            actions: [
                this.createButton(choiceA.text),
                this.createButton(choiceB.text)
            ],
            
            space: { 
                title: 25, 
                content: 25, 
                action: 15, 
                left: 20, 
                right: 20, 
                top: 20, 
                bottom: 20 
            },
            align: { actions: 'center' },
            expand: { content: false }
        };
        
        this.dialog = this.rexUI.add.dialog(dialogConfig)
            .layout()
            .popUp(500);
            
        this.dialog
            .on('button.click', (button, groupName, index) => {
                const choice = (index === 0) ? choiceA : choiceB;
                this.handlePlayerChoice(npcId, choice);
                this.dialog.scaleDownDestroy(100);
                this.dialog = null;
            })
            .on('button.over', (button, groupName, index) => {
                button.getElement('background').setStrokeStyle(1, 0xffffff);
            })
            .on('button.out', (button, groupName, index) => {
                button.getElement('background').setStrokeStyle();
            });
    }
    
    createButton(text) {
        return this.rexUI.add.label({
            background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0x003c8f),
            text: this.add.text(0, 0, text, { fontSize: '20px' }),
            space: { left: 10, right: 10, top: 10, bottom: 10 }
        });
    }
    handlePlayerChoice(npcId, choice) {
        const timeCost = 15; // All interactions cost 15 seconds
        this.deductTime(timeCost);
        
        let outcome = {};
        if (choice.type === 'exploitation') {
            outcome = { score: 10, success: true }; // Predictable outcome
        } else { // exploration
            if (Math.random() > 0.5) {
                outcome = { score: 30, success: true }; // High reward
            } else {
                outcome = { score: 0, success: false }; // Failure
            }
        }
        
        this.score = (this.score || 0) + outcome.score;
        this.scoreText.setText(`Score: ${this.score}`);
        
        // Show outcome feedback
        const feedbackText = outcome.success ? 
            `Success! +${outcome.score} points` : 
            'Attempt failed. No points gained.';
            
        const feedback = this.add.text(400, 400, feedbackText, {
            fontSize: '24px',
            color: outcome.success ? '#00ff00' : '#ff0000',
            backgroundColor: '#000000'
        }).setOrigin(0.5);
        
        this.time.delayedCall(2000, () => {
            feedback.destroy();
        });
        
        // Log this event
        this.logEvent('interaction', {
            npc: npcId,
            choice: choice.type,
            outcome_score: outcome.score,
            outcome_success: outcome.success,
            time_cost: timeCost
        });
    }
    
    logEvent(eventType, eventData) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            game_time_remaining: this.gameDuration,
            event_type: eventType,
            ...eventData
        };
        this.gameData.push(logEntry);
        console.log('Logged Event:', logEntry);
    }
    update() {
        // Handle player movement
        if (this.isMobile && this.joyStick) {
            // Mobile joystick controls
            const force = this.joyStick.force;
            if (force > 0) {
                const speed = 160;
                this.player.setVelocity(
                    this.joyStick.forceX * speed,
                    this.joyStick.forceY * speed
                );
                
                // Simple animation based on direction
                if (Math.abs(this.joyStick.forceX) > Math.abs(this.joyStick.forceY)) {
                    // Moving horizontally
                    this.player.setFlipX(this.joyStick.forceX < 0);
                }
            } else {
                this.player.setVelocity(0);
            }
        } else if (this.cursors) {
            // Desktop keyboard controls
            this.player.setVelocity(0);
            
            if (this.cursors.left.isDown) {
                this.player.setVelocityX(-160);
                this.player.setFlipX(true);
            } else if (this.cursors.right.isDown) {
                this.player.setVelocityX(160);
                this.player.setFlipX(false);
            }
            
            if (this.cursors.up.isDown) {
                this.player.setVelocityY(-160);
            } else if (this.cursors.down.isDown) {
                this.player.setVelocityY(160);
            }
        }
        
        // Hide interaction indicator if player moves away from NPCs
        if (this.interactionIndicator) {
            let nearNPC = false;
            this.interactionZones.getChildren().forEach(zone => {
                const distance = Phaser.Math.Distance.Between(
                    this.player.x, this.player.y,
                    zone.x, zone.y
                );
                
                if (distance < 100) {
                    nearNPC = true;
                }
            });
            
            if (!nearNPC) {
                this.interactionIndicator.setVisible(false);
            }
        }
    }
}
