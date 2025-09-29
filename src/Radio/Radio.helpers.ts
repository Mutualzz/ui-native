import type { Theme } from "@emotion/react";
import { resolveSize, type Size, type SizeValue } from "@mutualzz/ui-core";

export const baseSizeMap: Record<Size, number> = {
    sm: 12,
    md: 16,
    lg: 20,
};

export const resolveRadioSize = (
    theme: Theme,
    size: Size | SizeValue | number,
) => {
    const resolvedSize = resolveSize(theme, size, baseSizeMap);

    return {
        width: resolvedSize,
        height: resolvedSize,
    };
};

export {
    resolveIconScaling,
    resolveCheckboxColor as resolveRadioColor,
    resolveCheckboxStyles as resolveRadioStyles,
} from "../Checkbox/Checkbox.helpers";
