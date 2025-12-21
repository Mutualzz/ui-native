import type { Theme } from "@emotion/react";
import type { Size, SizeValue } from "@mutualzz/ui-core";
import { resolveSize } from "@mutualzz/ui-core";
import type { DrawerAnchor } from "./Drawer.types";

const baseSizeMap: Record<Size, number> = {
    sm: 280,
    md: 360,
    lg: 400,
};

const swipeAreaMap: Record<Size, number> = {
    sm: 80,
    md: 120,
    lg: 160,
};

const swipeThresholdMap: Record<Size, number> = {
    sm: 32,
    md: 48,
    lg: 64,
};

export const resolveDrawerSize = (
    theme: Theme,
    anchor: DrawerAnchor,
    size: Size | SizeValue | number,
) => {
    const resolvedSize = resolveSize(theme, size, baseSizeMap);

    if (anchor === "top") return 320;
    return resolvedSize;
};

export const resolveSwipeArea = (
    theme: Theme,
    swipeArea: number | Size | SizeValue,
) => resolveSize(theme, swipeArea, swipeAreaMap);

export const resolveSwipeThreshold = (
    theme: Theme,
    threshold: number | Size | SizeValue,
) => resolveSize(theme, threshold, swipeThresholdMap);

export const getClosedTranslate = (
    anchor: DrawerAnchor,
    drawerSizePx: number,
) => {
    switch (anchor) {
        case "left":
            return { x: -drawerSizePx, y: 0 };
        case "right":
            return { x: drawerSizePx, y: 0 };
        case "top":
            return { x: 0, y: -drawerSizePx };
        case "bottom":
        default:
            return { x: 0, y: drawerSizePx };
    }
};
