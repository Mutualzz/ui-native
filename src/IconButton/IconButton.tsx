import styled from "@emotion/native";
import type { ColorLike, Size } from "@mutualzz/ui-core";
import { resolveShapeValue, resolveSize } from "@mutualzz/ui-core";
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
import { IconSlot } from "../IconSlot/IconSlot";
import { useTheme } from "../useTheme";
import {
    resolveIconButtonContainerSize,
    resolveIconButtonContainerStyles,
    resolveIconButtonTextStyles,
} from "./IconButton.helpers";
import type { IconButtonProps } from "./IconButton.types";

const baseSizeMap: Record<Size, number> = {
    sm: 16,
    md: 20,
    lg: 24,
};

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
            expand: propExpand,
            shape: propShape,
            textColor: textColorProp,
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
        const expand = propExpand ?? group?.expand ?? false;
        const shape = propShape ?? group?.shape ?? "rounded";
        const textColor = textColorProp ?? group?.textColor;

        const selected =
            selectedProp !== undefined
                ? selectedProp
                : group?.exclusive
                  ? group?.value === value
                  : Array.isArray(group?.value) && group?.value.includes(value);

        const resolvedSize = resolveSize(theme, size, baseSizeMap);
        const resolvedPadding = resolveIconButtonContainerSize(
            theme,
            size,
            padding,
        ).padding;

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
                resolveIconButtonTextStyles(
                    theme,
                    color,
                    { disabled: isDisabled },
                    textColor,
                )[variant],
            [theme, color, isDisabled, variant, textColor],
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
                            borderRadius: resolveShapeValue(shape),
                            flexGrow: fullWidth || expand ? 1 : 0,
                            flexShrink: expand ? 1 : 0,
                            flexBasis: expand ? 0 : "auto",
                            // Explicit, not `undefined` — otherwise this
                            // inherits whatever `alignItems` the parent
                            // happens to use, and RN's own default is
                            // "stretch".
                            alignSelf: fullWidth ? "stretch" : "flex-start",
                            padding: resolvedPadding,
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
                        alignItems: "center",
                        justifyContent: "center",
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

                    <IconSlot
                        size={resolvedSize}
                        style={{ opacity: contentOpacity }}
                    >
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
                                size: children.props.size ?? resolvedSize,
                            })
                        ) : (
                            children
                        )}
                    </IconSlot>
                </View>
            </Pressable>
        );
    },
);

IconButton.displayName = "Button";

export { IconButton };
