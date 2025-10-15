import { extractColors } from "@mutualzz/ui-core";
import {
    Canvas,
    Rect,
    LinearGradient as SkiaLinearGradient,
    vec,
} from "@shopify/react-native-skia";
import { useMemo, type PropsWithChildren } from "react";
import { Platform, StyleSheet, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../useTheme";

const styles = StyleSheet.create({
    fill: {
        ...StyleSheet.absoluteFillObject,
    },
    container: {
        flex: 1,
    },
});

const NativeBaseline = ({ children }: PropsWithChildren) => {
    const { theme } = useTheme();

    const { width, height } = useWindowDimensions();

    const bg = theme.colors.background;

    const gradient = useMemo(() => {
        try {
            return extractColors(bg);
        } catch (err) {
            console.error("Failed to parse gradient:", err);
            return null;
        }
    }, [bg, width, height]);

    if (!gradient) {
        return (
            <SafeAreaView
                edges={["left", "right"]}
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

    return (
        <SafeAreaView
            edges={["left", "right"]}
            style={[styles.container, styles.fill]}
        >
            {width > 0 && height > 0 && gradient && (
                <Canvas
                    style={StyleSheet.absoluteFillObject}
                    pointerEvents="none"
                >
                    <Rect dither x={0} y={0} width={width} height={height}>
                        <SkiaLinearGradient
                            start={Platform.select({
                                android: vec(width * 0.75, height * 0.75),
                                default: vec(width * 0.5, height * 0.5),
                            })}
                            end={vec(width, height)}
                            colors={gradient}
                        />
                    </Rect>
                </Canvas>
            )}
            {children}
        </SafeAreaView>
    );
};

NativeBaseline.displayName = "NativeBaseline";

export { NativeBaseline };
