import type {
    Color,
    ColorLike,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import type { ReactNode } from "react";
import type { ViewProps } from "react-native";

export interface SliderMark {
    value: number;
    label?: ReactNode;
}

export type SliderOrientation = "horizontal" | "vertical";
export type SliderValueLabelDisplay = "off" | "on" | "auto";

export interface SliderProps extends Omit<ViewProps, "onChange"> {
    color?: Color | ColorLike;
    size?: Size | SizeValue | number;
    variant?: Variant;

    disabled?: boolean;
    orientation?: SliderOrientation;

    min?: number;
    max?: number;
    step?: number | null;

    defaultValue?: number | number[];
    value?: number | number[];

    disableSwap?: boolean;

    marks?: boolean | SliderMark[];

    valueLabelDisplay?: SliderValueLabelDisplay;
    valueLabelFormat?: string | ((value: number, index: number) => ReactNode);

    onChange?: (value: number | number[]) => void;
    onChangeCommitted?: (value: number | number[]) => void;

    getAriaLabel?: (index: number) => string;
    getAriaValueText?: (value: number, index: number) => string;
}
