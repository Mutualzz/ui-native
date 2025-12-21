import type { Theme } from "@emotion/react";
import { resolveSize, type Size, type SizeValue } from "@mutualzz/ui-core";

export const baseSizeMap: Record<Size, number> = {
    sm: 20,
    md: 24,
    lg: 32,
};

export const resolveRadioSize = (
    theme: Theme,
    size: Size | SizeValue | number,
) => {
    const resolvedSize = resolveSize(theme, size, baseSizeMap);
    return { fontSize: resolvedSize };
};

export {
    resolveIconScaling,
    resolveCheckboxStyles as resolveRadioStyles,
} from "../Checkbox/Checkbox.helpers";
