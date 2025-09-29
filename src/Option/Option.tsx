import styled from "@emotion/native";
import { forwardRef, useContext, useMemo } from "react";
import { Pressable, View } from "react-native";
import { SelectContext } from "Select/Select.context";
import { Typography } from "../Typography/Typography";
import { resolveOptionSize, resolveOptionStyles } from "./Option.helpers";
import type { OptionProps } from "./Option.types";

const OptionRoot = styled(View)<
    Omit<OptionProps, "value"> & { pressed: boolean }
>(
    ({
        theme,
        size = "md",
        variant = "outlined",
        color = "neutral",
        selected,
        disabled,
        pressed,
    }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        ...resolveOptionStyles(theme, color, !!selected)[variant].container,
        ...resolveOptionSize(theme, size).container,
        opacity: disabled ? 0.5 : pressed ? 0.7 : 1,
    }),
);

const OptionText = styled(Typography)<Omit<OptionProps, "value">>(
    ({ theme, size = "md", variant = "outlined", color = "neutral" }) => ({
        flexShrink: 1,
        ...resolveOptionStyles(theme, color, false)[variant].text,
        ...resolveOptionSize(theme, size).text,
    }),
);

const Bullet = styled(View)<{
    selected?: boolean;
}>(({ selected }) => ({
    width: 8,
    height: 8,
    borderRadius: 9999,
    opacity: selected ? 1 : 0.2,
    backgroundColor: "#000",
}));

const Option = forwardRef<View, OptionProps>(
    (
        {
            value,
            disabled: disabledProp,
            color: colorProp,
            variant: variantProp,
            size: sizeProp,
            label,
            children,
            onPress,
            android_ripple,
            ...props
        },
        ref,
    ) => {
        const parent = useContext(SelectContext);

        const color = colorProp ?? parent?.color ?? "neutral";
        const variant = variantProp ?? parent?.variant ?? "outlined";
        const size = sizeProp ?? parent?.size ?? "md";
        const disabled = disabledProp ?? parent?.disabled ?? false;

        const isSelected = useMemo(() => {
            return parent?.multiple
                ? Array.isArray(parent.value) && parent.value.includes(value)
                : parent?.value === value;
        }, [parent?.multiple, parent?.value, value]);

        return (
            <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled, selected: isSelected }}
                disabled={disabled}
                android_ripple={android_ripple ?? { borderless: false }}
                onPress={(e) => {
                    if (disabled) return;
                    parent?.onSelect(value);
                    onPress?.(e);
                }}
                {...props}
            >
                {({ pressed }) => (
                    <OptionRoot
                        size={size}
                        variant={variant}
                        color={color}
                        selected={isSelected}
                        disabled={disabled}
                        pressed={pressed}
                    >
                        <Bullet selected={isSelected} />
                        <OptionText size={size} variant={variant} color={color}>
                            {children ?? label ?? String(value)}
                        </OptionText>
                    </OptionRoot>
                )}
            </Pressable>
        );
    },
);

Option.displayName = "Option";

export { Option };
