import { extractGradientInfo } from "@mutualzz/ui-core";
import {
    Canvas,
    Rect,
    LinearGradient as SkiaLinearGradient,
    vec,
} from "@shopify/react-native-skia";
import { useMemo } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../useTheme";
import { angleToSkia } from "../utils/angleToSkia";
import type { NativeBaselineProps } from "./NativeBaseline.types";

const styles = StyleSheet.create({
    fill: {
        ...StyleSheet.absoluteFillObject,
    },
    container: {
        position: "relative",
        flex: 1,
    },
});

const NativeBaseline = ({ children }: NativeBaselineProps) => {
    const { theme } = useTheme();

    const { width, height } = useWindowDimensions();

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

    if (!gradient) {
        return (
            <GestureHandlerRootView>
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
            </GestureHandlerRootView>
        );
    }

    const { start, end } = angleToSkia(gradient.angle, width, height);

    return (
        <GestureHandlerRootView>
            <SafeAreaView
                edges={["left", "right"]}
                style={[styles.container, styles.fill]}
            >
                {width > 0 && height > 0 && (
                    <Canvas
                        style={StyleSheet.absoluteFillObject}
                        pointerEvents="none"
                    >
                        <Rect dither x={0} y={0} width={width} height={height}>
                            <SkiaLinearGradient
                                start={vec(start.x, start.y)}
                                end={vec(end.x, end.y)}
                                colors={gradient.colors}
                                positions={gradient.positions}
                            />
                        </Rect>
                    </Canvas>
                )}
                {children}
            </SafeAreaView>
        </GestureHandlerRootView>
    );
};

NativeBaseline.displayName = "NativeBaseline";

export { NativeBaseline };
