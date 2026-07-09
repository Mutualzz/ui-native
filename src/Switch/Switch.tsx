import styled from "@emotion/native";
import {
    resolveShapeValue,
    type Color,
    type ColorLike,
} from "@mutualzz/ui-core";
import { forwardRef, useMemo, useState } from "react";
import { Pressable, View, useWindowDimensions } from "react-native";
import { useTheme } from "../useTheme";
import { MAX_FONT_SCALE_MULTIPLIER } from "../utils/accessibility";
import { resolveResponsiveValue } from "../utils/responsive";
import {
    resolveSwitchDimensions,
    resolveSwitchTrackStyles,
} from "./Switch.helpers";
import type { SwitchProps } from "./Switch.types";

const SwitchWrapper = styled.View<{ disabled?: boolean; hasLabel?: boolean }>(
    ({ disabled, hasLabel }) => ({
        flexDirection: "row",
        alignItems: hasLabel ? "flex-start" : "center",
        gap: 8,
        flexShrink: 1,
        minWidth: 0,
        opacity: disabled ? 0.5 : 1,
    }),
);

const Decorator = styled.View({
    alignItems: "center",
    justifyContent: "center",
});

const Label = styled.Text({});

const Switch = forwardRef<View, SwitchProps>(
    (
        {
            checked: controlledChecked,
            defaultChecked,
            onChange,
            onPress,
            disabled,
            label,
            startDecorator,
            endDecorator,
            color = "neutral",
            variant = "solid",
            size = "md",
            shape = "rounded",
            style,
            hitSlop: hitSlopProp,
            ...props
        },
        ref,
    ) => {
        const { theme } = useTheme();
        const { width: windowWidth } = useWindowDimensions();
        const [uncontrolledChecked, setUncontrolledChecked] = useState(
            defaultChecked ?? false,
        );

        const isChecked =
            controlledChecked !== undefined
                ? controlledChecked
                : uncontrolledChecked;

        const resolvedSize = useMemo(
            () => resolveResponsiveValue(theme, size, windowWidth),
            [theme, size, windowWidth],
        );

        const resolvedColor = useMemo(
            () => resolveResponsiveValue(theme, color, windowWidth),
            [theme, color, windowWidth],
        );

        const resolvedVariant = useMemo(
            () => resolveResponsiveValue(theme, variant, windowWidth),
            [theme, variant, windowWidth],
        );

        const resolvedShape = useMemo(
            () => resolveResponsiveValue(theme, shape, windowWidth),
            [theme, shape, windowWidth],
        );

        const dimensions = useMemo(
            () => resolveSwitchDimensions(theme, resolvedSize),
            [theme, resolvedSize],
        );

        const trackStyles = useMemo(
            () =>
                resolveSwitchTrackStyles(
                    theme,
                    resolvedColor as Color | ColorLike,
                    isChecked,
                )[resolvedVariant],
            [theme, resolvedColor, isChecked, resolvedVariant],
        );

        const borderRadius = useMemo(
            () => resolveShapeValue(resolvedShape),
            [resolvedShape],
        );

        const handlePress: SwitchProps["onPress"] = (event) => {
            if (disabled) return;

            const next = !isChecked;
            if (controlledChecked === undefined) {
                setUncontrolledChecked(next);
            }

            onChange?.(next);
            onPress?.(event);
        };

        const thumbOffset =
            dimensions.width - dimensions.thumb - dimensions.padding * 2;

        // Without label/decorators, the pressable area is just the switch
        // track, which can be well under the 44x44 minimum touch target
        // (e.g. size="sm" is 16px tall). Expand via hitSlop, not the visual
        // track size.
        const autoHitSlop = Math.max(0, (44 - dimensions.height) / 2);
        const hitSlop = hitSlopProp ?? autoHitSlop;

        return (
            <Pressable
                {...props}
                ref={ref}
                accessibilityRole="switch"
                accessibilityState={{ disabled, checked: isChecked }}
                hitSlop={hitSlop}
                disabled={disabled}
                onPress={handlePress}
                style={style}
            >
                <SwitchWrapper disabled={disabled} hasLabel={Boolean(label)}>
                    {startDecorator ? (
                        <Decorator>{startDecorator}</Decorator>
                    ) : null}

                    <View
                        style={{
                            width: dimensions.width,
                            height: dimensions.height,
                            borderRadius,
                            padding: dimensions.padding,
                            justifyContent: "center",
                            ...trackStyles,
                        }}
                    >
                        <View
                            style={{
                                width: dimensions.thumb,
                                height: dimensions.thumb,
                                borderRadius: dimensions.thumb,
                                backgroundColor: trackStyles.thumbColor,
                                transform: [
                                    {
                                        translateX: isChecked ? thumbOffset : 0,
                                    },
                                ],
                                shadowColor: "#000",
                                shadowOpacity: 0.25,
                                shadowRadius: 2,
                                shadowOffset: { width: 0, height: 1 },
                                elevation: 2,
                            }}
                        />
                    </View>

                    {label ? (
                        <Label
                            maxFontSizeMultiplier={MAX_FONT_SCALE_MULTIPLIER}
                            style={{ flexShrink: 1 }}
                        >
                            {label}
                        </Label>
                    ) : null}

                    {endDecorator ? (
                        <Decorator>{endDecorator}</Decorator>
                    ) : null}
                </SwitchWrapper>
            </Pressable>
        );
    },
);

Switch.displayName = "Switch";

export { Switch };
