import styled from "@emotion/native";
import {
    resolveShapeValue,
    type Color,
    type ColorLike,
} from "@mutualzz/ui-core";
import { forwardRef, useMemo, useState } from "react";
import { Pressable, View, useWindowDimensions } from "react-native";
import { useTheme } from "../useTheme";
import { resolveResponsiveValue } from "../utils/responsive";
import {
    resolveSwitchDimensions,
    resolveSwitchTrackStyles,
} from "./Switch.helpers";
import type { SwitchProps } from "./Switch.types";

const SwitchWrapper = styled.View<{ disabled?: boolean }>(({ disabled }) => ({
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    opacity: disabled ? 0.5 : 1,
}));

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

        return (
            <Pressable
                {...props}
                ref={ref}
                accessibilityRole="switch"
                accessibilityState={{ disabled, checked: isChecked }}
                disabled={disabled}
                onPress={handlePress}
                style={style}
            >
                <SwitchWrapper disabled={disabled}>
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

                    {label ? <Label>{label}</Label> : null}

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
