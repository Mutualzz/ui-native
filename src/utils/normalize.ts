import type { TypographyLevelObj } from "@mutualzz/ui-core";
import type { TextStyle } from "react-native";
import { fontScale } from "./scale";

export const normalizeTypography = (level: TypographyLevelObj) => {
    const rawFontSize = level.fontSize;
    const fontSize = fontScale(rawFontSize);

    const lineHeight =
        typeof level.lineHeight === "number" &&
        level.lineHeight > 0 &&
        level.lineHeight < 4
            ? Math.round(fontSize * level.lineHeight)
            : typeof level.lineHeight === "string"
              ? parseFloat(level.lineHeight)
              : level.lineHeight;

    const letterSpacing =
        typeof level.letterSpacing === "string"
            ? fontSize * parseFloat(level.letterSpacing)
            : level.letterSpacing;

    const fontWeight =
        level.fontWeight == null
            ? undefined
            : (String(level.fontWeight) as TextStyle["fontWeight"]);

    return {
        ...level,
        lineHeight,
        letterSpacing,
        fontWeight,
    };
};
