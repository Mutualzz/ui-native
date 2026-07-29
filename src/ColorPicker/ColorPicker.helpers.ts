import {
    buildPickerGradientStops,
    clamp,
    constructLinearGradient,
    formatColor,
    handleColor,
    randomColor,
    type ColorLike,
    type HsvaColor,
} from "@mutualzz/ui-core";
import type { GradientStop } from "./ColorPicker.types";

export const COLOR_PICKER_WIDTH = 240;

const MIN_STOP_GAP_PERCENT = 1;

export const newStopId = () =>
    `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const createPickerGradientStops = (
    color?: Parameters<typeof buildPickerGradientStops>[0],
    existingIds: string[] = [],
): { angle: number; stops: GradientStop[] } => {
    const { angle, stops, positions } = buildPickerGradientStops(color);

    return {
        angle,
        stops: stops.map((stop, index) => ({
            ...stop,
            id: existingIds[index] ?? newStopId(),
            position: positions[index] ?? 0,
        })),
    };
};

export const gradientStopsToLinearGradient = (
    rotation: number,
    stops: GradientStop[],
) =>
    constructLinearGradient(
        rotation,
        stops.map(({ position, id, ...stop }) => ({
            color: handleColor(stop).hex,
            position,
        })),
    );

export const toHsva = (color?: ColorLike | HsvaColor): HsvaColor => {
    if (!color) return handleColor(randomColor("hex")).hsva;

    if (typeof color !== "string") return color;

    return handleColor(color).hsva;
};

export const hsvaToColorLike = (hsva: HsvaColor): ColorLike =>
    formatColor(handleColor(hsva).hex, {
        format: hsva.alpha < 1 ? "hexa" : "hex",
    });

export const hsvaToHslaString = (hsva: HsvaColor): string =>
    formatColor(handleColor(hsva).hex, {
        format: "hsla",
        alpha: hsva.alpha,
    });

export const hsvaToDisplayHex = (hsva: HsvaColor): string =>
    formatColor(handleColor(hsva).hex);

export const hueToHex = (hue: number): string =>
    formatColor(
        handleColor({
            h: hue,
            s: 100,
            v: 100,
            alpha: 1,
        }).hex,
    );

export const sortStops = (arr: GradientStop[]) =>
    [...arr].sort(
        (a, b) => a.position - b.position || a.id.localeCompare(b.id),
    );

export const sortStopsStable = (stops: GradientStop[]): GradientStop[] =>
    stops
        .map((s, idx) => ({ s, idx }))
        .sort(
            (a, b) =>
                (a.s.position ?? 0) - (b.s.position ?? 0) || a.idx - b.idx,
        )
        .map(({ s }) => s);

export const enforceMinGap = (
    stops: GradientStop[],
    activeId: string,
    desiredPos: number,
): number => {
    const sorted = sortStopsStable(stops);
    const i = sorted.findIndex((s) => s.id === activeId);
    if (i === -1) return desiredPos;

    const left = sorted[i - 1];
    const right = sorted[i + 1];

    const min = left ? left.position + MIN_STOP_GAP_PERCENT : 0;
    const max = right ? right.position - MIN_STOP_GAP_PERCENT : 100;

    return clamp(desiredPos, min, max);
};
