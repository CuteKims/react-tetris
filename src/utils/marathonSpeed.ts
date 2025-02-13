export const marathonSpeedFormula = (level: number) => {
    return Math.min(1 / (0.8 - (level - 1) * 0.007) ** (level - 1) / 60, 20)
}