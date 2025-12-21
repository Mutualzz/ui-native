import styled from "@emotion/native";
import { resolveColor } from "@mutualzz/ui-core";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useTheme } from "../useTheme";
import {
    calculateCircle,
    resolveCircularProgressOuterStroke,
} from "./CircularProgress.helpers";
import type { CircularProgressProps } from "./CircularProgress.types";

const Wrapper = styled.View({
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
});

const Content = styled.View({
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
});

const SvgLayer = styled(Animated.View)({
    position: "absolute",
    top: 0,
    left: 0,
});

const CircularProgress = forwardRef<View, CircularProgressProps>(
    (
        {
            size = "md",
            variant = "soft",
            color = "primary",
            determinate = false,
            strokeWidth,
            value = 0,
            children,
            style,

            ...props
        },
        ref,
    ) => {
        const { theme } = useTheme();

        const [contentDiameter, setContentDiameter] = useState(0);

        const spin = useRef(new Animated.Value(0)).current;

        useEffect(() => {
            if (determinate) return;

            spin.setValue(0);
            const anim = Animated.loop(
                Animated.timing(spin, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
            );
            anim.start();

            return () => anim.stop();
        }, [determinate, spin]);

        const rotation = spin.interpolate({
            inputRange: [0, 1],
            outputRange: ["0deg", "360deg"],
        });

        const circle = useMemo(
            () =>
                calculateCircle(
                    theme,
                    size,
                    value,
                    contentDiameter,
                    strokeWidth,
                ),
            [theme, size, value, contentDiameter, strokeWidth],
        );

        const diameter = circle.diameter;
        const r = circle.radius;
        const cx = diameter / 2;
        const cy = diameter / 2;

        const innerStroke = resolveColor(color, theme);
        const outerStroke = resolveCircularProgressOuterStroke(theme, color)[
            variant
        ].stroke;

        const dashArray = determinate
            ? `${circle.circumference}`
            : `${circle.circumference * 0.25} ${circle.circumference}`;

        const dashOffset = determinate ? circle.dashOffset : 0;

        const outlineStroke = resolveColor(color, theme);

        return (
            <Wrapper
                ref={ref}
                {...props}
                style={[{ width: diameter, height: diameter }, style]}
            >
                <Content
                    onLayout={(e) => {
                        const { width, height } = e.nativeEvent.layout;
                        setContentDiameter(Math.max(width, height));
                    }}
                >
                    {children}
                </Content>

                {diameter > 0 && (
                    <SvgLayer
                        style={{
                            transform: determinate
                                ? undefined
                                : [{ rotate: rotation }],
                        }}
                    >
                        <Svg
                            width={diameter}
                            height={diameter}
                            viewBox={`0 0 ${diameter} ${diameter}`}
                        >
                            <Circle
                                cx={cx}
                                cy={cy}
                                r={r}
                                fill="none"
                                stroke={outerStroke}
                                strokeWidth={circle.strokeWidthValue}
                            />

                            {variant === "outlined" && (
                                <>
                                    <Circle
                                        cx={cx}
                                        cy={cy}
                                        r={r - circle.strokeWidthValue / 2}
                                        fill="none"
                                        stroke={outlineStroke}
                                        strokeWidth={1}
                                    />
                                    <Circle
                                        cx={cx}
                                        cy={cy}
                                        r={r + circle.strokeWidthValue / 2 - 1}
                                        fill="none"
                                        stroke={outlineStroke}
                                        strokeWidth={1}
                                    />
                                </>
                            )}

                            <Circle
                                cx={cx}
                                cy={cy}
                                r={r}
                                fill="none"
                                stroke={innerStroke}
                                strokeWidth={circle.strokeWidthValue}
                                strokeLinecap="round"
                                strokeDasharray={dashArray}
                                strokeDashoffset={dashOffset}
                                origin={`${cx}, ${cy}`}
                                rotation={-90}
                            />
                        </Svg>
                    </SvgLayer>
                )}
            </Wrapper>
        );
    },
);

CircularProgress.displayName = "CircularProgress";

export { CircularProgress };
