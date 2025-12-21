import styled from "@emotion/native";
import type { ColorLike, Size } from "@mutualzz/ui-core";
import { resolveSize } from "@mutualzz/ui-core";
import {
    cloneElement,
    forwardRef,
    isValidElement,
    useContext,
    useMemo,
} from "react";
import { Pressable, View, type GestureResponderEvent } from "react-native";
import { ButtonGroupContext } from "../ButtonGroup/ButtonGroup.context";
import { CircularProgress } from "../CircularProgress/CircularProgress";
import { useTheme } from "../useTheme";
import {
    resolveIconButtonContainerStyles,
    resolveIconButtonTextStyles,
} from "./IconButton.helpers";
import type { IconButtonProps } from "./IconButton.types";

const baseSizeMap: Record<Size, number> = {
    sm: 16,
    md: 20,
    lg: 24,
};

const ContentRow = styled.View({
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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

const ButtonText = styled.Text();

const IconButton = forwardRef<View, IconButtonProps>(
    (
        {
            variant: propVariant,
            color: propColor,
            size: propSize,
            loading: propLoading,
            loadingIndicator,
            disabled: propDisabled,
            padding,
            fullWidth: propFullWidth,
            children,
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
        const loading = propLoading ?? group?.loading ?? false;
        const disabled = propDisabled ?? group?.disabled ?? false;
        const fullWidth = propFullWidth ?? group?.fullWidth ?? false;

        const selected =
            selectedProp !== undefined
                ? selectedProp
                : group?.exclusive
                  ? group?.value === value
                  : Array.isArray(group?.value) && group?.value.includes(value);

        const resolvedSize = resolveSize(theme, size, baseSizeMap);

        const handlePress = (e: GestureResponderEvent) => {
            if (group?.toggleable && group?.onChange && value !== undefined) {
                if (group.exclusive) {
                    group.onChange(value);
                    1;
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
                resolveIconButtonTextStyles(theme, color, {
                    disabled: isDisabled,
                })[variant],
            [theme, color, isDisabled, variant],
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

                    const containerVariant = resolveIconButtonContainerStyles(
                        theme,
                        color,
                        {
                            disabled: isDisabled,
                            selected,
                            pressed,
                        },
                    )[variant];

                    return [
                        {
                            position: "relative",
                            flexDirection: "row",
                            borderRadius: 6,
                            flexShrink: 0,
                            flexGrow: fullWidth ? 1 : 0,
                            alignSelf: fullWidth ? "stretch" : undefined,
                            padding,
                            fontSize: resolvedSize,
                            justifyContent: "center",
                            alignItems: "center",
                        },
                        containerVariant,
                        resolvedStyle,
                    ];
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        minWidth: 0,
                    }}
                >
                    {loading && (
                        <SpinnerOverlay>
                            {loadingIndicator ? (
                                loadingIndicator
                            ) : (
                                <CircularProgress
                                    variant={
                                        variant === "solid" ||
                                        variant === "soft"
                                            ? "plain"
                                            : "soft"
                                    }
                                    color={color}
                                    size="sm"
                                />
                            )}
                        </SpinnerOverlay>
                    )}

                    <ContentRow style={{ opacity: contentOpacity }}>
                        {typeof children === "string" ? (
                            <ButtonText
                                style={[
                                    {
                                        fontSize: resolvedSize,
                                    },
                                    textVariant,
                                ]}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                {children}
                            </ButtonText>
                        ) : isValidElement<IconButtonProps>(children) ? (
                            cloneElement(children, {
                                color:
                                    (textVariant?.color as ColorLike) ??
                                    undefined,
                                size: resolvedSize,
                                style: [
                                    {
                                        fontSize: resolvedSize,
                                        color: textVariant?.color,
                                    },
                                    children.props.style as any,
                                ],
                            })
                        ) : (
                            children
                        )}
                    </ContentRow>
                </View>
            </Pressable>
        );
    },
);

IconButton.displayName = "Button";

export { IconButton };
