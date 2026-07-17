import { extractGradientInfo, resolveWallpaperScrim, resolveWallpaperSettings } from "@mutualzz/ui-core";
import {
    Canvas,
    Rect,
    LinearGradient as SkiaLinearGradient,
    vec,
} from "@shopify/react-native-skia";
import { useMemo } from "react";
import {
    ImageBackground,
    StyleSheet,
    useWindowDimensions,
    View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../useTheme";
import { angleToSkia } from "../utils/angleToSkia";
import type { NativeBaselineProps } from "./NativeBaseline.types";

const styles = StyleSheet.create({
    fill: {
        ...StyleSheet.absoluteFill,
    },
    container: {
        position: "relative",
        flex: 1,
    },
});

const NativeBaseline = ({ children }: NativeBaselineProps) => {
    const { theme } = useTheme();
    const { width, height } = useWindowDimensions();
    const backgroundImageUrl = theme.backgroundImageUrl;
    const settings = useMemo(
        () => resolveWallpaperSettings(theme),
        [theme.wallpaper, theme.type, theme.colors.background, theme.colors.surface],
    );
    const scrim = useMemo(
        () => resolveWallpaperScrim(theme),
        [theme.wallpaper, theme.type, theme.colors.background, theme.colors.surface, backgroundImageUrl],
    );

    const bg = useMemo(
        () => theme.colors.background,
        [theme.colors.background],
    );

    const gradient = useMemo(() => {
        try {
            return extractGradientInfo(bg);
        } catch {
            return null;
        }
    }, [bg]);

    const portraitStretch = useMemo(() => {
        if (height <= width) return 1;
        const ratio = height / width;
        return Math.min(1.5, 1 + (ratio - 1) * 0.35);
    }, [width, height]);

    const gradientStops = useMemo(() => {
        if (!gradient || portraitStretch <= 1) return gradient;

        const shift = (portraitStretch - 1) * 0.22;
        return {
            ...gradient,
            positions: gradient.positions.map((position) =>
                Math.min(1, position + shift * (1 - position)),
            ),
        };
    }, [gradient, portraitStretch]);

    const content = (() => {
        if (backgroundImageUrl) {
            return (
                <ImageBackground
                    source={{ uri: backgroundImageUrl }}
                    style={[styles.container, styles.fill]}
                    resizeMode="cover"
                    imageStyle={{
                        opacity: Math.min(Math.max(settings.brightness / 100, 0.2), 1),
                    }}
                >
                    <View
                        style={[
                            styles.fill,
                            { backgroundColor: scrim },
                        ]}
                    >
                        <SafeAreaView
                            edges={["top", "left", "right"]}
                            style={styles.fill}
                        >
                            {children}
                        </SafeAreaView>
                    </View>
                </ImageBackground>
            );
        }

        if (!gradient) {
            return (
                <SafeAreaView
                    edges={["top", "left", "right"]}
                    style={[
                        styles.container,
                        styles.fill,
                        { backgroundColor: theme.colors.background },
                    ]}
                >
                    {children}
                </SafeAreaView>
            );
        }

        const activeGradient = gradientStops ?? gradient;
        const { start, end } = angleToSkia(activeGradient.angle, width, height);

        return (
            <SafeAreaView
                edges={["top", "left", "right"]}
                style={[styles.container, styles.fill]}
            >
                {width > 0 && height > 0 && (
                    <Canvas
                        style={StyleSheet.absoluteFill}
                        pointerEvents="none"
                    >
                        <Rect dither x={0} y={0} width={width} height={height}>
                            <SkiaLinearGradient
                                start={vec(start.x, start.y)}
                                end={vec(end.x, end.y)}
                                colors={activeGradient.colors}
                                positions={activeGradient.positions}
                            />
                        </Rect>
                    </Canvas>
                )}
                {children}
            </SafeAreaView>
        );
    })();

    return <GestureHandlerRootView>{content}</GestureHandlerRootView>;
};

NativeBaseline.displayName = "NativeBaseline";

export { NativeBaseline };
