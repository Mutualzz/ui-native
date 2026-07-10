import type { ColorLike, ColorResult, HsvaColor } from "@mutualzz/ui-core";

export type GradientStop = HsvaColor & { position: number; id: string };

export interface ColorPickerProps {
    color?: ColorLike | HsvaColor | (ColorLike | HsvaColor)[];
    onChange?: (color: ColorResult | ColorResult[] | ColorLike, stop?: number) => void;
    currentStop?: number;
    onStopChange?: (stop: number) => void;
    rotation?: number;
    onRotationChange?: (rotation: number) => void;
    allowGradient?: boolean;
    allowAlpha?: boolean;
}
