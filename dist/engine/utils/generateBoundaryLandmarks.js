export const generateBoundaryLandmarks = (range, spacing) => {
    const positions = [];
    const extremes = [-range, range];
    const ax = ['x', 'y', 'z'];
    const seen = new Set();
    ax.forEach((axis, i) => {
        const others = ax.filter((_, idx) => idx !== i);
        extremes.forEach((a) => {
            extremes.forEach((b) => {
                for (let t = -range; t <= range; t += spacing) {
                    const pos = { [axis]: t, [others[0]]: a, [others[1]]: b };
                    const key = `${pos.x},${pos.y},${pos.z}`;
                    if (!seen.has(key)) {
                        seen.add(key);
                        positions.push(pos);
                    }
                }
            });
        });
    });
    return positions;
};
