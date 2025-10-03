import styled from "@emotion/native";
import { forwardRef } from "react";
import { View } from "react-native";
import { Typography } from "../Typography/Typography";
import { useTheme } from "../useTheme";
import { resolveDividerColor, resolveDividerStyles } from "./Divider.helpers";
import type { DividerProps, DividerVariant } from "./Divider.types";

const DividerWrapper = styled(View)<{ isVertical?: boolean }>(
    ({ isVertical }) => ({
        position: "relative",
        display: "flex",
        flexDirection: isVertical ? "column" : "row",
        alignItems: "center",

        ...(isVertical
            ? {
                  width: "auto",
                  flex: 0,
                  marginHorizontal: 8,
                  marginVertical: 0,
              }
            : {
                  width: "100%",
                  marginHorizontal: 0,
                  marginVertical: 8,
              }),
    }),
);

DividerWrapper.displayName = "DividerWrapper";

const DividerLine = styled(View)<{
    isVertical: boolean;
    lineColor: string;
    variant: DividerVariant;
    grow?: boolean;
}>(({ isVertical, variant, lineColor, grow }) => ({
    flexGrow: grow ? 1 : 0,

    ...(isVertical ? { minHeight: 32 } : { minWidth: 32 }),
    ...resolveDividerStyles(isVertical, lineColor)[variant],
}));

DividerLine.displayName = "DividerLine";

const DividerText = styled(Typography)<{
    textColor: string;
    isVertical: boolean;
}>(({ theme, isVertical, textColor }) => ({
    color: textColor,
    ...(isVertical
        ? {
              paddingVertical: 8,
              paddingHorizontal: 0,
          }
        : {
              paddingVertical: 0,
              paddingHorizontal: 8,
          }),
    fontSize: theme.typography.levels["body-md"].fontSize,
}));

DividerText.displayName = "DividerText";

/**
 * Divider component for separating content.
 * It can be oriented horizontally or vertically.
 * It can also have different visual styles and colors.
 * It supports text content that can be placed in the middle of the divider.
 * The divider can be styled with different variants and colors.
 * The `inset` prop allows for controlling the placement of the text relative to the divider.
 * The `lineColor` and `textColor` props allow for customizing the colors of the divider line and text, respectively.
 * The `variant` prop allows for different visual styles of the divider.
 */
const Divider = forwardRef<View, DividerProps>(
    (
        {
            orientation = "horizontal",
            inset = "none",
            lineColor = "neutral",
            textColor = "neutral",
            variant = "solid",
            children,
            ...props
        },
        ref,
    ) => {
        const { theme } = useTheme();

        const isVertical = orientation === "vertical";

        const resolvedLineColor = resolveDividerColor(theme, lineColor);
        const resolvedTextColor = resolveDividerColor(theme, textColor);

        return (
            <DividerWrapper
                ref={ref}
                isVertical={isVertical}
                accessibilityRole="none"
                {...props}
            >
                <DividerLine
                    isVertical={isVertical}
                    lineColor={resolvedLineColor}
                    variant={variant}
                    grow={inset !== "start"}
                />

                {children && (
                    <DividerText
                        textColor={resolvedTextColor as any}
                        isVertical={isVertical}
                    >
                        {children}
                    </DividerText>
                )}

                <DividerLine
                    isVertical={isVertical}
                    lineColor={resolvedLineColor}
                    variant={variant}
                    grow={inset !== "end"}
                />
            </DividerWrapper>
        );
    },
);

Divider.displayName = "Divider";

export { Divider };
