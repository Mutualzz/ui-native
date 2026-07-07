import type { Theme } from "@emotion/react";
import {
    aliasMaps,
    spacingAliasMap,
    type Breakpoint,
    type Responsive,
} from "@mutualzz/ui-core";
import type { ViewStyle } from "react-native";
import { resolveResponsiveValue } from "./responsive";

const spacingKeys = new Set(Object.keys(spacingAliasMap));
const positionKeys = new Set(["top", "right", "bottom", "left"]);
const systemKeys = new Set(Object.keys(aliasMaps));

const REM_TO_PX = 16;

const toNativeSpacingValue = (value: unknown): unknown => {
    if (typeof value !== "string") return value;

    const remMatch = /^(-?\d*\.?\d+)rem$/.exec(value.trim());
    if (remMatch) return parseFloat(remMatch[1]) * REM_TO_PX;

    const pxMatch = /^(-?\d*\.?\d+)px$/.exec(value.trim());
    if (pxMatch) return parseFloat(pxMatch[1]);

    const asNumber = parseFloat(value);
    return Number.isNaN(asNumber) ? value : asNumber;
};

const normalizeDisplay = (value: unknown): ViewStyle["display"] | undefined => {
    if (value === "none") return "none";
    if (value === "flex" || value === "inline-flex") return "flex";
    return undefined;
};

const normalizeOverflow = (
    value: unknown,
): ViewStyle["overflow"] | undefined => {
    if (value === "hidden" || value === "visible" || value === "scroll") {
        return value;
    }
    return undefined;
};

const assignStyle = (
    output: ViewStyle,
    prop: keyof ViewStyle,
    value: unknown,
) => {
    if (value == null) return;
    (output as Record<string, unknown>)[prop] = value;
};

export const aliasToNativeStyles = (
    props: Record<string, unknown>,
    theme: Theme,
    width: number,
): ViewStyle => {
    const output: ViewStyle = {};

    const resolveValue = (key: string, raw: unknown) => {
        if (raw == null) return raw;

        if (spacingKeys.has(key) && typeof raw === "number") {
            return toNativeSpacingValue(theme.spacing(raw));
        }

        if (positionKeys.has(key) && typeof raw === "number") {
            return toNativeSpacingValue(theme.spacing(raw));
        }

        if (key === "boxShadow" && typeof raw === "number") {
            return theme.shadows[raw] ?? raw;
        }

        if (key === "zIndex" && typeof raw === "string") {
            return theme.zIndex[raw as keyof typeof theme.zIndex] ?? raw;
        }

        return raw;
    };

    for (const key in props) {
        const raw = props[key];
        if (raw == null) continue;

        const resolvedRaw = resolveResponsiveValue(
            theme,
            raw as Responsive<unknown>,
            width,
        );
        const resolved = resolveValue(key, resolvedRaw);
        const mapEntry = aliasMaps[key as keyof typeof aliasMaps];
        const cssProps = Array.isArray(mapEntry) ? [...mapEntry] : [key];

        for (const cssProp of cssProps) {
            if (cssProp === "display") {
                const display = normalizeDisplay(resolved);
                if (display) assignStyle(output, "display", display);
                continue;
            }

            if (
                cssProp === "overflow" ||
                cssProp === "overflowX" ||
                cssProp === "overflowY"
            ) {
                const overflow = normalizeOverflow(resolved);
                if (overflow) assignStyle(output, "overflow", overflow);
                continue;
            }

            if (
                cssProp === "whiteSpace" ||
                cssProp === "visibility" ||
                cssProp === "textOverflow" ||
                cssProp === "boxSizing"
            ) {
                continue;
            }

            assignStyle(output, cssProp as keyof ViewStyle, resolved);
        }
    }

    return output;
};

export const splitSystemProps = <T extends Record<string, unknown>>(
    props: T,
) => {
    const systemProps: Record<string, unknown> = {};
    const restProps: Record<string, unknown> = {};

    for (const key in props) {
        if (systemKeys.has(key) || key === "inline") {
            systemProps[key] = props[key];
        } else {
            restProps[key] = props[key];
        }
    }

    return {
        systemProps,
        restProps: restProps as Omit<T, keyof typeof systemProps>,
    };
};

export type { Breakpoint };
