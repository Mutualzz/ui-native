import type { Theme } from "@emotion/react";
import type { Size, SizeValue } from "@mutualzz/ui-core";
import { resolveSize } from "@mutualzz/ui-core";

const baseSizeMap: Record<Size, number> = { sm: 16, md: 18, lg: 20 };

export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export type PopoverPlacement = "top" | "bottom" | "left" | "right";

export const getBestPlacement = (
    triggerRect: Rect,
    popoverRect: Rect,
    viewportWidth: number,
    viewportHeight: number,
    offset = 10,
): PopoverPlacement => {
    const space = {
        bottom: viewportHeight - (triggerRect.y + triggerRect.height),
        top: triggerRect.y,
        right: viewportWidth - (triggerRect.x + triggerRect.width),
        left: triggerRect.x,
    };

    if (space.bottom >= popoverRect.height + offset) return "bottom";
    if (space.top >= popoverRect.height + offset) return "top";
    if (space.right >= popoverRect.width + offset) return "right";
    if (space.left >= popoverRect.width + offset) return "left";
    return "bottom";
};

export const getPopoverPosition = (
    placement: PopoverPlacement,
    triggerRect: Rect,
    popoverRect: Rect,
    offset = 10,
) => {
    switch (placement) {
        case "bottom":
            return {
                top: triggerRect.y + triggerRect.height + offset,
                left:
                    triggerRect.x + (triggerRect.width - popoverRect.width) / 2,
            };
        case "top":
            return {
                top: triggerRect.y - popoverRect.height - offset,
                left:
                    triggerRect.x + (triggerRect.width - popoverRect.width) / 2,
            };
        case "right":
            return {
                top:
                    triggerRect.y +
                    (triggerRect.height - popoverRect.height) / 2,
                left: triggerRect.x + triggerRect.width + offset,
            };
        case "left":
            return {
                top:
                    triggerRect.y +
                    (triggerRect.height - popoverRect.height) / 2,
                left: triggerRect.x - popoverRect.width - offset,
            };
        default:
            return { top: 0, left: 0 };
    }
};

export const resolvePopoverSize = (
    theme: Theme,
    size: Size | SizeValue | number,
) => {
    const resolvedSize = resolveSize(theme, size, baseSizeMap);
    return { fontSize: resolvedSize };
};

export { resolvePaperStyles as resolvePopoverStyles } from "../Paper/Paper.helpers";
