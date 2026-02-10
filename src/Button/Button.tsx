import styled from "@emotion/native";
import { forwardRef, useContext, useMemo } from "react";
import {
    Pressable,
    Text,
    type View,
    type GestureResponderEvent,
} from "react-native";
import { ButtonGroupContext } from "../ButtonGroup/ButtonGroup.context";
import { CircularProgress } from "../CircularProgress/CircularProgress";
import { DecoratorWrapper } from "../DecoratorWrapper/DecoratorWrapper";
import { useTheme } from "../useTheme";
import {
    resolveButtonContainerSize,
    resolveButtonContainerStyles,
    resolveButtonTextStyles,
} from "./Button.helpers";
import type { ButtonProps } from "./Button.types";

const ContentRow = styled.View({
    minWidth: 0,
});

const SpinnerOverlay = styled.View({
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
});

const Button = forwardRef<View, ButtonProps>(
    (
        {
            variant: propVariant,
            color: propColor,
            size: propSize,
            loading: propLoading,
            verticalAlign: propVerticalAlign,
            horizontalAlign: propHorizontalAlign,
            loadingIndicator,
            startDecorator,
            endDecorator,
            disabled: propDisabled,
            padding,
            fullWidth: propFullWidth,
            children,
            orientation,
            style,
            selected: selectedProp,
            onPress: onPressProp,

            value,
            ...props
        },
        ref,
    ) => {
        const { theme } = useTheme();
        const group = useContext(ButtonGroupContext);

        const variant = propVariant ?? group?.variant ?? "solid";
        const color = propColor ?? group?.color ?? "primary";
        const size = propSize ?? group?.size ?? "md";
        const verticalAlign =
            propVerticalAlign ?? group?.verticalAlign ?? "center";
        const horizontalAlign =
            propHorizontalAlign ?? group?.horizontalAlign ?? "center";
        const loading = propLoading ?? group?.loading ?? false;
        const disabled = propDisabled ?? group?.disabled ?? false;
        const fullWidth = propFullWidth ?? group?.fullWidth ?? false;

        const selected =
            selectedProp !== undefined
                ? selectedProp
                : group?.exclusive
                  ? group?.value === value
                  : Array.isArray(group?.value) && group?.value.includes(value);

        const {
            padding: resolvedPadding,
            gap,
            fontSize,
        } = resolveButtonContainerSize(theme, size, padding);

        const alignItems =
            verticalAlign === "top"
                ? "flex-start"
                : verticalAlign === "bottom"
                  ? "flex-end"
                  : "center";

        const justifyContent =
            horizontalAlign === "left"
                ? "flex-start"
                : horizontalAlign === "right"
                  ? "flex-end"
                  : orientation === "vertical"
                    ? "center"
                    : "space-between";

        const handlePress = (e: GestureResponderEvent) => {
            if (group?.toggleable && group?.onChange && value !== undefined) {
                if (group.exclusive) {
                    group.onChange(value);
                } else {
                    const arr = Array.isArray(group.value) ? group.value : [];
                    const exists = arr.includes(value);
                    const newArr = exists
                        ? arr.filter((v) => v !== value)
                        : [...arr, value];
                    group.onChange(newArr);
                }
            }

            onPressProp?.(e);
        };

        const isDisabled = Boolean(loading || disabled);

        const textVariant = useMemo(
            () =>
                resolveButtonTextStyles(theme, color, {
                    disabled: isDisabled,
                })[variant],
            [theme, isDisabled],
        );

        const contentOpacity = loading ? 0 : 1;

        return (
            <Pressable
                {...props}
                ref={ref}
                accessibilityRole="button"
                disabled={isDisabled}
                onPress={handlePress}
                style={({ pressed }) => {
                    const resolvedStyle =
                        typeof style === "function"
                            ? style({ pressed })
                            : style;

                    const containerVariant = resolveButtonContainerStyles(
                        theme,
                        color,
                        {
                            disabled: isDisabled,
                            selected,
                            pressed,
                        },
                    )[variant];

                    return [
                        containerVariant,
                        resolvedStyle,
                        {
                            position: "relative",
                            flexDirection:
                                orientation === "vertical" ? "column" : "row",
                            alignItems,
                            justifyContent,
                            borderRadius: 6,
                            flexShrink: 0,
                            flexGrow: fullWidth ? 1 : 0,
                            alignSelf: fullWidth ? "stretch" : undefined,
                            width: fullWidth ? "100%" : undefined,
                            padding: resolvedPadding,
                            gap,
                        },
                    ];
                }}
            >
                {loading && (
                    <SpinnerOverlay>
                        {loadingIndicator ? (
                            loadingIndicator
                        ) : (
                            <CircularProgress
                                variant={
                                    variant === "solid" || variant === "soft"
                                        ? "plain"
                                        : "soft"
                                }
                                color={color}
                                size="sm"
                            />
                        )}
                    </SpinnerOverlay>
                )}

                {startDecorator && (
                    <DecoratorWrapper
                        style={{
                            color: textVariant.color,
                            fontSize,
                        }}
                    >
                        {startDecorator}
                    </DecoratorWrapper>
                )}

                <ContentRow
                    style={[
                        {
                            opacity: contentOpacity,
                            flexDirection:
                                orientation === "vertical" ? "column" : "row",
                            justifyContent:
                                justifyContent === "space-between"
                                    ? "center"
                                    : justifyContent,
                            alignItems,
                            flexGrow: 1,
                            flexShrink: 1,
                            flexBasis: "auto",
                        },
                    ]}
                >
                    <Text
                        style={[
                            {
                                fontSize,
                                textAlign:
                                    horizontalAlign === "left"
                                        ? "left"
                                        : horizontalAlign === "right"
                                          ? "right"
                                          : "center",
                            },
                            textVariant,
                        ]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {children}
                    </Text>
                </ContentRow>

                {endDecorator && (
                    <DecoratorWrapper
                        style={{
                            color: textVariant.color,
                            fontSize,
                        }}
                    >
                        {endDecorator}
                    </DecoratorWrapper>
                )}
            </Pressable>
        );
    },
);

Button.displayName = "Button";

export { Button };
