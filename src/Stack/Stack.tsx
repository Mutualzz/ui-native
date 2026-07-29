import { forwardRef } from "react";
import { type View, type StyleProp, type ViewStyle } from "react-native";
import { Box } from "../Box/Box";
import type { StackProps } from "./Stack.types";

const Stack = forwardRef<View, StackProps>(({ style, ...props }, ref) => (
    <Box
        ref={ref}
        style={[{ display: "flex" }, style] as StyleProp<ViewStyle>}
        {...props}
    />
));

Stack.displayName = "Stack";

export { Stack };
