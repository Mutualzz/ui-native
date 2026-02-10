import type { Theme } from "@emotion/react";
import type { Color, ColorLike, Variant } from "@mutualzz/ui-core";
import { formatColor, resolveColor } from "@mutualzz/ui-core";

export const resolvePasswordIconStyles = (
    theme: Theme,
    color: Color | ColorLike,
): Record<Variant, string> => {
    const resolvedColor = resolveColor(color, theme);

    const hexColor = formatColor(resolvedColor);

    return {
        outlined: hexColor,
        solid: formatColor(resolvedColor, { lighten: 100 }),
        plain: hexColor,
        soft: formatColor(resolvedColor, { lighten: 25 }),
    };
};
