import type { ColorLike, HsvaColor } from "@mutualzz/ui-core";

export interface ColorPickerProps {
    color?: ColorLike | HsvaColor;
    allowGradient?: boolean;
    allowAlpha?: boolean;
    onChange?: (color: ColorLike) => void;
}
