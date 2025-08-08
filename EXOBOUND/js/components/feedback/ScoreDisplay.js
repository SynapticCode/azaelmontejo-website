// Component for displaying scores in the feedback scene
function ScoreDisplay(scene) {
    this.scene = scene;
    this.scoreContainer = scene.add.container(0, 0);
    this.scoreContainer.setDepth(5);
    
    // Initialize with default styles
    this.styles = {
        title: {
            font: 'bold 24px Arial',
            fill: '#ffffff',
            align: 'center'
        },
        score: {
            font: 'bold 36px Arial',
            fill: '#ffff00',
            align: 'center'
        },
        description: {
            font: '18px Arial',
            fill: '#cccccc',
            align: 'center'
        }
    };
    
    console.log('ScoreDisplay initialized');
}

ScoreDisplay.prototype.showScores = function(trialResult) {
    try {
        // Clear any existing score elements
        this.scoreContainer.removeAll(true);
        const centerX = this.scene.cameras.main.width / 2;
        const centerY = this.scene.cameras.main.height / 2;

        // Title
        const title = this.scene.add.text(
            centerX,
            centerY - 150,
            'MISSION RESULTS',
            this.styles.title
        ).setOrigin(0.5);

        // Adaptation Loss
        const adaptationTitle = this.scene.add.text(
            centerX - 200,
            centerY - 80,
            'ADAPTATION LOSS',
            this.styles.title
        ).setOrigin(0.5);
        const adaptationScore = this.scene.add.text(
            centerX - 200,
            centerY - 40,
            trialResult.adaptationLoss.toFixed(2),
            this.styles.score
        ).setOrigin(0.5);
        const adaptationDesc = this.scene.add.text(
            centerX - 200,
            centerY,
            'Distance from ideal allocation',
            this.styles.description
        ).setOrigin(0.5);

        // Coordination Loss
        const coordinationTitle = this.scene.add.text(
            centerX,
            centerY - 80,
            'COORDINATION LOSS',
            this.styles.title
        ).setOrigin(0.5);
        const coordinationScore = this.scene.add.text(
            centerX,
            centerY - 40,
            trialResult.coordinationLoss.toFixed(2),
            this.styles.score
        ).setOrigin(0.5);
        const coordinationDesc = this.scene.add.text(
            centerX,
            centerY,
            'Distance from standard allocation',
            this.styles.description
        ).setOrigin(0.5);

        // Bonus
        const bonusTitle = this.scene.add.text(
            centerX + 200,
            centerY - 80,
            'BONUS',
            this.styles.title
        ).setOrigin(0.5);
        const bonusScore = this.scene.add.text(
            centerX + 200,
            centerY - 40,
            trialResult.bonus,
            this.styles.score
        ).setOrigin(0.5);
        const bonusDesc = this.scene.add.text(
            centerX + 200,
            centerY,
            'Bonus for this round',
            this.styles.description
        ).setOrigin(0.5);

        // Add all elements to the container
        this.scoreContainer.add([
            title,
            adaptationTitle, adaptationScore, adaptationDesc,
            coordinationTitle, coordinationScore, coordinationDesc,
            bonusTitle, bonusScore, bonusDesc
        ]);

        // Add animations
        this.animateScores();

        console.log('Scores displayed:', trialResult);
    } catch (error) {
        console.error('Error showing scores:', error);
        this.showFallbackScores(trialResult);
    }
}

ScoreDisplay.prototype.animateScores = function() {
    try {
        // Get all text objects in the container
        const elements = this.scoreContainer.getAll();
        
        // Set initial state
        elements.forEach(element => {
            element.setAlpha(0);
            element.y -= 20;
        });
        
        // Animate each element with a slight delay between them
        elements.forEach((element, index) => {
            this.scene.tweens.add({
                targets: element,
                alpha: 1,
                y: element.y + 20,
                ease: 'Power2',
                duration: 500,
                delay: index * 100
            });
        });
    } catch (error) {
        console.error('Error animating scores:', error);
        // Make all elements visible without animation as fallback
        this.scoreContainer.getAll().forEach(element => {
            element.setAlpha(1);
        });
    }
}

ScoreDisplay.prototype.showFallbackScores = function(trialResult) {
    // Simple fallback display without fancy formatting
    this.scoreContainer.removeAll(true);
    const centerX = this.scene.cameras.main.width / 2;
    const centerY = this.scene.cameras.main.height / 2;
    const scoreText = this.scene.add.text(
        centerX,
        centerY - 50,
        `MISSION RESULTS\n\nAdaptation Loss: ${trialResult.adaptationLoss.toFixed(2)}\nCoordination Loss: ${trialResult.coordinationLoss.toFixed(2)}\nBonus: ${trialResult.bonus}`,
        {
            font: '20px Arial',
            fill: '#ffffff',
            align: 'center'
        }
    ).setOrigin(0.5);
    this.scoreContainer.add(scoreText);
}

ScoreDisplay.prototype.hide = function() {
    // Hide the score container
    this.scoreContainer.setVisible(false);
}

ScoreDisplay.prototype.show = function() {
    // Show the score container
    this.scoreContainer.setVisible(true);
}
