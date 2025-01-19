/**
 * Spawn a power-up.
 */

export function powerUpSpawn(maze) {
    //Get size of maze. The maze will always be a square.
    const dim = length(maze);
    const powerUpX = Math.random() * dim;
    const powerUpY = Math.random() * dim;
}