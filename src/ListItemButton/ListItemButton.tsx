import styled from "@emotion/native";
import type {
    Color,
    ColorLike,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import { forwardRef, useContext } from "react";
import type { View } from "react-native";
import { Pressable } from "react-native";
import { DecoratorWrapper } from "../DecoratorWrapper/DecoratorWrapper";
import { ListContext } from "../List/List.context";
import { NestedListContext } from "../List/NestedList.context";
import { useTheme } from "../useTheme";
import {
    resolveListItemButtonContainerStyles,
    resolveListItemButtonSize,
} from "./ListItemButton.helpers";
import type { ListItemButtonProps } from "./ListItemButton.types";

const Root = styled(Pressable)<{
    size: Size | SizeValue | number;
    color: Color | ColorLike;
    variant: Variant;
}>(({ theme, size, color, variant }) => ({
    width: "100%",
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 0,
    gap: 4,

    ...resolveListItemButtonSize(theme, size),
    ...resolveListItemButtonContainerStyles(theme, color)[variant],
}));

const Content = styled.View({
    flexGrow: 0,
    flexShrink: 0,
    width: "auto",
    height: "100%",
    opacity: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
});

const ListItemButton = forwardRef<View, ListItemButtonProps>(
    (
        {
            children,
            startDecorator,
            endDecorator,
            color: colorOverride,
            size: sizeOverride,
            variant: variantOverride,
            style,
            onPress,
            disabled,
            ...rest
        },
        ref,
    ) => {
        useContext(NestedListContext);

        const { color, size, variant } = useContext(ListContext);
        const { theme } = useTheme();

        const resolvedColor = colorOverride ?? color ?? "primary";
        const resolvedVariant = variantOverride ?? variant ?? "solid";
        const resolvedSize = sizeOverride ?? size ?? "md";

        return (
            <Root
                ref={ref}
                {...rest}
                size={resolvedSize}
                color={resolvedColor}
                variant={resolvedVariant}
                disabled={disabled}
                onPress={(e) => {
                    onPress?.(e);
                }}
                style={({ pressed }) => {
                    const resolvedStyle =
                        typeof style === "function"
                            ? style({ pressed })
                            : style;

                    return [
                        {
                            opacity: disabled ? 0.5 : 1,
                        },
                        pressed && !disabled ? { opacity: 0.85 } : null,
                        resolvedStyle,
                    ];
                }}
                accessibilityRole="button"
            >
                {(pressableState) => (
                    <>
                        {startDecorator && (
                            <DecoratorWrapper>
                                {startDecorator}
                            </DecoratorWrapper>
                        )}

                        <Content>
                            {typeof children === "function"
                                ? children(pressableState)
                                : children}
                        </Content>

                        {endDecorator && (
                            <DecoratorWrapper>{endDecorator}</DecoratorWrapper>
                        )}
                    </>
                )}
            </Root>
        );
    },
);

ListItemButton.displayName = "ListItemButton";

export { ListItemButton };
