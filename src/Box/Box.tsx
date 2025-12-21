import styled from "@emotion/native";
import type { BoxProps } from "./Box.types";

const Box = styled.View<BoxProps>(({ inline }) => ({
    alignSelf: inline ? "flex-start" : "stretch",
    alignContent: "stretch",
    flexShrink: 1,
    flexDirection: "row",
}));

Box.displayName = "Box";

export { Box };
