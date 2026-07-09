import { PixelRatio } from "react-native";

/** System font scale above which we treat the user as using large text. */
export const LARGE_TEXT_THRESHOLD = 1.15;

/** Default cap for UI chrome (buttons, labels). Body copy can pass a higher value. */
export const MAX_FONT_SCALE_MULTIPLIER = 2.5;

export type TypographyTruncate = "none" | "single" | "double";

export const getFontScale = () => PixelRatio.getFontScale();

export const isLargeTextEnabled = (fontScale: number) =>
    fontScale > LARGE_TEXT_THRESHOLD;

export function resolveTruncateLines(
    truncate: TypographyTruncate | undefined,
    numberOfLines: number | undefined,
    fontScale: number,
): number | undefined {
    if (numberOfLines != null) return numberOfLines;
    if (truncate === "single") {
        return isLargeTextEnabled(fontScale) ? undefined : 1;
    }
    if (truncate === "double") {
        return isLargeTextEnabled(fontScale) ? undefined : 2;
    }
    return undefined;
}

/** Scale layout dimensions (padding, min-heights) with font scale, capped to avoid runaway growth. */
export function scaledLayoutSize(
    base: number,
    fontScale: number,
    cap = 2,
): number {
    return base * Math.min(fontScale, cap);
}

export function scaledMaxHeight(
    lines: number,
    lineHeight: number,
    fontScale: number,
): number {
    return lines * lineHeight * fontScale;
}
