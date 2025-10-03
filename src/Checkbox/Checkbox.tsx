import styled from "@emotion/native";
import type { Size, SizeValue } from "@mutualzz/ui-core";
import { forwardRef, useContext, useRef, useState } from "react";
import { Pressable, View } from "react-native";
import { useTheme } from "useTheme";
import { CheckboxGroupContext } from "../CheckboxGroup/CheckboxGroup.context";
import { Typography } from "../Typography/Typography";
import {
    resolveCheckboxColor,
    resolveCheckboxSize,
    resolveCheckboxStyles,
    resolveIconScaling,
} from "./Checkbox.helpers";
import { type CheckboxProps } from "./Checkbox.types";

const CheckboxWrapper = styled(Pressable)<CheckboxProps>(
    ({ theme, disabled, size = "md" }) => ({
        position: "relative",
        display: "flex",
        alignItems: "center",
        userSelect: "none",
        ...(disabled && {
            opacity: 0.5,
            pointerEvents: "none",
        }),
        ...resolveCheckboxSize(theme, size),
    }),
);

CheckboxWrapper.displayName = "CheckboxWrapper";

const CheckboxBox = styled(View)<Omit<CheckboxProps, "value">>(
    ({
        theme,
        color = "neutral",
        variant = "solid",
        size = "md",
        checked,
    }) => ({
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        ...resolveCheckboxSize(theme, size),
        ...resolveCheckboxStyles(theme, color, checked)[variant],
    }),
);

const CheckboxLabel = styled(Typography)<{
    rtl?: boolean;
    disabled?: boolean;
    color: string;
}>(({ rtl, disabled, color }) => ({
    color,
    opacity: disabled ? 0.5 : 1,
    ...(rtl ? { marginRight: 8 } : { marginLeft: 8 }),
}));

CheckboxLabel.displayName = "CheckboxLabel";

const IconWrapper = styled(View)<{
    size?: Size | SizeValue | number;
}>(({ theme, size = "md" }) => ({
    justifyContent: "center",
    alignItems: "center",
    ...resolveIconScaling(theme, size),
}));

const CheckIcon = ({ color }: { color: string }) => (
    <View
        style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
        }}
    >
        <Typography
            style={{
                color,
                fontSize: 12,
                fontWeight: "bold",
                textAlign: "center",
            }}
        >
            ✓
        </Typography>
    </View>
);

const IndeterminateIcon = ({ color }: { color: string }) => (
    <View
        style={{
            width: "60%",
            height: 2,
            backgroundColor: color,
            borderRadius: 1,
        }}
    />
);

IconWrapper.displayName = "IconWrapper";

/**
 * Checkbox component that renders a styled checkbox input with label support.
 * It supports various properties such as checked state, disabled state, color, variant, size,
 * and custom icons for checked, unchecked, and indeterminate states.
 * The component can be controlled via props or managed internally.
 * It also supports RTL label alignment.
 */
const Checkbox = forwardRef<View, CheckboxProps>(
    (
        {
            checked: controlledChecked,
            onChange: propOnChange,
            defaultChecked,
            label,
            disabled: propDisabled,
            color: colorProp,
            variant: variantProp,
            size: sizeProp,
            value,
            uncheckedIcon,
            checkedIcon,
            indeterminate,
            indeterminateIcon,
            rtl,
            ...props
        }: CheckboxProps,
        ref,
    ) => {
        const { theme } = useTheme();

        const group = useContext(CheckboxGroupContext);
        const [uncontrolledChecked, setUncontrolledChecked] = useState(
            defaultChecked ?? false,
        );
        const inputRef = useRef<HTMLInputElement>(null);

        const isChecked =
            group && value
                ? Array.isArray(group.value) && group.value.includes(value)
                : controlledChecked !== undefined
                  ? controlledChecked
                  : uncontrolledChecked;

        const handlePress = () => {
            if (disabled) return;

            const newChecked = !isChecked;

            if (!group && controlledChecked === undefined) {
                setUncontrolledChecked(newChecked);
            }

            if (group?.onChange && value) {
                group.onChange(value);
            }

            propOnChange?.(newChecked);
        };

        const color = colorProp ?? group?.color ?? "neutral";
        const variant = variantProp ?? group?.variant ?? "solid";
        const size = sizeProp ?? group?.size ?? "md";
        const disabled = group?.disabled ?? propDisabled;

        const textColor = resolveCheckboxColor(theme, color)[variant];
        const iconColor = resolveCheckboxColor(theme, color)[variant];

        return (
            <CheckboxWrapper
                ref={ref}
                disabled={disabled}
                size={size}
                onPress={handlePress}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isChecked }}
                style={({ pressed }) => ({
                    opacity: pressed && !disabled ? 0.8 : disabled ? 0.5 : 1,
                })}
                {...props}
            >
                {rtl && label && (
                    <CheckboxLabel
                        disabled={disabled}
                        rtl={rtl}
                        color={textColor}
                    >
                        {label}
                    </CheckboxLabel>
                )}
                <CheckboxBox
                    color={color}
                    variant={variant}
                    checked={isChecked}
                    size={size}
                >
                    {indeterminate ? (
                        indeterminateIcon ? (
                            <IconWrapper size={size}>
                                {indeterminateIcon}
                            </IconWrapper>
                        ) : (
                            <IconWrapper size={size}>
                                <IndeterminateIcon color={iconColor} />
                            </IconWrapper>
                        )
                    ) : isChecked ? (
                        checkedIcon ? (
                            <IconWrapper size={size}>{checkedIcon}</IconWrapper>
                        ) : (
                            <IconWrapper size={size}>
                                <CheckIcon color={iconColor} />
                            </IconWrapper>
                        )
                    ) : uncheckedIcon ? (
                        <IconWrapper size={size}>{uncheckedIcon}</IconWrapper>
                    ) : null}
                </CheckboxBox>
                {!rtl && label && (
                    <CheckboxLabel
                        disabled={disabled}
                        rtl={rtl}
                        color={textColor}
                    >
                        {label}
                    </CheckboxLabel>
                )}
            </CheckboxWrapper>
        );
    },
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
