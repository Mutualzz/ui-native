import type { Theme } from "@emotion/react";
import {
    CONTROL_SIZE_MAP,
    resolveSize,
    type Size,
    type SizeValue,
} from "@mutualzz/ui-core";

export const baseSizeMap = CONTROL_SIZE_MAP;

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
