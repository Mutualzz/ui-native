import styled from "@emotion/native";
import {
    forwardRef,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    TextInput,
    View,
    type TextInputContentSizeChangeEvent,
    type TextStyle,
    type ViewStyle,
} from "react-native";
import { useTheme } from "../useTheme";

import { DecoratorWrapper } from "../DecoratorWrapper/DecoratorWrapper";
import {
    resolveTextareaInputPadding,
    resolveTextareaSize,
    resolveTextareaStyles,
} from "./Textarea.helpers";
import type { TextareaProps } from "./Textarea.types";

const TextareaRoot = styled(View)<{ disabled?: boolean }>(({ disabled }) => ({
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 8,
    minWidth: 0,
    width: "100%",
    opacity: disabled ? 0.5 : 1,
}));

const Input = styled(TextInput)({
    flex: 1,
    minWidth: 0,
    width: "100%",
    backgroundColor: "transparent",
});

export const Textarea = forwardRef<TextInput, TextareaProps>(
    (
        {
            color = "neutral",
            textColor = "primary",
            variant = "outlined",
            size = "md",
            disabled = false,
            resizable = false,
            minRows = 1,
            maxRows,
            startDecorator,
            endDecorator,
            error,
            onContentSizeChange,
            ...props
        },
        ref,
    ) => {
        const { theme } = useTheme();
        const internalRef = useRef<TextInput>(null);

        useImperativeHandle(ref, () => internalRef.current!);

        const base = useMemo(
            () => resolveTextareaSize(theme, size),
            [theme, size],
        );
        const padding = useMemo(
            () => resolveTextareaInputPadding(theme, size),
            [theme, size],
        );

        const variantStyles = useMemo(
            () =>
                resolveTextareaStyles(theme, color, textColor, error)[variant],
            [theme, color, textColor, variant, error],
        );

        const lineHeight = Math.round(base.fontSize * 1.5);

        const minHeight = Math.max(
            base.minHeight,
            minRows * lineHeight + padding.paddingVertical * 2,
        );

        const maxHeight =
            maxRows != null
                ? maxRows * lineHeight + padding.paddingVertical * 2
                : undefined;

        const [measuredHeight, setMeasuredHeight] = useState<
            number | undefined
        >(undefined);

        const handleContentSizeChange = (
            e: TextInputContentSizeChangeEvent,
        ) => {
            onContentSizeChange?.(e);

            if (resizable) return;
            const h =
                e.nativeEvent.contentSize.height + padding.paddingVertical * 2;

            let next = Math.max(minHeight, h);
            if (maxHeight != null) next = Math.min(maxHeight, next);

            setMeasuredHeight(next);
        };

        const rootStyleObj: ViewStyle = {
            ...base,
            ...variantStyles,
            paddingVertical: padding.paddingVertical,
            paddingHorizontal: padding.paddingHorizontal,
        };

        const inputStyleObj: TextStyle = {
            color: variantStyles.color ?? theme.typography.colors.primary,
            fontSize: base.fontSize,
            lineHeight,
            paddingVertical: 0,
            paddingHorizontal: 0,

            textAlignVertical: "top",

            minHeight,
            ...(maxHeight != null ? { maxHeight } : null),
            ...(measuredHeight != null ? { height: measuredHeight } : null),
        };

        return (
            <TextareaRoot style={rootStyleObj} disabled={disabled}>
                {startDecorator ?? (
                    <DecoratorWrapper>{startDecorator}</DecoratorWrapper>
                )}

                <Input
                    ref={internalRef}
                    multiline
                    editable={!disabled}
                    scrollEnabled={resizable}
                    onContentSizeChange={handleContentSizeChange}
                    placeholderTextColor={theme.typography.colors.muted}
                    style={inputStyleObj}
                    {...props}
                />

                {endDecorator ?? (
                    <DecoratorWrapper>{endDecorator}</DecoratorWrapper>
                )}
            </TextareaRoot>
        );
    },
);
