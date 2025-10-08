import styled from "@emotion/native";
import { type PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
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
};

export { Paper };
