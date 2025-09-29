import styled from "@emotion/native";
import type { Size } from "@mutualzz/ui-core";
import { resolveSize } from "@mutualzz/ui-core";
import { forwardRef } from "react";
import { Pressable, Text, View } from "react-native";
import { DecoratorWrapper } from "../DecoratorWrapper/DecoratorWrapper";
import {
    resolveButtonContainerStyles,
    resolveButtonTextStyles,
} from "./Button.helpers";
import type { ButtonProps } from "./Button.types";

const baseSizeMap: Record<Size, number> = {
    sm: 12,
    md: 14,
    lg: 16,
};

const ButtonWrapper = styled(Pressable)<ButtonProps>(({
    theme,
    color = "primary",
    variant = "solid",
    size = "md",
    disabled,
}) => {
    const resolvedSize = resolveSize(theme, size, baseSizeMap);

    return {
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        borderRadius: 6,
        flexShrink: 0,
        lineHeight: 1.2,
        ...(disabled && {
            opacity: 0.5,
            pointerEvents: "none",
        }),
        fontSize: resolvedSize,
        padding: resolvedSize * 0.6,
        ...resolveButtonContainerStyles(theme, color)[variant],
    };
});

ButtonWrapper.displayName = "ButtonWrapper";

const ButtonContent = styled(Text)<ButtonProps>(
    ({
        theme,
        color = "primary",
        variant = "solid",
        size = "md",
        loading,
    }) => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 0,
        flexShrink: 0,
        width: "auto",
        height: "100%",
        opacity: loading ? 0 : 1,
        boxSizing: "border-box",
        fontSize: resolveSize(theme, size, baseSizeMap),
        ...resolveButtonTextStyles(theme, color)[variant],
    }),
);

ButtonContent.displayName = "ButtonContent";

const SpinnerOverlay = styled(View)({
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
});

SpinnerOverlay.displayName = "SpinnerOverlay";

const Button = forwardRef<View, ButtonProps>(
    (
        {
            variant = "solid",
            color = "primary",
            size = "md",
            loading,
            loadingIndicator,
            startDecorator,
            endDecorator,
            disabled,
            children,
            ...props
        },
        ref,
    ) => {
        return (
            <ButtonWrapper
                {...props}
                ref={ref}
                variant={variant}
                color={color}
                size={size}
                disabled={loading || disabled}
                loading={loading}
            >
                {loading && (
                    <SpinnerOverlay>
                        {loadingIndicator ? (
                            loadingIndicator
                        ) : (
                            /** NOTE: For now we are gonna use a simple text as a default loading indicator
                             *  Eventually we should replace it with a proper spinner component,
                             *  when we convert the web versison to native version
                             */
                            <Text>Loading...</Text>
                        )}
                    </SpinnerOverlay>
                )}

                {startDecorator && (
                    <DecoratorWrapper position="start">
                        {startDecorator}
                    </DecoratorWrapper>
                )}
                <ButtonContent
                    color={color}
                    variant={variant}
                    size={size}
                    loading={loading}
                >
                    {children}
                </ButtonContent>
                {endDecorator && (
                    <DecoratorWrapper position="end">
                        {endDecorator}
                    </DecoratorWrapper>
                )}
            </ButtonWrapper>
        );
    },
);

Button.displayName = "Button";

export { Button };
