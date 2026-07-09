import styled from "@emotion/native";
import { forwardRef } from "react";
import { Image, Text, useWindowDimensions, type View } from "react-native";
import { useTheme } from "../useTheme";
import { MAX_FONT_SCALE_MULTIPLIER } from "../utils/accessibility";
import {
    resolveAvatarShape,
    resolveAvatarSize,
    resolveAvatarStyles,
} from "./Avatar.helpers";
import type { AvatarProps } from "./Avatar.types";

const AvatarWrapper = styled.View({
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
});

const AvatarImage = styled(Image)({
    width: "100%",
    height: "100%",
});

const Avatar = forwardRef<View, AvatarProps>(
    (
        {
            src,
            alt,
            children,
            color = "neutral",
            shape = "circle",
            size = "md",
            variant = "plain",
            elevation = 1,
            style,
            ...props
        },
        ref,
    ) => {
        const { theme } = useTheme();
        const { fontScale } = useWindowDimensions();

        const hasText = !src && Boolean(children || alt);

        const { container: sizeContainer, text: sizeText } = resolveAvatarSize(
            theme,
            size,
            hasText,
        );

        const shapeStyle = resolveAvatarShape(shape);

        const { container: variantContainer, text: variantText } =
            resolveAvatarStyles(theme, color, hasText, elevation);

        const containerStyle = variantContainer[variant] ?? {};
        const resolvedTextStyle = variantText[variant] ?? {};

        const fallbackText = !src && alt ? alt.split(" ").join("") : null;

        return (
            <AvatarWrapper
                {...props}
                ref={ref}
                style={[sizeContainer, shapeStyle, containerStyle, style]}
                accessible
                accessibilityRole="image"
                accessibilityLabel={alt}
            >
                {src ? (
                    <AvatarImage
                        {...props}
                        source={{ uri: src }}
                        resizeMode="cover"
                        style={shapeStyle}
                    />
                ) : typeof children === "string" ||
                  typeof children === "number" ||
                  fallbackText ? (
                    <Text
                        style={[
                            sizeText,
                            resolvedTextStyle,
                            {
                                textAlign: "center",
                                alignItems: "center",
                                justifyContent: "center",
                            },
                        ]}
                        numberOfLines={fontScale > 1.15 ? undefined : 1}
                        maxFontSizeMultiplier={MAX_FONT_SCALE_MULTIPLIER}
                    >
                        {children ?? fallbackText}
                    </Text>
                ) : (
                    children
                )}
            </AvatarWrapper>
        );
    },
);

Avatar.displayName = "Avatar";

export { Avatar };
