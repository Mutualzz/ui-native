import styled from "@emotion/native";
import type { Size } from "@mutualzz/ui-core";
import { resolveSize } from "@mutualzz/ui-core";
import { forwardRef } from "react";
import { Pressable, Text, View } from "react-native";
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

const IconButtonWrapper = styled(Pressable)<IconButtonProps>(
    ({
        theme,
        color = "primary",
        variant = "plain",
        size = "md",
        disabled,
    }) => ({
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        borderRadius: "6px",
        flexShrink: 0,
        lineHeight: 1.2,
        padding: 4,
        ...(disabled && {
            opacity: 0.5,
            pointerEvents: "none",
        }),
        ...() => {
            const resolvedSize = resolveSize(theme, size, baseSizeMap);
            return {
                fontSize: resolvedSize,
                ...resolveIconButtonContainerStyles(theme, color)[variant],
            };
        },
    }),
);

IconButtonWrapper.displayName = "IconButtonWrapper";

const IconButtonContent = styled(Text)<IconButtonProps>(
    ({
        theme,
        color = "primary",
        variant = "plain",
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
        ...resolveIconButtonTextStyles(theme, color)[variant],
    }),
);

IconButtonContent.displayName = "IconButtonContent";

const SpinnerOverlay = styled(View)({
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
});

SpinnerOverlay.displayName = "SpinnerOverlay";

const IconButton = forwardRef<View, IconButtonProps>(
    (
        {
            variant = "plain",
            color = "primary",
            size = "md",
            loading,
            loadingIndicator,
            disabled,
            children,
            ...props
        },
        ref,
    ) => {
        return (
            <IconButtonWrapper
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
                <IconButtonContent
                    color={color}
                    variant={variant}
                    size={size}
                    loading={loading}
                >
                    {children}
                </IconButtonContent>
            </IconButtonWrapper>
        );
    },
);

IconButton.displayName = "IconButton";

export { IconButton };
