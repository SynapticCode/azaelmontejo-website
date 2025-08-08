import { TitleScene } from './scenes/TitleScene.js';
import { GameScene } from './scenes/GameScene.js';
import { EndScene } from './scenes/EndScene.js';

// Define the game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [TitleScene, GameScene, EndScene]
};

// Create the game instance
window.MyGame = class Game extends Phaser.Game {
    constructor(config) {
        super(config);
    }
};

// Start the game when the page loads
window.addEventListener('load', () => {
    new window.MyGame(config);
});
