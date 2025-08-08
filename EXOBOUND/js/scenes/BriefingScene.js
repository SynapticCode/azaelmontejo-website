/**
 * BriefingScene.js - Cinematic Wave Briefings with Enhanced Visual Effects
 * © 2025 Azael Montejo Jr. | azaelmontejo.com | LinkedIn: @azaelmontejojr
 * Licensed under CC BY-NC 4.0 - Creative Commons Attribution-NonCommercial
 * 
 * Creates immersive briefing experiences before each wave with dramatic storytelling
 */
class BriefingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BriefingScene' });
        this.waveId = 0;
        this.isTutorial = false;
        this.typewriterActive = false;
        this.currentTextIndex = 0;
        this.briefingData = null;
    }

    init(data) {
        this.waveId = data.waveId || 0;
        this.isTutorial = this.waveId === 0;
        this.gameDataManager = this.registry.get('gameDataManager');
        this.globalSettings = this.registry.get('globalSettings');
        this.jsPsych = this.registry.get('jsPsych');
        
        console.log(`BriefingScene: Initializing for Wave ${this.waveId}${this.isTutorial ? ' (Tutorial)' : ''}`);
        this.loadBriefingData();
    }

    loadBriefingData() {
        // Define briefing content for each wave
        this.briefingData = {
            0: { // Tutorial
                title: "TACTICAL TRAINING SIMULATION",
                subtitle: "New Terra Defense Academy",
                paragraphs: [
                    "Welcome to the fleet command simulation, Commander.",
                    "Your mission: Learn the tactical interface and master fleet coordination.",
                    "The academy's training algorithms will guide you through essential combat procedures.",
                    "This simulation draws from Admiral Elena Velez's tactical doctrines - the same strategies that saved the outer colonies.",
                    "Your performance here determines your readiness for active duty."
                ]
            },
            1: { // Wave 1: The Proving Ground
                title: "OPERATION EXOBOUND - WAVE 1",
                subtitle: "The Proving Ground",
                paragraphs: [
                    "This is it, Commander. Your first live combat operation.",
                    "Intelligence reports minimal raider activity in this sector. Perfect conditions for your inaugural command.",
                    "The fleet is watching. Show them the academy's training was worth every credit.",
                    "Communications are clear, systems are optimal. Everything you need for a successful first mission.",
                    "Remember Elena's words: 'A commander's first battle echoes through every future victory.'"
                ]
            },
            2: { // Wave 2: Communication Blackout
                title: "OPERATION EXOBOUND - WAVE 2",
                subtitle: "Solar Storm Protocol",
                paragraphs: [
                    "Solar flare activity has spiked beyond all projections, Commander.",
                    "The same electromagnetic chaos that severed Admiral Velez's final transmission now threatens your operation.",
                    "Communication reliability drops to 60%. Your orders may not reach every ship in the fleet.",
                    "In this static-filled void, leadership becomes an act of faith. Your actions must speak louder than words.",
                    "Elena faced this exact scenario at Arcturus Prime. She chose to lead by example rather than retreat to safety."
                ]
            },
            3: { // Wave 3: Enemy Adaptation
                title: "OPERATION EXOBOUND - WAVE 3", 
                subtitle: "Hostile Evolution",
                paragraphs: [
                    "The enemy has learned, Commander. Raider tactics show signs of sophisticated adaptation.",
                    "Our intelligence suggests they've been studying fleet movement patterns from previous engagements.",
                    "Standard approach vectors may no longer guarantee success. Innovation is your strongest weapon.",
                    "Elena's tactical journals speak of this moment: when the enemy stops reacting and starts anticipating.",
                    "The difference between a good commander and a legendary one is measured in moments like these."
                ]
            },
            4: { // Wave 4: Coordination Crisis
                title: "OPERATION EXOBOUND - WAVE 4",
                subtitle: "Fleet Discipline Under Fire",
                paragraphs: [
                    "Recent losses have shaken fleet morale, Commander. Doubt spreads faster than plasma fire.",
                    "Some captains question standard protocols. Others cling to them with desperate certainty.",
                    "Fleet coordination scores have dropped 15% as ship commanders second-guess tactical orders.",
                    "Elena faced a similar crisis during the Vega rebellion. She reminded her fleet that unity isn't uniformity.",
                    "The strongest commanders forge order from chaos, not through force, but through unwavering purpose."
                ]
            },
            5: { // Wave 5: The Test of Command
                title: "OPERATION EXOBOUND - WAVE 5",
                subtitle: "Command Evaluation",
                paragraphs: [
                    "High Command is watching this operation closely, Commander.",
                    "Your tactical decisions are being analyzed by the same strategists who evaluated Admiral Velez.",
                    "Five waves of combat have revealed your command style. Now comes the true test.",
                    "The enemy knows your patterns, your fleet knows your expectations, and Command knows your potential.",
                    "Elena called this 'the crucible moment' - where competence transforms into mastery."
                ]
            }
        };

        // Get data for current wave, fallback to generic if not found
        this.currentBriefing = this.briefingData[this.waveId] || {
            title: `OPERATION EXOBOUND - WAVE ${this.waveId}`,
            subtitle: "Mission Briefing",
            paragraphs: [
                "Prepare for tactical engagement, Commander.",
                "Enemy forces detected in your operational sector.",
                "Fleet coordination will be essential for mission success.",
                "Execute your orders with precision and adapt to changing conditions."
            ]
        };
    }

    create() {
        console.log('BriefingScene: Creating cinematic briefing interface');
        
        // Create immersive background
        this.createBackground();
        
        // Create cinematic UI elements
        this.createInterface();
        
        // Start the briefing sequence
        this.startBriefingSequence();
    }

    createBackground() {
        // Animated starfield
        this.starfield = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'starfield');
        this.starfield.setOrigin(0, 0);
        this.starfield.setAlpha(0.4);
        
        // Add depth with multiple starfield layers
        this.backgroundStars = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'starfield');
        this.backgroundStars.setOrigin(0, 0);
        this.backgroundStars.setAlpha(0.2);
        this.backgroundStars.setScale(1.2);
        
        // Create particle field for atmosphere
        this.particles = this.add.particles(0, 0, 'laser_shot', {
            x: { min: 0, max: this.cameras.main.width },
            y: { min: 0, max: this.cameras.main.height },
            scale: { start: 0.01, end: 0.03 },
            alpha: { start: 0.3, end: 0 },
            lifespan: 8000,
            frequency: 200,
            tint: 0x66ccff
        });
        
        // Dark overlay for dramatic effect
        this.overlay = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000011, 0.85);
        this.overlay.setOrigin(0, 0);
        
        // Cinematic bars (letterbox effect)
        this.topBar = this.add.rectangle(0, 0, this.cameras.main.width, 80, 0x000000, 1);
        this.topBar.setOrigin(0, 0);
        this.bottomBar = this.add.rectangle(0, this.cameras.main.height - 80, this.cameras.main.width, 80, 0x000000, 1);
        this.bottomBar.setOrigin(0, 0);
    }

    createInterface() {
        // Main title with enhanced effects
        this.titleText = this.add.text(this.cameras.main.width / 2, 140, this.currentBriefing.title, {
            fontSize: '38px',
            fontFamily: 'Arial, monospace',
            color: '#66ccff',
            align: 'center',
            stroke: '#001122',
            strokeThickness: 2
        }).setOrigin(0.5).setAlpha(0);
        
        // Subtitle
        this.subtitleText = this.add.text(this.cameras.main.width / 2, 185, this.currentBriefing.subtitle, {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ff9900',
            align: 'center'
        }).setOrigin(0.5).setAlpha(0);
        
        // Mission classification
        this.classificationText = this.add.text(this.cameras.main.width / 2, 215, '[CLASSIFIED - FLEET COMMAND ONLY]', {
            fontSize: '12px',
            fontFamily: 'Arial, monospace',
            color: '#666666',
            align: 'center'
        }).setOrigin(0.5).setAlpha(0);
        
        // Content area for briefing text
        this.contentY = 270;
        this.contentTexts = [];
        
        // Continue prompt
        this.continueText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 120, '', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ff9900',
            align: 'center'
        }).setOrigin(0.5).setAlpha(0);
        
        // Progress indicator
        this.progressIndicator = this.add.text(this.cameras.main.width - 40, this.cameras.main.height - 40, '', {
            fontSize: '14px',
            fontFamily: 'Arial, monospace',
            color: '#666666',
            align: 'right'
        }).setOrigin(1, 1).setAlpha(0);
    }

    startBriefingSequence() {
        // Fade in title sequence
        this.tweens.add({
            targets: this.titleText,
            alpha: 1,
            duration: 1000,
            ease: 'Power2.easeOut',
            onComplete: () => {
                // Add title glow effect
                this.titleGlow = this.add.rectangle(this.titleText.x, this.titleText.y, this.titleText.width + 40, this.titleText.height + 20, 0x66ccff, 0.1);
                this.titleGlow.setBlendMode(Phaser.BlendModes.ADD);
                
                // Fade in subtitle
                this.tweens.add({
                    targets: [this.subtitleText, this.classificationText],
                    alpha: 1,
                    duration: 800,
                    delay: 500,
                    onComplete: () => {
                        this.time.delayedCall(1000, () => this.startContentReveal());
                    }
                });
            }
        });
        
        // Animate background elements
        this.tweens.add({
            targets: this.starfield,
            x: -100,
            y: -50,
            duration: 60000,
            repeat: -1,
            ease: 'Linear'
        });
        
        this.tweens.add({
            targets: this.backgroundStars,
            x: 50,
            y: -30,
            duration: 40000,
            repeat: -1,
            ease: 'Linear'
        });
    }

    startContentReveal() {
        this.typewriterActive = true;
        this.currentTextIndex = 0;
        this.updateProgressIndicator();
        this.revealNextParagraph();
    }

    revealNextParagraph() {
        if (this.currentTextIndex >= this.currentBriefing.paragraphs.length) {
            this.showContinuePrompt();
            return;
        }
        
        const paragraph = this.currentBriefing.paragraphs[this.currentTextIndex];
        const yPosition = this.contentY + (this.currentTextIndex * 80);
        
        // Create text object for this paragraph
        const textObj = this.add.text(120, yPosition, '', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff',
            wordWrap: { width: this.cameras.main.width - 240 },
            lineSpacing: 5
        }).setAlpha(0);
        
        this.contentTexts.push(textObj);
        
        // Fade in the text container
        this.tweens.add({
            targets: textObj,
            alpha: 1,
            duration: 300,
            onComplete: () => {
                this.typewriteParagraph(textObj, paragraph, () => {
                    this.time.delayedCall(800, () => {
                        this.currentTextIndex++;
                        this.updateProgressIndicator();
                        this.revealNextParagraph();
                    });
                });
            }
        });
    }

    typewriteParagraph(textObj, paragraph, onComplete) {
        let currentChar = 0;
        const totalChars = paragraph.length;
        
        const typeChar = () => {
            if (currentChar <= totalChars) {
                textObj.setText(paragraph.substring(0, currentChar));
                currentChar++;
                
                // Variable typing speed for dramatic effect
                let delay = 4;
                if (paragraph[currentChar - 1] === '.') delay = 22;
                else if (paragraph[currentChar - 1] === ',') delay = 10;
                else if (paragraph[currentChar - 1] === ' ') delay = 2;
                
                this.time.delayedCall(delay, typeChar);
            } else {
                onComplete();
            }
        };
        
        typeChar();
    }

    updateProgressIndicator() {
        const progress = `${this.currentTextIndex + 1}/${this.currentBriefing.paragraphs.length}`;
        this.progressIndicator.setText(progress);
        
        if (this.progressIndicator.alpha === 0) {
            this.tweens.add({
                targets: this.progressIndicator,
                alpha: 1,
                duration: 300
            });
        }
    }

    showContinuePrompt() {
        this.typewriterActive = false;
        
        // Show continuation prompt
        this.continueText.setText('[ Click to Begin Mission ]');
        this.continueText.setInteractive({ useHandCursor: true });
        
        this.tweens.add({
            targets: this.continueText,
            alpha: 1,
            duration: 500,
            onComplete: () => {
                // Add pulsing effect
                this.tweens.add({
                    targets: this.continueText,
                    scaleX: 1.1,
                    scaleY: 1.1,
                    duration: 1000,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }
        });
        
        // Handle click to continue
        this.continueText.on('pointerdown', () => this.completeBriefing());
        
        // Also allow spacebar or enter
        this.input.keyboard.once('keydown-SPACE', () => this.completeBriefing());
        this.input.keyboard.once('keydown-ENTER', () => this.completeBriefing());
    }

    completeBriefing() {
        console.log('BriefingScene: Briefing complete, transitioning to game');
        
        // Disable interactions
        this.continueText.removeInteractive();
        this.input.keyboard.removeAllListeners();
        
        // Dramatic exit transition
        this.cameras.main.fadeOut(1500, 0, 0, 0);
        
        this.cameras.main.once('camerafadeoutcomplete', () => {
            // Transition to appropriate scene
            if (this.isTutorial) {
                this.scene.start('TutorialScene');
            } else {
                this.scene.start('GameScene');
            }
        });
    }

    update() {
        // Subtle background animations
        if (this.particles) {
            this.particles.setX(Phaser.Math.Between(0, this.cameras.main.width));
        }
    }
} 