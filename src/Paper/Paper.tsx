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
} from "react-native";
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
        const [size, setSize] = useState({ width: 0, height: 0 });

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
