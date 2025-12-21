import styled from "@emotion/native";
import { resolveSize, type Size } from "@mutualzz/ui-core";
import React, { Children, forwardRef, useMemo, useState } from "react";
import { View, type ViewStyle } from "react-native";

import { useTheme } from "../useTheme";
import { RadioGroupContext } from "./RadioGroup.context";
import type { RadioGroupProps } from "./RadioGroup.types";

const baseSpacingMap: Record<Size, number> = {
    sm: 8,
    md: 16,
    lg: 24,
};

const RadioGroupWrapper = styled(View)<{
    orientation: "horizontal" | "vertical";
    disabled?: boolean;
}>(({ orientation, disabled }) => ({
    flexDirection: orientation === "horizontal" ? "row" : "column",
    flexWrap: "wrap",
    alignItems: "stretch",
    opacity: disabled ? 0.5 : 1,
}));

const SpacedChildren: React.FC<{
    children: React.ReactNode;
    orientation: "horizontal" | "vertical";
    gap: number;
}> = ({ children, orientation, gap }) => {
    const arr = Children.toArray(children);
    return (
        <>
            {arr.map((child, idx) => {
                const isLast = idx === arr.length - 1;
                const marginStyle: ViewStyle = isLast
                    ? {}
                    : orientation === "horizontal"
                      ? { marginRight: gap }
                      : { marginBottom: gap };

                return (
                    <View key={(child as any)?.key ?? idx} style={marginStyle}>
                        {child}
                    </View>
                );
            })}
        </>
    );
};

export const RadioGroup = forwardRef<View, RadioGroupProps>(
    (
        {
            name,
            color,
            size,
            variant,
            value: controlledValue,
            defaultValue,
            onChange,
            disabled,
            orientation = "vertical",
            spacing = "md",
            children,
            ...props
        },
        ref,
    ) => {
        const { theme } = useTheme();
        const [internalValue, setInternalValue] = useState(defaultValue ?? "");
        const isControlled = controlledValue !== undefined;
        const currentValue = isControlled ? controlledValue : internalValue;

        const gap = useMemo(() => {
            if (typeof spacing === "number") return spacing;
            try {
                return resolveSize(theme, spacing, baseSpacingMap);
            } catch {
                return baseSpacingMap.md;
            }
        }, [spacing]);

        const handleChange = (newValue: any) => {
            if (!isControlled) setInternalValue(newValue);
            onChange?.(newValue);
        };

        const normalizedOrientation =
            orientation === "horizontal" ? "horizontal" : "vertical";

        return (
            <RadioGroupContext.Provider
                value={{
                    color,
                    size,
                    variant,
                    name,
                    orientation: normalizedOrientation,
                    spacing,
                    value: currentValue,
                    onChange: handleChange,
                    disabled,
                }}
            >
                <RadioGroupWrapper
                    ref={ref}
                    orientation={normalizedOrientation}
                    disabled={disabled}
                    pointerEvents={disabled ? "none" : "auto"}
                    {...props}
                >
                    <SpacedChildren
                        orientation={normalizedOrientation}
                        gap={gap}
                    >
                        {children}
                    </SpacedChildren>
                </RadioGroupWrapper>
            </RadioGroupContext.Provider>
        );
    },
);

RadioGroup.displayName = "RadioGroup";
