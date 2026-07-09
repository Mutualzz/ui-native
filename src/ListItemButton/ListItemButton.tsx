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
import { Pressable, useWindowDimensions } from "react-native";
import { DecoratorWrapper } from "../DecoratorWrapper/DecoratorWrapper";
import { ListContext } from "../List/List.context";
import { NestedListContext } from "../List/NestedList.context";
import {
    resolveListItemButtonContainerStyles,
    resolveListItemButtonSize,
} from "./ListItemButton.helpers";
import type { ListItemButtonProps } from "./ListItemButton.types";

const Root = styled(Pressable)<{
    size: Size | SizeValue | number;
    color: Color | ColorLike;
    variant: Variant;
    $fontScale: number;
}>(({ theme, size, color, variant, $fontScale }) => ({
    width: "100%",
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 0,
    gap: 4,

    ...resolveListItemButtonSize(theme, size, $fontScale),
    ...resolveListItemButtonContainerStyles(theme, color)[variant],
}));

const Content = styled.View({
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "auto",
    minWidth: 0,
    opacity: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
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
        const { fontScale } = useWindowDimensions();

        const { color, size, variant } = useContext(ListContext);

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
                $fontScale={fontScale}
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
