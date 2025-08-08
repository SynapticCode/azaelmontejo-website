// Component for creating the tactical view background
function TacticalBackground(scene) {
    this.scene = scene;
}

TacticalBackground.prototype.create = function() {
    // Add a dark background with grid lines
    this.scene.add.rectangle(0, 0, this.scene.cameras.main.width, this.scene.cameras.main.height, 0x000022)
        .setOrigin(0, 0);
    
    // Add grid lines
    const gridColor = 0x0066aa;
    const gridAlpha = 0.3;
    const gridSpacing = 50;
    
    for (let x = 0; x < this.scene.cameras.main.width; x += gridSpacing) {
        this.scene.add.line(0, 0, x, 0, x, this.scene.cameras.main.height, gridColor)
            .setOrigin(0, 0)
            .setAlpha(gridAlpha);
    }
    
    for (let y = 0; y < this.scene.cameras.main.height; y += gridSpacing) {
        this.scene.add.line(0, 0, 0, y, this.scene.cameras.main.width, y, gridColor)
            .setOrigin(0, 0)
            .setAlpha(gridAlpha);
    }
    
    // Add title
    this.scene.add.text(this.scene.cameras.main.width / 2, 30, 'TACTICAL DISPLAY', {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#00ffff'
    }).setOrigin(0.5, 0);
}
