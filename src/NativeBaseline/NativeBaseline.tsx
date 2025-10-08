import { addIntermediateStops } from "@mutualzz/ui-core";
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

    const gradient = useMemo(
        () => addIntermediateStops(theme.colors.background),
        [theme],
    );

    if (gradient) {
        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={gradient.colors}
                    locations={gradient.locations}
                    style={styles.fill}
                    angle={gradient.angle}
                    useAngle
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />
                {children}
            </View>
        );
    }

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
};
