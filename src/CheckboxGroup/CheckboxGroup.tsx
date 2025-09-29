import styled from "@emotion/native";
import {
    resolveSize,
    type Orientation,
    type Size,
    type SizeValue,
} from "@mutualzz/ui-core";
import { forwardRef, useState } from "react";
import { View } from "react-native";
import { CheckboxGroupContext } from "./CheckboxGroup.context";
import type { CheckboxGroupProps } from "./CheckboxGroup.types";

const baseSpacingMap: Record<Size, number> = {
    sm: 4,
    md: 8,
    lg: 12,
};

const CheckboxGroupWrapper = styled(View)<{
    orientation?: Orientation;
    spacing?: Size | SizeValue | number;
    disabled?: boolean;
}>(({ theme, orientation, spacing = 8, disabled }) => ({
    display: "flex",
    flexWrap: "wrap",
    alignItems: "stretch",
    flexDirection: orientation === "horizontal" ? "row" : "column",
    ...(resolveSize(theme, spacing, baseSpacingMap) > 0 && {
        gap: spacing,
    }),
    ...(disabled && {
        opacity: 0.5,
    }),
}));

CheckboxGroupWrapper.displayName = "CheckboxGroupWrapper";

/**
 * CheckboxGroup component that renders a group of checkboxes.
 * It allows for controlled or uncontrolled state management of the checkboxes.
 * The component supports a `name` prop for grouping checkboxes, a `value` prop for controlled state,
 * a `defaultValue` for uncontrolled state, and an `onChange` callback for handling changes.
 * It also supports disabling all checkboxes in the group and arranging them in a row or column layout.
 * The `children` prop should contain Checkbox components or valid React elements
 */
const CheckboxGroup = forwardRef<View, CheckboxGroupProps>(
    (
        {
            name,
            color,
            variant,
            size,
            orientation,
            value: controlledValue,
            defaultValue,
            onChange,
            disabled,
            spacing = 0,
            children,
        },
        ref,
    ) => {
        const [internalValue, setInternalValue] = useState(defaultValue ?? []);
        const isControlled = controlledValue !== undefined;
        const currentValue = isControlled ? controlledValue : internalValue;

        const handleChange = (val: string, checked: boolean) => {
            const newValue = checked
                ? Array.from(new Set([...currentValue, val]))
                : currentValue.filter((v) => v !== val);

            if (!isControlled) setInternalValue(newValue);
            onChange?.(newValue);
        };

        return (
            <CheckboxGroupContext.Provider
                value={{
                    color,
                    variant,
                    size,
                    orientation,
                    disabled,
                    value: currentValue,
                    onChange: (value) => {
                        const isChecked = currentValue.includes(value);
                        handleChange(value, !isChecked);
                    },
                }}
            >
                <CheckboxGroupWrapper
                    ref={ref}
                    orientation={orientation}
                    spacing={spacing}
                    disabled={disabled}
                >
                    {children}
                </CheckboxGroupWrapper>
            </CheckboxGroupContext.Provider>
        );
    },
);

CheckboxGroup.displayName = "CheckboxGroup";

export { CheckboxGroup };
