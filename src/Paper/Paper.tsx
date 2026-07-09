import styled from "@emotion/native";
import { extractGradientInfo, flipNumber } from "@mutualzz/ui-core";
import {
    Canvas,
    Rect,
    LinearGradient as SkiaLinearGradient,
    vec,
} from "@shopify/react-native-skia";
import { forwardRef, useMemo, useState } from "react";
import {
    Platform,
    StyleSheet,
    View,
    type LayoutChangeEvent,
    type StyleProp,
    type ViewStyle,
} from "react-native";
import { useSystemStyle } from "../hooks/useSystemStyle";
import { useTheme } from "../useTheme";
import { resolvePaperStyles } from "./Paper.helpers";
import type { PaperProps } from "./Paper.types";

const PaperBase = styled(View)<PaperProps>(
    ({
        theme,
        variant = "elevation",
        elevation = 0,
        color = "neutral",
        textColor = "inherit",
        transparency = 0,
    }) => ({
        ...resolvePaperStyles(
            theme,
            color,
            textColor,
            variant,
            elevation,
            transparency,
        )[variant],

        borderRadius: 0,
        alignContent: "stretch",
        flexShrink: 1,
    }),
);

const Paper = forwardRef<View, PaperProps>(
    (
        {
            variant = "elevation",
            transparency = 0,
            children,
            style,
            ...restProps
        },
        ref,
    ) => {
        const { theme } = useTheme();
        const { systemStyle, restProps: props } = useSystemStyle(
            restProps as Record<string, unknown>,
        );
        const [size, setSize] = useState({ width: 0, height: 0 });

        const resolvedStyle = useMemo(
            () => [systemStyle, style] as StyleProp<ViewStyle>,
            [systemStyle, style],
        );

        const surface = useMemo(
            () => theme.colors.surface,
            [theme.colors.surface],
        );

        const gradient = useMemo(() => {
            try {
                return extractGradientInfo(surface);
            } catch (err) {
                console.error("Failed to parse gradient:", err);
                return null;
            }
        }, [surface]);

        const onLayout = (e: LayoutChangeEvent) => {
            const { width, height } = e.nativeEvent.layout;
            setSize({ width: width, height: height });
        };

        if (!gradient || variant !== "elevation") {
            return (
                <PaperBase
                    ref={ref}
                    variant={variant}
                    transparency={transparency}
                    style={resolvedStyle}
                    {...props}
                >
                    {children}
                </PaperBase>
            );
        }

        return (
            <PaperBase
                ref={ref}
                onLayout={onLayout}
                variant={variant}
                transparency={transparency}
                style={resolvedStyle}
                {...props}
            >
                <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
                    <Rect
                        opacity={flipNumber(transparency / 100, false)}
                        dither
                        x={0}
                        y={0}
                        width={size.width}
                        height={size.height}
                    >
                        <SkiaLinearGradient
                            start={Platform.select({
                                android: vec(
                                    size.width * 0.75,
                                    size.height * 0.75,
                                ),
                                default: vec(
                                    size.width * 0.5,
                                    size.height * 0.5,
                                ),
                            })}
                            end={vec(size.width, size.height)}
                            colors={gradient.colors}
                            positions={gradient.positions}
                        />
                    </Rect>
                </Canvas>
                {children}
            </PaperBase>
        );
    },
);

Paper.displayName = "Paper";

export { Paper };
