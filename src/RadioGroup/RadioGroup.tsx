import styled from "@emotion/native";
import {
    resolveSize,
    type Orientation,
    type Size,
    type SizeValue,
} from "@mutualzz/ui-core";
import { forwardRef, useState } from "react";
import { View } from "react-native";
import { RadioGroupContext } from "./RadioGroup.context";
import type { RadioGroupProps } from "./RadioGroup.types";

const baseSpacingMap: Record<Size, number> = {
    sm: 4,
    md: 8,
    lg: 12,
};

const RadioGroupWrapper = styled(View)<{
    orientation?: Orientation;
    spacing?: Size | SizeValue | number;
    disabled?: boolean;
}>(({ theme, orientation, spacing = 8, disabled }) => ({
    display: "flex",
    flexDirection: orientation === "horizontal" ? "row" : "column",
    alignItems: "stretch",
    flexWrap: "wrap",
    ...(resolveSize(theme, spacing, baseSpacingMap) > 0 && {
        gap: spacing,
    }),
    ...(disabled && {
        opacity: 0.5,
    }),
}));

RadioGroupWrapper.displayName = "RadioGroupButtonWrapper";

/**
 * RadioGroup component for grouping radio buttons.
 * It allows for selecting one option from a set of radio buttons.
 * The component can be controlled or uncontrolled.
 * It supports different layouts (row or column) and can handle disabled states.
 * The `onChange` event handler is called when the selected radio button changes.
 * The `name` prop is used to group radio inputs, and the `value` prop
 * is used to set the selected value.
 * The `defaultValue` prop can be used to set the initial selected value.
 * The `children` prop allows for passing in radio button components.
 */
const RadioGroup = forwardRef<View, RadioGroupProps>(
    (
        {
            name,
            color,
            size,
            variant,
            value: controlledValue,
            orientation,
            defaultValue,
            onChange,
            disabled,
            spacing = 0,
            children,
        },
        ref,
    ) => {
        const [internalValue, setInternalValue] = useState(defaultValue ?? "");
        const isControlled = controlledValue !== undefined;
        const currentValue = isControlled ? controlledValue : internalValue;

        const handleChange = (newValue: string) => {
            if (!isControlled) setInternalValue(newValue);
            onChange?.(newValue);
        };

        return (
            <RadioGroupContext.Provider
                value={{
                    color,
                    size,
                    variant,
                    orientation,
                    value: currentValue,
                    onChange: handleChange,
                    disabled,
                }}
            >
                <RadioGroupWrapper
                    ref={ref}
                    spacing={spacing}
                    orientation={orientation}
                    disabled={disabled}
                >
                    {children}
                </RadioGroupWrapper>
            </RadioGroupContext.Provider>
        );
    },
);

RadioGroup.displayName = "RadioGroup";

export { RadioGroup };
