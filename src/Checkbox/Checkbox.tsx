import styled from "@emotion/native";
import { forwardRef, useContext, useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import Svg, { Line, Polyline } from "react-native-svg";
import { CheckboxGroupContext } from "../CheckboxGroup/CheckboxGroup.context";
import { useTheme } from "../useTheme";
import {
    resolveCheckboxSize,
    resolveCheckboxStyles,
    resolveIconScaling,
} from "./Checkbox.helpers";
import type { CheckboxProps } from "./Checkbox.types";

const Wrapper = styled.View({
    flexDirection: "row",
    alignItems: "center",
});

const Box = styled.View({
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
});

const IconSlot = styled.View({
    alignItems: "center",
    justifyContent: "center",
});

const Label = styled.Text({});

const Checkbox = forwardRef<View, CheckboxProps>(
    (
        {
            checked: controlledChecked,
            defaultChecked,
            onChange,
            label,
            disabled: propDisabled,
            color: colorProp,
            variant: variantProp,
            size: sizeProp,
            name: propName,
            value,
            uncheckedIcon,
            checkedIcon,
            indeterminate,
            indeterminateIcon,
            rtl,
            style,
            ...props
        },
        ref,
    ) => {
        const { theme } = useTheme();
        const group = useContext(CheckboxGroupContext);

        const [uncontrolledChecked, setUncontrolledChecked] = useState(
            defaultChecked ?? false,
        );

        const color = colorProp ?? group?.color ?? "neutral";
        const variant = variantProp ?? group?.variant ?? "solid";
        const size = sizeProp ?? group?.size ?? "md";
        const name = group?.name ?? propName;
        const disabled = Boolean(group?.disabled ?? propDisabled);

        const isChecked =
            group && value !== undefined
                ? Array.isArray(group.value) && group.value.includes(value)
                : controlledChecked !== undefined
                  ? controlledChecked
                  : uncontrolledChecked;

        const { fontSize } = resolveCheckboxSize(theme, size);

        const iconSize = resolveIconScaling(theme, size);

        const baseStyles = useMemo(
            () => resolveCheckboxStyles(theme, color, isChecked)[variant],
            [theme, color, isChecked, variant],
        );

        const activeStyles = useMemo(
            () => resolveCheckboxStyles(theme, color, true)[variant],
            [theme, color, variant],
        );

        const toggle = (next: boolean) => {
            if (!group && controlledChecked === undefined) {
                setUncontrolledChecked(next);
            }

            if (group?.onChange && value !== undefined) {
                const currentValues = group.value || [];
                const newValues = next
                    ? [...currentValues, value]
                    : currentValues.filter((v) => v !== value);

                group.onChange(undefined, newValues);
            }

            onChange?.(next);
        };

        const renderDefaultIcon = (kind: "checked" | "indeterminate") => {
            const stroke = baseStyles.iconColor;

            if (kind === "indeterminate") {
                return (
                    <Svg
                        width={iconSize.width}
                        height={iconSize.height}
                        viewBox="0 0 24 24"
                    >
                        <Line
                            x1="6"
                            y1="12"
                            x2="18"
                            y2="12"
                            stroke={stroke}
                            strokeWidth={3}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </Svg>
                );
            }

            return (
                <Svg
                    width={iconSize.width}
                    height={iconSize.height}
                    viewBox="0 0 24 24"
                >
                    <Polyline
                        points="4 12 10 18 20 6"
                        fill="none"
                        stroke={stroke}
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </Svg>
            );
        };

        const labelNode = label ? (
            <Label
                style={[{ marginLeft: rtl ? 0 : 8, marginRight: rtl ? 8 : 0 }]}
            >
                {label}
            </Label>
        ) : null;

        return (
            <Pressable
                {...props}
                ref={ref}
                accessibilityRole="checkbox"
                accessibilityState={{
                    disabled,
                    checked: indeterminate ? "mixed" : Boolean(isChecked),
                }}
                disabled={disabled}
                onPress={() => toggle(!isChecked)}
                style={({ pressed }) => {
                    const visual = pressed ? activeStyles : baseStyles;

                    const focusRing = !disabled
                        ? {
                              shadowColor:
                                  activeStyles.box.backgroundColor ?? "#000",
                              shadowOpacity: 0.35,
                              shadowRadius: 6,
                              shadowOffset: { width: 0, height: 0 },
                              elevation: 2,
                          }
                        : {};

                    const resolvedStyle =
                        typeof style === "function"
                            ? style({ pressed })
                            : style;

                    return [
                        { opacity: disabled ? 0.5 : 1 },
                        visual.box ?? {},
                        focusRing,
                        resolvedStyle,
                    ];
                }}
            >
                <Wrapper>
                    {rtl ? labelNode : null}
                    <Box
                        style={[
                            {
                                width: fontSize,
                                height: fontSize,
                            },
                            baseStyles.box,
                        ]}
                    >
                        <IconSlot
                            style={{
                                width: iconSize.width,
                                height: iconSize.height,
                            }}
                        >
                            {indeterminate
                                ? indeterminateIcon
                                    ? indeterminateIcon
                                    : renderDefaultIcon("indeterminate")
                                : isChecked
                                  ? checkedIcon
                                      ? checkedIcon
                                      : renderDefaultIcon("checked")
                                  : uncheckedIcon
                                    ? uncheckedIcon
                                    : null}
                        </IconSlot>
                    </Box>

                    {!rtl ? labelNode : null}
                </Wrapper>
            </Pressable>
        );
    },
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
