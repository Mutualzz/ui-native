import styled from "@emotion/native";
import { resolveColor, type Variant } from "@mutualzz/ui-core";
import { forwardRef, useEffect, useMemo, useRef } from "react";
import { Animated, Easing, type View } from "react-native";
import { useTheme } from "../useTheme";
import {
    resolveLinearProgressLength,
    resolveLinearProgressStyles,
    resolveLinearProgressThickness,
} from "./LinearProgress.helpers";
import type { LinearProgressProps } from "./LinearProgress.types";

const Wrapper = styled.View<{
    width: number;
    height: number;
    background: string;
    outlinedColor: string;
    variant: Variant;
}>(({ width, height, background, outlinedColor, variant }) => ({
    position: "relative",
    width,
    height,
    backgroundColor: background,
    borderRadius: 8,
    overflow: "hidden",
    ...(variant === "outlined"
        ? { borderWidth: 1, borderColor: outlinedColor }
        : null),
}));

const DeterminateBar = styled.View<{ barColor: string; value: number }>(
    ({ barColor, value }) => ({
        height: "100%",
        backgroundColor: barColor,
        width: `${Math.min(Math.max(value, 0), 100)}%`,
    }),
);

const IndeterminateBar = styled(Animated.View)<{ barColor: string }>(
    ({ barColor }) => ({
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        backgroundColor: barColor,
    }),
);

const easeInOut = Easing.bezier(0.42, 0, 0.58, 1);

const LinearProgress = forwardRef<View, LinearProgressProps>(
    (
        {
            thickness = "md",
            length = "md",
            variant = "soft",
            color = "primary",
            animation = "bounce",
            determinate = false,
            value = 0,
            style,
            ...props
        },
        ref,
    ) => {
        const { theme } = useTheme();

        const height = resolveLinearProgressThickness(theme, thickness);
        const width = resolveLinearProgressLength(theme, length);

        const background = resolveLinearProgressStyles(theme, color)[variant];
        const barColor = resolveColor(color, theme);

        const t = useRef(new Animated.Value(0)).current;

        useEffect(() => {
            if (determinate) return;

            t.stopAnimation();
            t.setValue(0);

            const loop = Animated.loop(
                Animated.timing(t, {
                    toValue: 1,
                    duration: 1500,
                    easing: easeInOut,
                    useNativeDriver: true,
                }),
            );

            loop.start();
            return () => loop.stop();
        }, [determinate, t, animation]);

        const indeterminate = useMemo(() => {
            const w = width;

            const barW =
                animation === "bounce"
                    ? 0.3 * w
                    : animation === "slide"
                      ? 0.4 * w
                      : w;

            const translateX =
                animation === "slide"
                    ? t.interpolate({
                          inputRange: [0, 0.5, 1],
                          outputRange: [-0.5 * w, 0.25 * w, 1.0 * w],
                      })
                    : animation === "bounce"
                      ? t.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: [0, 0.7 * w, 0],
                        })
                      : animation === "wave"
                        ? t.interpolate({
                              inputRange: [0, 0.5, 1],
                              outputRange: [-1.0 * w, 0.5 * w, 1.0 * w],
                          })
                        : 0;

            const scaleX =
                animation === "wave"
                    ? t.interpolate({
                          inputRange: [0, 0.5, 1],
                          outputRange: [0.8, 1, 0.8],
                      })
                    : animation === "scale-in-out"
                      ? t.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: [0.5, 1, 0.5],
                        })
                      : 1;

            const opacity =
                animation === "wave" || animation === "scale-in-out"
                    ? t.interpolate({
                          inputRange: [0, 0.5, 1],
                          outputRange: [0.5, 1, 0.5],
                      })
                    : 1;

            return {
                width: barW,
                transform: [
                    ...(typeof translateX === "number" ? [] : [{ translateX }]),
                    { scaleX: scaleX },
                ],
                opacity: opacity,
            };
        }, [animation, t, width]);

        return (
            <Wrapper
                ref={ref}
                {...props}
                width={width}
                height={height}
                background={background}
                outlinedColor={barColor}
                variant={variant}
                style={style}
            >
                {determinate ? (
                    <DeterminateBar barColor={barColor} value={value} />
                ) : (
                    <IndeterminateBar
                        barColor={barColor}
                        style={indeterminate}
                    />
                )}
            </Wrapper>
        );
    },
);

LinearProgress.displayName = "LinearProgress";

export { LinearProgress };
