/**
 * 🧠 HOW TO DECIDE WHICH ENDING TO TRIGGER:
 */

export function getEnding(gameState) {
    const { stability, innovation, market_fit, visits, history } = gameState;

    const explores = history.filter(h => h.tag === 'explore').length;
    const exploits = history.filter(h => h.tag === 'exploit').length;

    const total = explores + exploits;
    const exploreRatio = explores / (total || 1);

    if (stability < 0 && innovation > 30) return 'chaotic_genius';
    if (stability > 40 && innovation < 10) return 'optimizer';
    if (exploreRatio > 0.75) return 'visionary';
    if (exploreRatio < 0.25 && stability < 10) return 'burnout';

    return 'balanced_mind';
}

/**
 * 🗃️ Sample Exportable Profile
 */

export function getFinalProfile(gameState) {
    return {
        title: getEnding(gameState),
        stability: gameState.stability,
        innovation: gameState.innovation,
        market_fit: gameState.market_fit,
        explore_vs_exploit_ratio: `${Math.round(
            (gameState.history.filter(h => h.tag === 'explore').length * 100) /
            (gameState.history.length || 1)
        )}% Explore`,
        decisions: gameState.history.map(h => ({ npc: h.npc, choice: h.id }))
    };
}
