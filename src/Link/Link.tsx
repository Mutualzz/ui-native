import styled from "@emotion/native";
import { forwardRef } from "react";
import { Pressable, Text, type TextStyle } from "react-native";
import { DecoratorWrapper } from "../DecoratorWrapper/DecoratorWrapper";
import { resolveTypographyStyles } from "../Typography/Typography.helpers";
import { useTheme } from "../useTheme";
import type { LinkProps } from "./Link.types";

const LinkWrapper = styled(Pressable)({
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
});

const LinkText = styled(Text)<{
    underline?: "none" | "hover" | "always";
    weight?: TextStyle["fontWeight"];
}>(({ underline, weight }) => ({
    ...(underline === "always" ? { textDecorationLine: "underline" } : null),
    fontWeight: weight,
}));

const Link = forwardRef<Text, LinkProps>(
    (
        {
            level = "body-md",
            color = "primary",
            textColor = "primary",
            variant = "none",
            underline = "hover",
            weight,
            startDecorator,
            endDecorator,
            children,
            style,
            onPress,
            ...props
        },
        ref,
    ) => {
        const { theme } = useTheme();

        const typography = theme.typography.levels[level];

        const variantText = resolveTypographyStyles(theme, color, textColor)[
            variant
        ];

        return (
            <LinkWrapper
                ref={ref}
                {...props}
                onPress={onPress}
                style={style}
                accessibilityRole="link"
            >
                {startDecorator && (
                    <DecoratorWrapper>{startDecorator}</DecoratorWrapper>
                )}

                <LinkText
                    underline={underline}
                    weight={weight}
                    style={[typography as any, variantText]}
                >
                    {children}
                </LinkText>

                {endDecorator && (
                    <DecoratorWrapper>{endDecorator}</DecoratorWrapper>
                )}
            </LinkWrapper>
        );
    },
);

Link.displayName = "Link";

export { Link };
