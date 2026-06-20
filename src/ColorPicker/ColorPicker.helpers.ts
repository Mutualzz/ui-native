import {
    formatColor,
    handleColor,
    randomColor,
    type ColorLike,
    type HsvaColor,
} from "@mutualzz/ui-core";

export const toHsva = (color?: ColorLike | HsvaColor): HsvaColor => {
    if (!color) return handleColor(randomColor("hex")).hsva;

    if (typeof color !== "string") return color;

    return handleColor(color).hsva;
};

export const hsvaToColorLike = (hsva: HsvaColor): ColorLike =>
    formatColor(handleColor(hsva).hex, {
        format: hsva.alpha < 1 ? "hexa" : "hex",
    }) as ColorLike;

export const hsvaToHslaString = (hsva: HsvaColor): string =>
    formatColor(handleColor(hsva).hex, {
        format: "hsla",
        alpha: hsva.alpha,
    }) as string;
