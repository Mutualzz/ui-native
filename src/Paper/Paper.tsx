import styled from "@emotion/native";
import { extractColors } from "@mutualzz/ui-core";
import {
    Canvas,
    Rect,
    LinearGradient as SkiaLinearGradient,
    vec,
} from "@shopify/react-native-skia";
import { useMemo, useState, type PropsWithChildren } from "react";
import { StyleSheet, View, type LayoutChangeEvent } from "react-native";
import { useTheme } from "../useTheme";
import { resolvePaperStyles } from "./Paper.helpers";
import type { PaperProps } from "./Paper.types";

const PaperBase = styled(View)<PaperProps>(
    ({
        theme,
        elevation = 0,
        variant = "elevation",
        color = "neutral",
        nonTranslucent = false,
    }) => ({
        ...resolvePaperStyles(theme, color, elevation, nonTranslucent)[variant],

        ...(variant === "elevation" && {
            elevation,
            shadowColor: "#000",
            shadowOpacity: Math.min(0.1 + elevation * 0.05, 0.5),
            shadowOffset: { width: 0, height: 2 + elevation },
            shadowRadius: 4 + elevation,
            borderRadius: 12,
            overflow: "hidden",
        }),
    }),
);

const styles = StyleSheet.create({
    fill: {
        ...StyleSheet.absoluteFillObject,
    },
});

const Paper = ({
    variant = "elevation",
    nonTranslucent = false,
    children,
    ...props
}: PropsWithChildren<PaperProps>) => {
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
                nonTranslucent={nonTranslucent}
                {...props}
            >
                {children}
            </PaperBase>
        );
    }

    const gradientOpacity = nonTranslucent ? 1 : 0.2;

    return (
        <PaperBase
            onLayout={onLayout}
            variant={variant}
            nonTranslucent={nonTranslucent}
            {...props}
        >
            <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
                <Rect
                    opacity={gradientOpacity}
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
};

export { Paper };
