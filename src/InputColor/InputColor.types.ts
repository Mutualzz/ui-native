import type { ColorLike, ColorResult } from "@mutualzz/ui-core";
import type { InputRootProps } from "../InputRoot/InputRoot.types";

export interface InputColorProps
    extends Omit<
        InputRootProps,
        "onChange" | "type" | "value" | "defaultValue"
    > {
    type?: "color";
    showColorPicker?: boolean;
    showRandom?: boolean;
    allowGradient?: boolean;
    allowAlpha?: boolean;
    value?: ColorLike;
    defaultValue?: ColorLike;
    onChangeResult?: (color: ColorResult) => void;
    onChange?: (color: ColorLike) => void;
}
