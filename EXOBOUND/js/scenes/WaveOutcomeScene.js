/**
 * WaveOutcomeScene.js - Dramatic Wave Outcome Display with Performance Analysis
 * © 2025 Azael Montejo Jr. | azaelmontejo.com | LinkedIn: @azaelmontejojr
 * Licensed under CC BY-NC 4.0 - Creative Commons Attribution-NonCommercial
 * 
 * Shows cinematic outcomes after each wave with performance-based narrative
 */
class WaveOutcomeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WaveOutcomeScene' });
        this.waveId = 0;
        this.outcomeData = null;
        this.performanceMetrics = null;
    }

    init(data) {
        this.waveId = data.waveId || 0;
        this.gameDataManager = this.registry.get('gameDataManager');
        this.globalSettings = this.registry.get('globalSettings');
        this.jsPsych = this.registry.get('jsPsych');
        
        console.log(`WaveOutcomeScene: Initializing for Wave ${this.waveId}`);
        this.analyzeWavePerformance();
        this.loadOutcomeData();
    }

    analyzeWavePerformance() {
        if (!this.gameDataManager) return;
        
        // Get performance metrics for this wave
        const waveTrials = this.gameDataManager.getCurrentWaveTrials();
        const summary = this.gameDataManager.getCampaignSummary();
        
        // Calculate wave-specific metrics
        let totalScore = 0;
        let coordinationLoss = 0;
        let adaptationLoss = 0;
        let successfulTrials = 0;
        
        waveTrials.forEach(trial => {
            if (trial.results) {
                totalScore += trial.results.totalScore || 0;
                coordinationLoss += trial.results.coordinationLoss || 0;
                adaptationLoss += trial.results.adaptationLoss || 0;
                if ((trial.results.totalScore || 0) > 0) successfulTrials++;
            }
        });
        
        const avgScore = waveTrials.length > 0 ? totalScore / waveTrials.length : 0;
        const successRate = waveTrials.length > 0 ? (successfulTrials / waveTrials.length) * 100 : 0;
        
        this.performanceMetrics = {
            avgScore: Math.round(avgScore),
            successRate: Math.round(successRate),
            coordinationLoss: Math.round(coordinationLoss / waveTrials.length),
            adaptationLoss: Math.round(adaptationLoss / waveTrials.length),
            trialsCompleted: waveTrials.length,
            overallRating: this.calculateOverallRating(successRate, avgScore),
            campaignProgress: summary.wavesCompleted
        };
    }

    calculateOverallRating(successRate, avgScore) {
        if (successRate >= 80 && avgScore >= 70) return 'EXCEPTIONAL';
        if (successRate >= 60 && avgScore >= 50) return 'COMMENDABLE';
        if (successRate >= 40 && avgScore >= 30) return 'ADEQUATE';
        if (successRate >= 20) return 'CONCERNING';
        return 'CRITICAL';
    }

    loadOutcomeData() {
        // Define outcome narratives based on performance
        const outcomeTemplates = {
            EXCEPTIONAL: {
                title: "MISSION SUCCESS",
                subtitle: "Outstanding Performance",
                color: '#00ff88',
                narratives: [
                    "Your tactical decisions were flawless, Commander. The fleet responds with unprecedented coordination.",
                    "Admiral Elena Velez herself couldn't have commanded better. Your name will be remembered.",
                    "Every ship followed your lead with absolute precision. This is what legendary command looks like.",
                    "The enemy's adaptations proved futile against your strategic mastery. Victory was never in doubt."
                ]
            },
            COMMENDABLE: {
                title: "MISSION SUCCESS",
                subtitle: "Commendable Leadership",
                color: '#66ccff',
                narratives: [
                    "Your command proved effective against challenging odds. The fleet's confidence grows.",
                    "Like Elena at the Battle of Proxima, you adapted when circumstances demanded flexibility.",
                    "Your tactical choices showed both caution and courage. The mark of a seasoned commander.",
                    "The fleet followed your guidance through uncertainty. Trust has been earned this day."
                ]
            },
            ADEQUATE: {
                title: "MISSION COMPLETE",
                subtitle: "Objectives Met",
                color: '#ff9900',
                narratives: [
                    "The mission is complete, though not without cost. The fleet endures.",
                    "Your decisions carried the fleet through troubled waters. Experience is the greatest teacher.",
                    "Victory came at a price, but victory nonetheless. Each battle teaches valuable lessons.",
                    "The fleet survived your learning curve. Command is never mastered, only practiced."
                ]
            },
            CONCERNING: {
                title: "MISSION UNCERTAIN",
                subtitle: "Mixed Results",
                color: '#ffaa00',
                narratives: [
                    "The mission yielded mixed results. The fleet questions some tactical decisions.",
                    "Your command showed moments of brilliance shadowed by critical missteps.",
                    "Some ships followed your lead while others hesitated. Unity remains elusive.",
                    "The enemy exploited gaps in your strategy. Adaptation will be crucial moving forward."
                ]
            },
            CRITICAL: {
                title: "MISSION FAILURE",
                subtitle: "Strategic Review Required",
                color: '#ff4444',
                narratives: [
                    "The mission faltered under tactical confusion. The fleet requires stronger leadership.",
                    "Your command decisions failed to inspire confidence. Doubt spreads through the ranks.",
                    "Critical errors in judgment cost precious resources and fleet morale.",
                    "The enemy's adaptations overwhelmed your strategic approach. Immediate reassessment needed."
                ]
            }
        };

        // Wave-specific additions
        const waveContexts = {
            1: "Your first command has concluded. The academy's training meets the harsh reality of combat.",
            2: "The solar storm has passed, but its lessons remain. Communication failures test true leadership.",
            3: "Enemy adaptation challenges conventional tactics. Innovation becomes your greatest weapon.",
            4: "Fleet coordination under pressure reveals the strength of your command presence.",
            5: "High Command's evaluation is complete. Your tactical doctrine has been thoroughly tested."
        };

        const rating = this.performanceMetrics.overallRating;
        const template = outcomeTemplates[rating];
        
        this.outcomeData = {
            ...template,
            waveContext: waveContexts[this.waveId] || "Another tactical engagement concludes.",
            metrics: this.performanceMetrics,
            narrativeText: template.narratives[Math.floor(Math.random() * template.narratives.length)]
        };
    }

    create() {
        console.log('WaveOutcomeScene: Creating dramatic outcome display');
        
        this.createBackground();
        this.createInterface();
        this.startOutcomeSequence();
    }

    createBackground() {
        // Dynamic background based on performance
        const baseColor = this.outcomeData.color === '#00ff88' ? 0x002211 : 
                          this.outcomeData.color === '#ff4444' ? 0x220011 : 0x001122;
        
        // Animated starfield
        this.starfield = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'starfield');
        this.starfield.setOrigin(0, 0);
        this.starfield.setAlpha(0.3);
        
        // Performance-based overlay
        this.overlay = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, baseColor, 0.7);
        this.overlay.setOrigin(0, 0);
        
        // Particle effects based on performance
        const particleColor = this.outcomeData.color === '#00ff88' ? 0x00ff88 :
                             this.outcomeData.color === '#ff4444' ? 0xff4444 : 0x66ccff;
        
        this.particles = this.add.particles(0, 0, 'laser_shot', {
            x: { min: 0, max: this.cameras.main.width },
            y: { min: 0, max: this.cameras.main.height },
            scale: { start: 0.02, end: 0.05 },
            alpha: { start: 0.6, end: 0 },
            lifespan: 6000,
            frequency: 150,
            tint: particleColor
        });
    }

    createInterface() {
        // Main outcome title
        this.titleText = this.add.text(this.cameras.main.width / 2, 120, this.outcomeData.title, {
            fontSize: '42px',
            fontFamily: 'Arial, monospace',
            color: this.outcomeData.color,
            align: 'center',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5).setAlpha(0);
        
        // Subtitle
        this.subtitleText = this.add.text(this.cameras.main.width / 2, 170, this.outcomeData.subtitle, {
            fontSize: '22px',
            fontFamily: 'Arial',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5).setAlpha(0);
        
        // Wave identifier
        this.waveText = this.add.text(this.cameras.main.width / 2, 200, `WAVE ${this.waveId} COMPLETE`, {
            fontSize: '16px',
            fontFamily: 'Arial, monospace',
            color: '#cccccc',
            align: 'center'
        }).setOrigin(0.5).setAlpha(0);
        
        // Performance metrics panel
        this.createMetricsPanel();
        
        // Narrative text area
        this.narrativeText = this.add.text(this.cameras.main.width / 2, 450, '', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 700 },
            lineSpacing: 8
        }).setOrigin(0.5).setAlpha(0);
        
        // Context text
        this.contextText = this.add.text(this.cameras.main.width / 2, 550, '', {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#ff9900',
            align: 'center',
            wordWrap: { width: 600 }
        }).setOrigin(0.5).setAlpha(0);
        
        // Continue prompt
        this.continueText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 60, '', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#66ccff',
            align: 'center'
        }).setOrigin(0.5).setAlpha(0);
    }

    createMetricsPanel() {
        // Metrics background
        this.metricsPanel = this.add.rectangle(this.cameras.main.width / 2, 320, 600, 100, 0x000000, 0.8);
        this.metricsPanel.setStrokeStyle(2, 0x66ccff);
        this.metricsPanel.setAlpha(0);
        
        // Performance metrics
        const metrics = this.performanceMetrics;
        const leftX = this.cameras.main.width / 2 - 200;
        const rightX = this.cameras.main.width / 2 + 200;
        const centerY = 320;
        
        // Left side metrics
        this.successRateText = this.add.text(leftX, centerY - 20, `Mission Success: ${metrics.successRate}%`, {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5).setAlpha(0);
        
        this.avgScoreText = this.add.text(leftX, centerY + 5, `Avg Score: ${metrics.avgScore}`, {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5).setAlpha(0);
        
        // Right side metrics
        this.coordLossText = this.add.text(rightX, centerY - 20, `Coordination Loss: ${metrics.coordinationLoss}`, {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#ffaa88'
        }).setOrigin(0.5).setAlpha(0);
        
        this.adaptLossText = this.add.text(rightX, centerY + 5, `Adaptation Loss: ${metrics.adaptationLoss}`, {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#ffaa88'
        }).setOrigin(0.5).setAlpha(0);
        
        // Center rating
        this.ratingText = this.add.text(this.cameras.main.width / 2, centerY + 20, `RATING: ${metrics.overallRating}`, {
            fontSize: '16px',
            fontFamily: 'Arial, monospace',
            color: this.outcomeData.color,
            fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0);
    }

    startOutcomeSequence() {
        // Animate starfield
        this.tweens.add({
            targets: this.starfield,
            x: -50,
            y: -25,
            duration: 30000,
            repeat: -1,
            ease: 'Linear'
        });
        
        // Title entrance
        this.tweens.add({
            targets: this.titleText,
            alpha: 1,
            scale: { from: 0.5, to: 1 },
            duration: 1000,
            ease: 'Back.easeOut',
            onComplete: () => {
                // Add title glow
                const glow = this.add.rectangle(this.titleText.x, this.titleText.y, 
                    this.titleText.width + 60, this.titleText.height + 20, 
                    Phaser.Display.Color.HexStringToColor(this.outcomeData.color).color, 0.2);
                glow.setBlendMode(Phaser.BlendModes.ADD);
                
                // Subtitle and wave text
                this.tweens.add({
                    targets: [this.subtitleText, this.waveText],
                    alpha: 1,
                    duration: 800,
                    delay: 300,
                    onComplete: () => {
                        this.time.delayedCall(500, () => this.revealMetrics());
                    }
                });
            }
        });
    }

    revealMetrics() {
        // Metrics panel entrance
        this.tweens.add({
            targets: this.metricsPanel,
            alpha: 1,
            scaleY: { from: 0, to: 1 },
            duration: 600,
            ease: 'Back.easeOut',
            onComplete: () => {
                // Animate individual metrics
                const metricsElements = [
                    this.successRateText, this.avgScoreText, 
                    this.coordLossText, this.adaptLossText, this.ratingText
                ];
                
                metricsElements.forEach((element, index) => {
                    this.tweens.add({
                        targets: element,
                        alpha: 1,
                        x: element.x + 20,
                        duration: 400,
                        delay: index * 100,
                        ease: 'Power2.easeOut'
                    });
                });
                
                this.time.delayedCall(1000, () => this.revealNarrative());
            }
        });
    }

    revealNarrative() {
        // Typewriter effect for main narrative
        this.typewriteText(this.narrativeText, this.outcomeData.narrativeText, () => {
            this.time.delayedCall(800, () => {
                // Show context
                this.typewriteText(this.contextText, this.outcomeData.waveContext, () => {
                    this.time.delayedCall(1000, () => this.showContinuePrompt());
                });
            });
        });
    }

    typewriteText(textObj, fullText, onComplete) {
        textObj.setAlpha(1);
        let currentChar = 0;
        
        const typeChar = () => {
            if (currentChar <= fullText.length) {
                textObj.setText(fullText.substring(0, currentChar));
                currentChar++;
                
                let delay = 5;
                if (fullText[currentChar - 1] === '.') delay = 30;
                else if (fullText[currentChar - 1] === ',') delay = 15;
                
                this.time.delayedCall(delay, typeChar);
            } else {
                onComplete();
            }
        };
        
        typeChar();
    }

    showContinuePrompt() {
        // Determine next action
        const isLastWave = this.waveId >= 10;
        const promptText = isLastWave ? '[ Click to Complete Campaign ]' : '[ Click to Continue ]';
        
        this.continueText.setText(promptText);
        this.continueText.setInteractive({ useHandCursor: true });
        
        this.tweens.add({
            targets: this.continueText,
            alpha: 1,
            duration: 500,
            onComplete: () => {
                // Pulsing effect
                this.tweens.add({
                    targets: this.continueText,
                    scaleX: 1.1,
                    scaleY: 1.1,
                    duration: 1200,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }
        });
        
        // Handle click
        this.continueText.on('pointerdown', () => this.completeOutcome());
        
        // Keyboard support
        this.input.keyboard.once('keydown-SPACE', () => this.completeOutcome());
        this.input.keyboard.once('keydown-ENTER', () => this.completeOutcome());
    }

    completeOutcome() {
        console.log('WaveOutcomeScene: Outcome complete, proceeding');
        
        // Disable interactions
        this.continueText.removeInteractive();
        this.input.keyboard.removeAllListeners();
        
        // Dramatic fade out
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        
        this.cameras.main.once('camerafadeoutcomplete', () => {
            // Determine next scene
            if (this.waveId >= 10) {
                // Campaign complete - go to post-survey
                if (this.jsPsych) {
                    this.jsPsych.finishTrial();
                }
            } else {
                // Continue to next wave briefing
                this.scene.start('BriefingScene', { waveId: this.waveId + 1 });
            }
        });
    }

    update() {
        // Subtle particle movement
        if (this.particles) {
            this.particles.setX(Phaser.Math.Between(0, this.cameras.main.width));
        }
    }
} 