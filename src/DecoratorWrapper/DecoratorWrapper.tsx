import styled from "@emotion/native";
import type { ComponentType } from "react";
import type { ViewProps } from "react-native";

const DecoratorWrapper = styled.View({
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    flexShrink: 0,
    overflow: "visible",
}) as ComponentType<ViewProps>;

DecoratorWrapper.displayName = "DecoratorWrapper";

export { DecoratorWrapper };
