/**
 * PostSurveyScene.js - Post-Experiment Survey for Research Data Collection
 * © 2025 Azael Montejo Jr. | azaelmontejo.com | LinkedIn: @azaelmontejojr
 * Licensed under CC BY-NC 4.0 - Creative Commons Attribution-NonCommercial
 * 
 * Collects anonymous feedback and research data after experiment completion
 */
class PostSurveyScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PostSurveyScene' });
        this.surveyData = {};
        this.currentPage = 0;
        this.totalPages = 4;
    }

    init(data) {
        this.gameDataManager = this.registry.get('gameDataManager');
        this.globalSettings = this.registry.get('globalSettings');
        this.jsPsych = this.registry.get('jsPsych');
        console.log('PostSurveyScene: Initialized for post-experiment data collection');
    }

    create() {
        // Create background
        this.starfield = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'starfield');
        this.starfield.setOrigin(0, 0);
        this.starfield.setAlpha(0.3);

        // Add subtle background overlay
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000033, 0.7)
            .setOrigin(0, 0);

        this.createSurveyInterface();
        this.showPage(this.currentPage);
    }

    createSurveyInterface() {
        // Title
        this.titleText = this.add.text(this.cameras.main.width / 2, 60, 'POST-EXPERIMENT SURVEY', {
            fontSize: '36px',
            fontFamily: 'Arial',
            color: '#66ccff',
            align: 'center'
        }).setOrigin(0.5);

        // Subtitle
        this.subtitleText = this.add.text(this.cameras.main.width / 2, 100, 'Your feedback helps improve future research', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#ff9900',
            align: 'center'
        }).setOrigin(0.5);

        // Progress indicator
        this.progressText = this.add.text(this.cameras.main.width / 2, 130, '', {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#cccccc',
            align: 'center'
        }).setOrigin(0.5);

        // Create container for survey content
        this.surveyContainer = this.add.container(0, 0);

        // Navigation buttons
        this.prevButton = this.add.text(150, this.cameras.main.height - 60, '← Previous', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#66ccff',
            backgroundColor: '#333',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.previousPage())
        .on('pointerover', () => this.prevButton.setColor('#ffffff'))
        .on('pointerout', () => this.prevButton.setColor('#66ccff'));

        this.nextButton = this.add.text(this.cameras.main.width - 150, this.cameras.main.height - 60, 'Next →', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#66ccff',
            backgroundColor: '#333',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.nextPage())
        .on('pointerover', () => this.nextButton.setColor('#ffffff'))
        .on('pointerout', () => this.nextButton.setColor('#66ccff'));

        this.submitButton = this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 60, 'Submit Survey', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#2c5aa0',
            padding: { x: 30, y: 12 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.submitSurvey())
        .on('pointerover', () => this.submitButton.setBackgroundColor('#3d6bb0'))
        .on('pointerout', () => this.submitButton.setBackgroundColor('#2c5aa0'))
        .setVisible(false);
    }

    showPage(pageNum) {
        this.surveyContainer.removeAll(true);
        this.progressText.setText(`Page ${pageNum + 1} of ${this.totalPages}`);

        switch(pageNum) {
            case 0:
                this.createExperiencePage();
                break;
            case 1:
                this.createStrategyPage();
                break;
            case 2:
                this.createInterfacePage();
                break;
            case 3:
                this.createFinalPage();
                break;
        }

        this.updateNavigationButtons();
    }

    createExperiencePage() {
        const startY = 180;
        
        this.add.text(this.cameras.main.width / 2, startY, 'OVERALL EXPERIENCE', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#66ccff',
            align: 'center'
        }).setOrigin(0.5);

        // Question 1: Overall difficulty
        let currentY = startY + 60;
        this.add.text(100, currentY, '1. How would you rate the overall difficulty of the tactical scenarios?', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff',
            wordWrap: { width: 800 }
        });

        currentY += 40;
        const difficultyOptions = ['Very Easy', 'Easy', 'Moderate', 'Difficult', 'Very Difficult'];
        this.createRadioGroup('difficulty', difficultyOptions, 150, currentY);

        // Question 2: Engagement level
        currentY += 120;
        this.add.text(100, currentY, '2. How engaging did you find the tactical scenarios?', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff',
            wordWrap: { width: 800 }
        });

        currentY += 40;
        const engagementOptions = ['Not Engaging', 'Slightly Engaging', 'Moderately Engaging', 'Very Engaging', 'Extremely Engaging'];
        this.createRadioGroup('engagement', engagementOptions, 150, currentY);

        // Question 3: Stress level
        currentY += 120;
        this.add.text(100, currentY, '3. What was your stress level during the scenarios?', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff',
            wordWrap: { width: 800 }
        });

        currentY += 40;
        const stressOptions = ['No Stress', 'Low Stress', 'Moderate Stress', 'High Stress', 'Very High Stress'];
        this.createRadioGroup('stress', stressOptions, 150, currentY);
    }

    createStrategyPage() {
        const startY = 180;
        
        this.add.text(this.cameras.main.width / 2, startY, 'STRATEGY & DECISION-MAKING', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#66ccff',
            align: 'center'
        }).setOrigin(0.5);

        // Question 1: Decision strategy
        let currentY = startY + 60;
        this.add.text(100, currentY, '1. What was your primary strategy when making targeting decisions?', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff',
            wordWrap: { width: 800 }
        });

        currentY += 40;
        const strategyOptions = [
            'Always target the asteroid (safe approach)',
            'Always target raiders (optimal approach)', 
            'Follow what others were doing',
            'Mixed strategy based on situation',
            'Trial and error approach'
        ];
        this.createRadioGroup('strategy', strategyOptions, 150, currentY);

        // Question 2: Information usage
        currentY += 180;
        this.add.text(100, currentY, '2. How much did you rely on the coordination feedback from your fleet?', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff',
            wordWrap: { width: 800 }
        });

        currentY += 40;
        const relianceOptions = ['Not at all', 'Slightly', 'Moderately', 'Heavily', 'Completely'];
        this.createRadioGroup('reliance', relianceOptions, 150, currentY);

        // Question 3: Learning progression
        currentY += 120;
        this.add.text(100, currentY, '3. Did your strategy change as you progressed through the waves?', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff',
            wordWrap: { width: 800 }
        });

        currentY += 40;
        const learningOptions = ['No change', 'Minor adjustments', 'Moderate changes', 'Major changes', 'Complete strategy overhaul'];
        this.createRadioGroup('learning', learningOptions, 150, currentY);
    }

    createInterfacePage() {
        const startY = 180;
        
        this.add.text(this.cameras.main.width / 2, startY, 'INTERFACE & USABILITY', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#66ccff',
            align: 'center'
        }).setOrigin(0.5);

        // Question 1: Interface clarity
        let currentY = startY + 60;
        this.add.text(100, currentY, '1. How clear and understandable was the game interface?', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff',
            wordWrap: { width: 800 }
        });

        currentY += 40;
        const clarityOptions = ['Very Confusing', 'Confusing', 'Neutral', 'Clear', 'Very Clear'];
        this.createRadioGroup('clarity', clarityOptions, 150, currentY);

        // Question 2: Control responsiveness
        currentY += 120;
        this.add.text(100, currentY, '2. How responsive were the controls (targeting lever)?', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff',
            wordWrap: { width: 800 }
        });

        currentY += 40;
        const responsivenessOptions = ['Very Poor', 'Poor', 'Adequate', 'Good', 'Excellent'];
        this.createRadioGroup('responsiveness', responsivenessOptions, 150, currentY);

        // Question 3: Visual feedback
        currentY += 120;
        this.add.text(100, currentY, '3. How helpful was the visual feedback (explosions, ships, etc.)?', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff',
            wordWrap: { width: 800 }
        });

        currentY += 40;
        const feedbackOptions = ['Not Helpful', 'Slightly Helpful', 'Moderately Helpful', 'Very Helpful', 'Extremely Helpful'];
        this.createRadioGroup('feedback', feedbackOptions, 150, currentY);
    }

    createFinalPage() {
        const startY = 180;
        
        this.add.text(this.cameras.main.width / 2, startY, 'FINAL QUESTIONS', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#66ccff',
            align: 'center'
        }).setOrigin(0.5);

        // Question 1: Gaming experience
        let currentY = startY + 60;
        this.add.text(100, currentY, '1. How would you describe your general gaming experience?', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff',
            wordWrap: { width: 800 }
        });

        currentY += 40;
        const gamingOptions = ['No gaming experience', 'Casual gamer', 'Regular gamer', 'Experienced gamer', 'Professional/Competitive gamer'];
        this.createRadioGroup('gaming', gamingOptions, 150, currentY);

        // Question 2: Age group
        currentY += 140;
        this.add.text(100, currentY, '2. Age group (optional, for research demographics only):', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff',
            wordWrap: { width: 800 }
        });

        currentY += 40;
        const ageOptions = ['18-24', '25-34', '35-44', '45-54', '55+', 'Prefer not to answer'];
        this.createRadioGroup('age', ageOptions, 150, currentY);

        // Open-ended feedback
        currentY += 140;
        this.add.text(100, currentY, '3. Any additional comments or feedback about the study?', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff',
            wordWrap: { width: 800 }
        });

        currentY += 40;
        this.createTextArea('comments', 150, currentY, 700, 80);

        // Thank you message
        currentY += 120;
        this.add.text(this.cameras.main.width / 2, currentY, 'Thank you for your participation in this research!', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#ff9900',
            align: 'center'
        }).setOrigin(0.5);
    }

    createRadioGroup(questionKey, options, x, y) {
        if (!this.surveyData[questionKey]) {
            this.surveyData[questionKey] = null;
        }

        options.forEach((option, index) => {
            const optionY = y + (index * 30);
            
            // Create radio button circle
            const circle = this.add.circle(x, optionY, 8, 0x333333, 1)
                .setStrokeStyle(2, 0x66ccff)
                .setInteractive({ useHandCursor: true })
                .on('pointerdown', () => this.selectRadioOption(questionKey, index, circle));

            // Option text
            const optionText = this.add.text(x + 25, optionY, option, {
                fontSize: '14px',
                fontFamily: 'Arial',
                color: '#cccccc'
            }).setOrigin(0, 0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.selectRadioOption(questionKey, index, circle));

            // Store references for updating
            circle.questionKey = questionKey;
            circle.optionIndex = index;
            circle.optionText = optionText;
        });
    }

    createTextArea(questionKey, x, y, width, height) {
        // Create DOM element for text input
        const textArea = document.createElement('textarea');
        textArea.style.position = 'absolute';
        textArea.style.left = x + 'px';
        textArea.style.top = y + 'px';
        textArea.style.width = width + 'px';
        textArea.style.height = height + 'px';
        textArea.style.backgroundColor = '#333333';
        textArea.style.color = '#ffffff';
        textArea.style.border = '2px solid #66ccff';
        textArea.style.borderRadius = '5px';
        textArea.style.padding = '10px';
        textArea.style.fontSize = '14px';
        textArea.style.fontFamily = 'Arial';
        textArea.style.resize = 'none';
        textArea.placeholder = 'Enter your comments here...';
        
        textArea.addEventListener('input', () => {
            this.surveyData[questionKey] = textArea.value;
        });

        document.body.appendChild(textArea);
        
        // Store reference for cleanup
        if (!this.textAreas) this.textAreas = [];
        this.textAreas.push(textArea);
    }

    selectRadioOption(questionKey, optionIndex, selectedCircle) {
        this.surveyData[questionKey] = optionIndex;

        // Update all circles for this question
        this.children.list.forEach(child => {
            if (child.questionKey === questionKey) {
                if (child.optionIndex === optionIndex) {
                    child.setFillStyle(0x66ccff, 1);
                } else {
                    child.setFillStyle(0x333333, 1);
                }
            }
        });
    }

    updateNavigationButtons() {
        this.prevButton.setVisible(this.currentPage > 0);
        this.nextButton.setVisible(this.currentPage < this.totalPages - 1);
        this.submitButton.setVisible(this.currentPage === this.totalPages - 1);
    }

    previousPage() {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.showPage(this.currentPage);
        }
    }

    nextPage() {
        if (this.currentPage < this.totalPages - 1) {
            this.currentPage++;
            this.showPage(this.currentPage);
        }
    }

    submitSurvey() {
        // Validate required fields
        const requiredFields = ['difficulty', 'engagement', 'strategy', 'clarity', 'gaming'];
        const missingFields = requiredFields.filter(field => this.surveyData[field] === null || this.surveyData[field] === undefined);

        if (missingFields.length > 0) {
            this.showValidationError('Please answer all required questions before submitting.');
            return;
        }

        // Add completion timestamp
        this.surveyData.completionTime = new Date().toISOString();
        this.surveyData.totalGameTime = this.gameDataManager ? this.gameDataManager.getTotalGameTime() : null;

        console.log('Survey Data Collected:', this.surveyData);

        // Store survey data
        if (this.gameDataManager) {
            this.gameDataManager.setSurveyData(this.surveyData);
        }

        this.showThankYouMessage();
    }

    showValidationError(message) {
        // Remove existing error message
        if (this.errorText) {
            this.errorText.destroy();
        }

        this.errorText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 120, message, {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ff6666',
            align: 'center',
            backgroundColor: '#330000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        // Auto-remove after 3 seconds
        this.time.delayedCall(3000, () => {
            if (this.errorText) {
                this.errorText.destroy();
                this.errorText = null;
            }
        });
    }

    showThankYouMessage() {
        // Clear the scene
        this.children.removeAll(true);
        this.cleanupDOM();

        // Create final thank you screen
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000022, 1)
            .setOrigin(0, 0);

        this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 100, 'SURVEY COMPLETE', {
            fontSize: '42px',
            fontFamily: 'Arial',
            color: '#66ccff',
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 40, 'Thank you for participating in this research study!', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 20, 'Your responses have been recorded and will contribute to scientific understanding', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#cccccc',
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 50, 'of decision-making in complex environments.', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#cccccc',
            align: 'center'
        }).setOrigin(0.5);

        // Create share functionality
        this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 120, 'Share this research study:', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#ff9900',
            align: 'center'
        }).setOrigin(0.5);

        // Share button
        this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 160, 'Share Study', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#2c5aa0',
            padding: { x: 25, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.shareStudy())
        .on('pointerover', function() { this.setBackgroundColor('#3d6bb0'); })
        .on('pointerout', function() { this.setBackgroundColor('#2c5aa0'); });

        // Copyright
        this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 40, '© 2025 Azael Montejo Jr. | azaelmontejo.com | Licensed under CC BY-NC 4.0', {
            fontSize: '12px',
            fontFamily: 'Arial',
            color: '#666666',
            align: 'center'
        }).setOrigin(0.5);

        // Transition to end after delay
        this.time.delayedCall(10000, () => {
            if (this.jsPsych) {
                this.jsPsych.finishTrial();
            }
        });
    }

    shareStudy() {
        const shareData = {
            title: 'EXOBOUND: Tactical Fleet Command Research Study',
            text: 'Participate in this fascinating research study on decision-making in complex tactical environments!',
            url: window.location.href
        };

        if (navigator.share) {
            navigator.share(shareData).catch(console.error);
        } else {
            // Fallback - copy to clipboard
            navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`)
                .then(() => {
                    this.showShareMessage('Study link copied to clipboard!');
                })
                .catch(() => {
                    this.showShareMessage('Share URL: ' + shareData.url);
                });
        }
    }

    showShareMessage(message) {
        const shareMsg = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 200, message, {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#66ccff',
            align: 'center',
            backgroundColor: '#001122',
            padding: { x: 15, y: 8 }
        }).setOrigin(0.5);

        this.time.delayedCall(3000, () => shareMsg.destroy());
    }

    cleanupDOM() {
        // Clean up any DOM elements created
        if (this.textAreas) {
            this.textAreas.forEach(textArea => {
                if (textArea.parentNode) {
                    textArea.parentNode.removeChild(textArea);
                }
            });
            this.textAreas = [];
        }
    }

    destroy() {
        this.cleanupDOM();
        super.destroy();
    }
} 