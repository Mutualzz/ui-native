import styled from "@emotion/native";
import { resolveShapeValue } from "@mutualzz/ui-core";
import {
    forwardRef,
    useContext,
    useMemo,
    cloneElement,
    isValidElement,
    type ReactNode,
    type ReactElement,
} from "react";
import {
    Pressable,
    Text,
    useWindowDimensions,
    type View,
    type GestureResponderEvent,
    type TextStyle,
} from "react-native";
import { ButtonGroupContext } from "../ButtonGroup/ButtonGroup.context";
import { CircularProgress } from "../CircularProgress/CircularProgress";
import { DecoratorWrapper } from "../DecoratorWrapper/DecoratorWrapper";
import { useTheme } from "../useTheme";
import {
    MAX_FONT_SCALE_MULTIPLIER,
    scaledLayoutSize,
} from "../utils/accessibility";
import {
    resolveButtonContainerSize,
    resolveButtonContainerStyles,
    resolveButtonTextStyles,
} from "./Button.helpers";
import type { ButtonProps } from "./Button.types";

interface DecoratableProps {
    color?: string;
    size?: number;
    style?: object;
}

const cloneDecorator = (
    node: ReactNode,
    textVariant: TextStyle,
    fontSize: number,
) => {
    if (!node || !isValidElement<DecoratableProps>(node)) return node;

    return cloneElement(node, {
        color: (textVariant.color as string) ?? undefined,
        size: node.props.size ?? fontSize,
        style: node.props.style,
    });
};

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
            expand: propExpand,
            shape: propShape,
            textColor: textColorProp,
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
        const { fontScale } = useWindowDimensions();
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
        const expand = propExpand ?? group?.expand ?? false;
        const shape = propShape ?? group?.shape ?? "rounded";
        const textColor = textColorProp ?? group?.textColor;

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
        const scaledPadding = scaledLayoutSize(resolvedPadding, fontScale, 1.5);
        const scaledGap = scaledLayoutSize(gap, fontScale, 1.35);
        const scaledDecoratorSize = scaledLayoutSize(fontSize, fontScale, 1.35);

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
                  : fullWidth || orientation === "vertical"
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
                resolveButtonTextStyles(
                    theme,
                    color,
                    { disabled: isDisabled },
                    textColor,
                )[variant],
            [theme, color, variant, isDisabled, textColor],
        );

        const contentOpacity = loading ? 0 : 1;
        const shouldFillSpace = fullWidth || expand;

        return (
            <Pressable
                {...props}
                ref={ref}
                accessibilityRole="button"
                accessibilityState={{ disabled: isDisabled, selected }}
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
                            borderRadius: resolveShapeValue(shape),
                            flexGrow: shouldFillSpace ? 1 : 0,
                            flexShrink: 1,
                            flexBasis: expand ? 0 : "auto",
                            alignSelf: fullWidth ? "stretch" : "flex-start",
                            width: fullWidth ? "100%" : undefined,
                            minWidth: 0,
                            padding: scaledPadding,
                            gap: scaledGap,
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
                            width: scaledDecoratorSize,
                            height: scaledDecoratorSize,
                        }}
                    >
                        {cloneDecorator(startDecorator, textVariant, fontSize)}
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
                            flexGrow: shouldFillSpace ? 1 : 0,
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
                        maxFontSizeMultiplier={MAX_FONT_SCALE_MULTIPLIER}
                    >
                        {children}
                    </Text>
                </ContentRow>

                {endDecorator && (
                    <DecoratorWrapper
                        style={{
                            width: scaledDecoratorSize,
                            height: scaledDecoratorSize,
                        }}
                    >
                        {cloneDecorator(endDecorator, textVariant, fontSize)}
                    </DecoratorWrapper>
                )}
            </Pressable>
        );
    },
);

Button.displayName = "Button";

export { Button };
