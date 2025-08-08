// === Visionary Ending ===

export function renderVisionaryEnding(scene, gameState) {
    scene.add.text(400, 100, 'The Visionary', {
        fontSize: '48px',
        color: '#00f5ff'
    }).setOrigin(0.5);

    scene.add.text(400, 250, `You chased uncharted territory. You didn't fear failure—you turned it into fuel.`, {
        fontSize: '24px',
        color: '#ffffff',
        wordWrap: { width: 700 }
    }).setOrigin(0.5);

    scene.add.text(400, 400, `Final Innovation: ${gameState.innovation}
Explore Ratio: ${(gameState.history.filter(h => h.tag === 'explore').length * 100 / gameState.history.length).toFixed(1)}%`, {
        fontSize: '20px',
        color: '#cccccc',
        align: 'center'
    }).setOrigin(0.5);

    scene.add.text(400, 500, '"You saw not what is, but what could be." — CEO', {
        fontSize: '20px',
        fontStyle: 'italic',
        color: '#99ffff'
    }).setOrigin(0.5);
}
