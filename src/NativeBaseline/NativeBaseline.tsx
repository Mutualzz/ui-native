import { isValidGradient } from "@mutualzz/ui-core";
import {
    Canvas,
    Rect,
    LinearGradient as SkiaLinearGradient,
    vec,
} from "@shopify/react-native-skia";
import { useMemo, useState, type PropsWithChildren } from "react";
import { StyleSheet, View, type LayoutChangeEvent } from "react-native";
import { useTheme } from "../useTheme";
import { extractColors } from "./NativeBaseline.helpers";

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
    const [size, setSize] = useState({ w: 0, h: 0 });

    const bg = theme.colors.background;

    const onLayout = (e: LayoutChangeEvent) => {
        const { width, height } = e.nativeEvent.layout;
        if (width !== size.w || height !== size.h)
            setSize({ w: width, h: height });
    };

    const gradient = useMemo(() => {
        if ((!size.w || !size.h) && !isValidGradient(bg)) return null;

        try {
            return extractColors(bg);
        } catch (err) {
            console.error("Failed to parse gradient:", err);
            return null;
        }
    }, [bg, size.w, size.h]);

    // console.log(gradient);

    if (!gradient) {
        return (
            <View
                style={[
                    styles.container,
                    { backgroundColor: theme.colors.background },
                ]}
            >
                {children}
            </View>
        );
    }

    return (
        <View style={styles.fill} onLayout={onLayout}>
            {size.w > 0 && size.h > 0 && gradient && (
                <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
                    <Rect x={0} y={0} width={size.w} height={size.h}>
                        <SkiaLinearGradient
                            start={vec(0, 0)}
                            end={vec(size.w, size.h)}
                            colors={gradient}
                        />
                    </Rect>
                </Canvas>
            )}
            {children}
        </View>
    );
};

NativeBaseline.displayName = "NativeBaseline";

export { NativeBaseline };
