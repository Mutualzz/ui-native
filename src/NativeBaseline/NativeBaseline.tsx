import { isValidGradient } from "@mutualzz/ui-core";
import Color from "color";
import gradientParser from "gradient-parser";
import { useMemo, type PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useTheme } from "../useTheme";

const styles = StyleSheet.create({
    fill: {
        ...StyleSheet.absoluteFillObject,
    },
    container: {
        flex: 1,
    },
});

export const NativeBasline = ({ children }: PropsWithChildren) => {
    const { theme } = useTheme();
    const backgroundColor = theme.colors.background;

    const parsed = useMemo(() => {
        if (!isValidGradient(backgroundColor)) return null;

        try {
            return gradientParser.parse(backgroundColor)[0];
        } catch {
            return null;
        }
    }, [backgroundColor]);

    if (parsed) {
        const colors = parsed.colorStops.map((stop) =>
            Color(stop.type === "hex" ? `#${stop.value}` : stop.value)
                .rgb()
                .string(),
        );

        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={colors}
                    style={styles.fill}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />
                {children}
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor }]}>{children}</View>
    );
};
