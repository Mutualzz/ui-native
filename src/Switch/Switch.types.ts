import type { PressableProps, ViewProps } from "react-native";
import type {
    Color,
    Responsive,
    Shape,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import type { ColorLike } from "color";
import type { ReactNode } from "react";

export interface SwitchProps extends Omit<PressableProps, "children"> {
    color?: Responsive<Color | ColorLike>;
    variant?: Responsive<Variant>;
    size?: Responsive<Size | SizeValue | number>;
    shape?: Responsive<Shape | SizeValue | number>;

    label?: ReactNode;
    checked?: boolean;
    defaultChecked?: boolean;
    disabled?: boolean;
    onChange?: (checked: boolean) => void;

    startDecorator?: ReactNode;
    endDecorator?: ReactNode;
}

export type SwitchTrackProps = ViewProps & {
    checked?: boolean;
    color?: Color | ColorLike;
    variant?: Variant;
    size?: Size | SizeValue | number;
};
