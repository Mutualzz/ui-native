import styled from "@emotion/native";
import { forwardRef, useMemo } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { useSystemStyle } from "../hooks/useSystemStyle";
import type { BoxProps } from "./Box.types";

const StyledBox = styled.View({});

const Box = forwardRef<View, BoxProps>(({ style, ...props }, ref) => {
    const { systemStyle, restProps } = useSystemStyle(
        props as Record<string, unknown>,
    );

    const resolvedStyle = useMemo(
        () => [systemStyle, style] as StyleProp<ViewStyle>,
        [systemStyle, style],
    );

    return <StyledBox ref={ref} style={resolvedStyle} {...restProps} />;
});

Box.displayName = "Box";

export { Box };
