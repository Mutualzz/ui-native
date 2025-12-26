export const angleToSkia = (angle: number, width: number, height: number) => {
    const rad = (angle * Math.PI) / 180;
    const dx = Math.sin(rad);
    const dy = -Math.cos(rad);

    const cx = width / 2;
    const cy = height / 2;

    const s = Math.hypot(width, height) * 1.2;

    return {
        start: { x: cx - dx * s, y: cy - dy * s },
        end: { x: cx + dx * s, y: cy + dy * s },
    };
};
