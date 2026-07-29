import styled from "@emotion/native";
import {
    dynamicElevation,
    extractGradientInfo,
    isValidGradient,
    isWallpaperSurfaceRole,
    resolveSurfaceOpacity,
} from "@mutualzz/ui-core";
import {
    Canvas,
    Rect,
    LinearGradient as SkiaLinearGradient,
    vec,
} from "@shopify/react-native-skia";
import { forwardRef, useMemo, useState } from "react";
import {
    StyleSheet,
    View,
    type LayoutChangeEvent,
    type StyleProp,
    type ViewStyle,
} from "react-native";
import { useSystemStyle } from "../hooks/useSystemStyle";
import { useTheme } from "../useTheme";
import { angleToSkia } from "../utils/angleToSkia";
import { resolvePaperStyles } from "./Paper.helpers";
import type { PaperProps } from "./Paper.types";

const PaperBase = styled(View)<PaperProps>(
    ({
        theme,
        variant = "elevation",
        elevation = 0,
        color = "neutral",
        textColor = "inherit",
        surfaceRole,
    }) => ({
        ...resolvePaperStyles(
            theme,
            color,
            textColor,
            variant,
            elevation,
            surfaceRole,
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
            surfaceRole,
            children,
            style,
            elevation = 0,
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
            } catch {
                return null;
            }
        }, [surface]);

        const wallpaperSurface =
            Boolean(surfaceRole) &&
            Boolean(theme.backgroundImageUrl) &&
            isWallpaperSurfaceRole(surfaceRole!);

        const gradientOpacity = useMemo(() => {
            const paperVariant =
                variant === "elevation" ? "elevation" : variant;
            return (
                resolveSurfaceOpacity(
                    theme,
                    paperVariant,
                    elevation,
                    surfaceRole,
                ) / 100
            );
        }, [theme, variant, elevation, surfaceRole]);

        const onLayout = (e: LayoutChangeEvent) => {
            const { width, height } = e.nativeEvent.layout;
            setSize({ width, height });
        };

        if (
            !gradient ||
            variant !== "elevation" ||
            wallpaperSurface ||
            !isValidGradient(surface)
        ) {
            return (
                <PaperBase
                    ref={ref}
                    variant={variant}
                    elevation={elevation}
                    surfaceRole={surfaceRole}
                    style={resolvedStyle}
                    {...props}
                >
                    {children}
                </PaperBase>
            );
        }

        const elevatedColor = dynamicElevation(surface, elevation);
        const activeGradient =
            extractGradientInfo(elevatedColor) ?? gradient;
        const { start, end } = angleToSkia(
            activeGradient.angle,
            size.width,
            size.height,
        );

        return (
            <PaperBase
                ref={ref}
                onLayout={onLayout}
                variant={variant}
                elevation={elevation}
                surfaceRole={surfaceRole}
                style={resolvedStyle}
                {...props}
            >
                <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
                    <Rect
                        opacity={gradientOpacity}
                        dither
                        x={0}
                        y={0}
                        width={size.width}
                        height={size.height}
                    >
                        <SkiaLinearGradient
                            start={vec(start.x, start.y)}
                            end={vec(end.x, end.y)}
                            colors={activeGradient.colors}
                            positions={activeGradient.positions}
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
