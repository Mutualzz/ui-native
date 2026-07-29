import styled from "@emotion/native";
import { forwardRef, useContext, useMemo, useState } from "react";
import { Pressable, type View } from "react-native";
import Svg, { Line, Polyline } from "react-native-svg";
import { CheckboxGroupContext } from "../CheckboxGroup/CheckboxGroup.context";
import { useTheme } from "../useTheme";
import { MAX_FONT_SCALE_MULTIPLIER } from "../utils/accessibility";
import {
    resolveCheckboxSize,
    resolveCheckboxStyles,
    resolveIconScaling,
} from "./Checkbox.helpers";
import type { CheckboxProps } from "./Checkbox.types";

const Wrapper = styled.View<{ hasLabel?: boolean }>(({ hasLabel }) => ({
    flexDirection: "row",
    alignItems: hasLabel ? "flex-start" : "center",
    flexShrink: 1,
    minWidth: 0,
}));

const Box = styled.View({
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
});

const IconSlot = styled.View({
    alignItems: "center",
    justifyContent: "center",
});

const Label = styled.Text<{ labelColor: string; fontSize: number }>(
    ({ labelColor, fontSize }) => ({
        color: labelColor,
        fontSize,
        flexShrink: 1,
    }),
);

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
            hitSlop: hitSlopProp,
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
        const disabled = Boolean(group?.disabled || propDisabled);

        const isChecked =
            group && value !== undefined
                ? Array.isArray(group.value) && group.value.includes(value)
                : controlledChecked !== undefined
                  ? controlledChecked
                  : uncontrolledChecked;

        const { fontSize: controlSize } = resolveCheckboxSize(theme, size);
        const labelFontSize = theme.typography.levels["body-sm"].fontSize;

        const iconSize = resolveIconScaling(theme, size);

        // Without a label, the pressable area is just the checkbox box
        // itself, which can be well under the 44x44 minimum touch target
        // (e.g. size="sm" is 20x20). Expand the touchable area via hitSlop
        // rather than the visual box size.
        const autoHitSlop = Math.max(0, (44 - controlSize) / 2);
        const hitSlop = hitSlopProp ?? autoHitSlop;

        const baseStyles = useMemo(
            () => resolveCheckboxStyles(theme, color, isChecked)[variant],
            [theme, color, isChecked, variant],
        );

        const activeStyles = useMemo(
            () => resolveCheckboxStyles(theme, color, true)[variant],
            [theme, color, variant],
        );

        const isGrouped = Boolean(group && value !== undefined);

        const toggle = (next: boolean) => {
            if (!isGrouped && controlledChecked === undefined) {
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
                labelColor={theme.typography.colors.primary}
                fontSize={labelFontSize}
                maxFontSizeMultiplier={MAX_FONT_SCALE_MULTIPLIER}
                style={[
                    {
                        marginLeft: rtl ? 0 : 8,
                        marginRight: rtl ? 8 : 0,
                    },
                ]}
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
                hitSlop={hitSlop}
                disabled={disabled}
                onPress={() => toggle(!isChecked)}
                style={({ pressed }) => {
                    const resolvedStyle =
                        typeof style === "function"
                            ? style({ pressed })
                            : style;

                    return [{ opacity: disabled ? 0.5 : 1 }, resolvedStyle];
                }}
            >
                {({ pressed }) => (
                <Wrapper hasLabel={Boolean(label)}>
                    {rtl ? labelNode : null}
                    <Box
                        style={[
                            {
                                width: controlSize,
                                height: controlSize,
                            },
                            (pressed ? activeStyles : baseStyles).box,
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
                )}
            </Pressable>
        );
    },
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
