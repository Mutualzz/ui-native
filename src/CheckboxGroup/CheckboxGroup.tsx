import styled from "@emotion/native";
import type { Size } from "@mutualzz/ui-core";
import { resolveSize } from "@mutualzz/ui-core";
import { forwardRef, useCallback, useMemo, useState } from "react";
import type { View } from "react-native";
import { useTheme } from "../useTheme";
import { CheckboxGroupContext } from "./CheckboxGroup.context";
import type { CheckboxGroupProps } from "./CheckboxGroup.types";

const baseSpacingMap: Record<Size, number> = {
    sm: 8,
    md: 12,
    lg: 16,
};

const CheckboxGroupWrapper = styled.View({
    flexWrap: "wrap",
    alignItems: "stretch",
});

CheckboxGroupWrapper.displayName = "CheckboxGroupWrapper";

const CheckboxGroup = forwardRef<View, CheckboxGroupProps>(
    (
        {
            name,
            color,
            variant,
            size,
            orientation = "horizontal",
            value: controlledValue,
            defaultValue,
            onChange,
            disabled,
            spacing = 0,
            children,
            style,
            ...props
        },
        ref,
    ) => {
        const { theme } = useTheme();

        const [internalValue, setInternalValue] = useState<string[]>(
            defaultValue ?? [],
        );

        const isControlled = controlledValue !== undefined;
        const currentValue = isControlled ? controlledValue : internalValue;

        const resolvedSpacing = resolveSize(theme, spacing, baseSpacingMap);

        const handleChange = useCallback(
            (_event: unknown, newValue: string[]) => {
                if (!isControlled) setInternalValue(newValue);
                onChange?.(newValue);
            },
            [isControlled, onChange],
        );

        const ctx = useMemo(
            () => ({
                color,
                variant,
                size,
                orientation,
                disabled,
                name,
                value: currentValue,
                onChange: handleChange,
            }),
            [
                color,
                variant,
                size,
                orientation,
                disabled,
                name,
                currentValue,
                handleChange,
            ],
        );

        return (
            <CheckboxGroupContext.Provider value={ctx}>
                <CheckboxGroupWrapper
                    ref={ref}
                    {...props}
                    style={[
                        {
                            flexDirection:
                                orientation === "horizontal" ? "row" : "column",
                            ...(resolvedSpacing > 0
                                ? orientation === "horizontal"
                                    ? {
                                          columnGap: resolvedSpacing,
                                          rowGap: resolvedSpacing,
                                      }
                                    : { rowGap: resolvedSpacing }
                                : null),
                            ...(disabled ? { opacity: 0.5 } : null),
                        },
                        style,
                    ]}
                >
                    {children}
                </CheckboxGroupWrapper>
            </CheckboxGroupContext.Provider>
        );
    },
);

CheckboxGroup.displayName = "CheckboxGroup";

export { CheckboxGroup };
