import styled from "@emotion/native";
import { forwardRef, useContext, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import type { CheckboxVisualStyle } from "../Checkbox/Checkbox.helpers";
import { RadioGroupContext } from "../RadioGroup/RadioGroup.context";
import { useTheme } from "../useTheme";
import { MAX_FONT_SCALE_MULTIPLIER } from "../utils/accessibility";
import {
    resolveIconScaling,
    resolveRadioSize,
    resolveRadioStyles,
} from "./Radio.helpers";
import type { RadioProps } from "./Radio.types";

const RadioWrapper = styled(Pressable)<{
    disabled?: boolean;
    fontSize: number;
    hasLabel?: boolean;
}>(({ disabled, fontSize, hasLabel }) => ({
    flexDirection: "row",
    alignItems: hasLabel ? "flex-start" : "center",
    alignSelf: "flex-start",
    flexShrink: 1,
    minWidth: 0,
    opacity: disabled ? 0.5 : 1,
    fontSize,
}));

const RadioControl = styled(View)<{
    boxStyle: CheckboxVisualStyle["box"];
    sizePx: number;
}>(({ boxStyle, sizePx }) => ({
    width: sizePx,
    height: sizePx,
    borderRadius: sizePx / 2,
    alignItems: "center",
    justifyContent: "center",
    ...(boxStyle ?? {}),
}));

const LabelWrapper = styled(View)<{ rtl?: boolean }>(({ rtl }) => ({
    marginLeft: rtl ? 0 : 8,
    marginRight: rtl ? 8 : 0,
    flexShrink: 1,
    minWidth: 0,
}));

const DefaultDot = styled(View)<{ dotSize: number; dotColor: string }>(
    ({ dotSize, dotColor }) => ({
        width: dotSize,
        height: dotSize,
        borderRadius: dotSize / 2,
        backgroundColor: dotColor,
    }),
);

const IconWrapper = styled(View)<{ sizePx: number }>(({ sizePx }) => ({
    width: sizePx,
    height: sizePx,
    alignItems: "center",
    justifyContent: "center",
}));

const Radio = forwardRef<View, RadioProps>(
    (
        {
            checked: controlledChecked,
            defaultChecked,
            onChange: propOnChange,
            label,
            disabled: propDisabled,
            color: colorProp,
            variant: variantProp,
            size: sizeProp,
            name: propName,
            value,
            checkedIcon,
            uncheckedIcon,
            rtl,
            style,
            ...props
        },
        ref,
    ) => {
        const { theme } = useTheme();
        const group = useContext(RadioGroupContext);

        const [internalChecked, setInternalChecked] =
            useState(!!defaultChecked);

        const isChecked =
            group && value !== undefined
                ? group.value === value
                : controlledChecked !== undefined
                  ? controlledChecked
                  : internalChecked;

        const color = colorProp ?? group?.color ?? "primary";
        const variant = variantProp ?? group?.variant ?? "solid";
        const size = sizeProp ?? group?.size ?? "md";
        const name = group?.name ?? propName;
        const disabled = group?.disabled || propDisabled;

        const fontSize = useMemo(
            () => resolveRadioSize(theme, size).fontSize,
            [theme, size],
        );

        const sizePx = typeof size === "number" ? size : fontSize;

        const iconScale = useMemo(() => {
            try {
                return resolveIconScaling(theme, size);
            } catch {
                return { width: sizePx, height: sizePx };
            }
        }, [theme, size, sizePx]);

        const dotSize = Math.max(2, Math.round(sizePx * 0.5));
        const labelColor = theme.typography.colors.primary;
        const labelFontSize = theme.typography.levels["body-sm"].fontSize;

        const { variantStyle, pressedStyle, checkedStyle } = useMemo(() => {
            const base =
                resolveRadioStyles(theme, color, false)?.[variant] ?? {};
            const pressedS =
                resolveRadioStyles(theme, color, true)?.[variant] ?? {};
            const checkedS =
                resolveRadioStyles(theme, color, true)?.[variant] ?? {};
            return {
                variantStyle: base,
                pressedStyle: pressedS,
                checkedStyle: checkedS,
            };
        }, [theme, color, variant]);

        const handlePress = () => {
            if (disabled) return;

            if (group && value !== undefined) {
                group.onChange?.(value);
            } else {
                if (isChecked) return;
                if (controlledChecked === undefined) setInternalChecked(true);
                propOnChange?.(true);
            }
        };

        const pressableDisabled = !!disabled;

        // A hitSlop-expanded single Pressable (RadioWrapper) handles the
        // whole row, including the dot — a separate nested Pressable around
        // just the dot used to exist here purely to read `pressed` state,
        // but React Native claims the touch responder on the innermost
        // Pressable, so it silently created a second, unlabeled
        // accessibility stop for screen readers. `pressed` is read from the
        // outer Pressable's render-prop instead.
        const autoHitSlop = Math.max(0, (44 - sizePx) / 2);

        return (
            <RadioWrapper
                ref={ref}
                hasLabel={Boolean(label)}
                accessibilityRole="radio"
                accessibilityState={{
                    checked: !!isChecked,
                    disabled: !!disabled,
                }}
                disabled={pressableDisabled}
                onPress={handlePress}
                hitSlop={autoHitSlop}
                style={style}
                fontSize={fontSize}
                {...props}
            >
                {({ pressed }) => {
                    const visual = isChecked
                        ? checkedStyle
                        : pressed
                          ? pressedStyle
                          : variantStyle;

                    return (
                    <>
                        {rtl && label ? (
                            <LabelWrapper rtl={rtl}>
                                {typeof label === "string" ? (
                                    <Text
                                        maxFontSizeMultiplier={
                                            MAX_FONT_SCALE_MULTIPLIER
                                        }
                                        style={{
                                            color: labelColor,
                                            fontSize: labelFontSize,
                                        }}
                                    >
                                        {label}
                                    </Text>
                                ) : (
                                    label
                                )}
                            </LabelWrapper>
                        ) : null}

                        <RadioControl
                            sizePx={sizePx}
                            boxStyle={visual.box}
                        >
                            {isChecked ? (
                                checkedIcon ? (
                                    <IconWrapper
                                        sizePx={iconScale?.width ?? sizePx}
                                    >
                                        {checkedIcon}
                                    </IconWrapper>
                                ) : (
                                    <DefaultDot
                                        dotSize={dotSize}
                                        dotColor={visual.iconColor}
                                    />
                                )
                            ) : uncheckedIcon ? (
                                <IconWrapper
                                    sizePx={iconScale?.width ?? sizePx}
                                >
                                    {uncheckedIcon}
                                </IconWrapper>
                            ) : null}
                        </RadioControl>

                        {!rtl && label ? (
                            <LabelWrapper rtl={rtl}>
                                {typeof label === "string" ? (
                                    <Text
                                        maxFontSizeMultiplier={
                                            MAX_FONT_SCALE_MULTIPLIER
                                        }
                                        style={{
                                            color: labelColor,
                                            fontSize: labelFontSize,
                                        }}
                                    >
                                        {label}
                                    </Text>
                                ) : (
                                    label
                                )}
                            </LabelWrapper>
                        ) : null}
                    </>
                    );
                }}
            </RadioWrapper>
        );
    },
);

Radio.displayName = "Radio";

export { Radio };
