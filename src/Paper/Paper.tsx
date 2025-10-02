import styled from "@emotion/native";
import { View } from "react-native";
import { resolvePaperStyles } from "./Paper.helpers";
import type { PaperProps } from "./Paper.types";

const Paper = styled(View)<PaperProps>(
    ({
        theme,
        elevation = 0,
        variant = "elevation",
        color = "neutral",
        nonTranslucent = false,
    }) => ({
        ...resolvePaperStyles(theme, color, elevation, nonTranslucent)[variant],
    }),
);

Paper.displayName = "Paper";

export { Paper };
