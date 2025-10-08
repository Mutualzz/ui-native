import { serializeColorValue } from "@mutualzz/ui-core";
import gradientParser from "gradient-parser";

export const extractColors = (css: string): string[] | null => {
    if (!css) return null;
    const ast = gradientParser.parse(css)[0];
    if (!ast || !ast.colorStops) return null;

    const colors: string[] = [];
    for (const stop of ast.colorStops) {
        if (stop.type === "literal" || stop.type === "var") continue;
        colors.push(serializeColorValue(stop));
    }

    console.log(colors);

    return colors.length > 0 ? colors : null;
};
