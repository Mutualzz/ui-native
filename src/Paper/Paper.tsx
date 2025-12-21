import styled from "@emotion/native";
import { extractColors, flipNumber } from "@mutualzz/ui-core";
import {
    Canvas,
    Rect,
    LinearGradient as SkiaLinearGradient,
    vec,
} from "@shopify/react-native-skia";
import { forwardRef, useMemo, useState } from "react";
import { StyleSheet, View, type LayoutChangeEvent } from "react-native";
import { useTheme } from "../useTheme";
import { resolvePaperStyles } from "./Paper.helpers";
import type { PaperProps } from "./Paper.types";

const PaperBase = styled(View)<PaperProps>(
    ({
        inline,
        theme,
        variant = "elevation",
        elevation = 0,
        color = "neutral",
        transparency = 0,
    }) => ({
        ...resolvePaperStyles(theme, color, variant, elevation, transparency)[
            variant
        ],

        ...(variant === "elevation" && {
            elevation,
            shadowColor: "#000",
            shadowOpacity: Math.min(0.1 + elevation * 0.05, 0.5),
            shadowOffset: { width: 0, height: 2 + elevation },
            shadowRadius: 4 + elevation,
            borderRadius: 12,
            overflow: "hidden",
        }),
        borderRadius: 0,
        alignSelf: inline ? "flex-start" : "stretch",
        alignContent: "stretch",
        flexShrink: 1,
        flexDirection: "row",
    }),
);

const Paper = forwardRef<View, PaperProps>(
    ({ variant = "elevation", transparency = 0, children, ...props }, ref) => {
        const { theme } = useTheme();
        const [size, setSize] = useState({ w: 0, h: 0 });

        const surface = theme.colors.surface;

        const gradient = useMemo(() => {
            try {
                return extractColors(surface);
            } catch (err) {
                console.error("Failed to parse gradient:", err);
                return null;
            }
        }, [surface]);

        const onLayout = (e: LayoutChangeEvent) => {
            const { width, height } = e.nativeEvent.layout;
            setSize({ w: width, h: height });
        };

        if (!gradient || variant !== "elevation") {
            return (
                <PaperBase
                    style={{ backgroundColor: theme.colors.surface }}
                    variant={variant}
                    transparency={transparency}
                    {...props}
                >
                    {children}
                </PaperBase>
            );
        }

        return (
            <PaperBase
                onLayout={onLayout}
                variant={variant}
                transparency={transparency}
                {...props}
            >
                <Canvas
                    style={StyleSheet.absoluteFillObject}
                    pointerEvents="none"
                >
                    <Rect
                        opacity={flipNumber(transparency / 100)}
                        dither
                        x={0}
                        y={0}
                        width={size.w}
                        height={size.h}
                    >
                        <SkiaLinearGradient
                            start={vec(0, 0)}
                            end={vec(size.w, size.h)}
                            colors={gradient}
                        />
                    </Rect>
                </Canvas>
                {children}
            </PaperBase>
        );
    },
);

export { Paper };
