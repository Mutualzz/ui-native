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

export const hsvaToDisplayHex = (hsva: HsvaColor): string =>
    formatColor(handleColor(hsva).hex) as string;

export const hueToHex = (hue: number): string =>
    formatColor(
        handleColor({
            h: hue,
            s: 100,
            v: 100,
            alpha: 1,
        }).hex,
    ) as string;
