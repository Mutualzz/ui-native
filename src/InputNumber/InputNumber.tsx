import { clamp, formatColor, resolveSize } from "@mutualzz/ui-core";
import { cloneElement, forwardRef, isValidElement, useState } from "react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
    Pressable,
    TextInput,
    type NativeSyntheticEvent,
    type TextInputKeyPressEventData,
} from "react-native";
import Svg, { Polyline } from "react-native-svg";
import { useInputRef } from "../Input/useInputRef";
import { InputBase } from "../InputBase/InputBase";
import { baseSizeMap, resolveInputBaseSize } from "../InputBase/InputBase.helpers";
import { InputDecoratorWrapper } from "../InputDecoratorWrapper/InputDecoratorWrapper";
import { InputRoot } from "../InputRoot/InputRoot";
import { Stack } from "../Stack/Stack";
import { resolveTypographyStyles } from "../Typography/Typography.helpers";
import { useTheme } from "../useTheme";
import type { InputNumberProps } from "./InputNumber.types";

interface DecoratableProps {
    color?: string;
    size?: number;
}

const cloneDecorator = (node: ReactNode, color: string, size: number) => {
    if (!isValidElement<DecoratableProps>(node)) return node;

    return cloneElement(node, {
        color,
        size: node.props.size ?? size,
    });
};

const SpinnerButtons = ({
    onIncrement,
    onDecrement,
    disabled,
    size = "md",
}: Pick<
    InputNumberProps,
    "onIncrement" | "onDecrement" | "disabled" | "size"
>) => {
    const { t } = useTranslation("common");
    const { theme } = useTheme();
    const resolvedSize = resolveSize(theme, size, baseSizeMap);
    const spinnerHeight = resolvedSize * 1.6;
    const spinnerWidth = resolvedSize * 1.2;
    const iconColor = formatColor(theme.typography.colors.primary);

    const buttonStyle = {
        flex: 1,
        width: "100%" as const,
        alignItems: "center" as const,
        justifyContent: "center" as const,
        backgroundColor: "transparent",
    };

    return (
        <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            height={spinnerHeight}
            width={spinnerWidth}
            flexShrink={0}
            overflow="hidden"
            borderRadius={4}
            ml={1}
        >
            <Pressable
                onPress={onIncrement}
                disabled={disabled}
                accessibilityLabel={t("a11y.increment", {
                    defaultValue: "Increment",
                })}
                style={buttonStyle}
            >
                <Svg width={12} height={12} viewBox="0 0 24 24">
                    <Polyline
                        points="18 15 12 9 6 15"
                        fill="none"
                        stroke={iconColor}
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </Svg>
            </Pressable>
            <Pressable
                onPress={onDecrement}
                disabled={disabled}
                accessibilityLabel={t("a11y.decrement", {
                    defaultValue: "Decrement",
                })}
                style={buttonStyle}
            >
                <Svg width={12} height={12} viewBox="0 0 24 24">
                    <Polyline
                        points="6 9 12 15 18 9"
                        fill="none"
                        stroke={iconColor}
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </Svg>
            </Pressable>
        </Stack>
    );
};

const InputNumber = forwardRef<TextInput, InputNumberProps>(
    (
        {
            color = "neutral",
            textColor = "inherit",
            variant = "outlined",
            size = "md",
            inputMode = "decimal",
            fullWidth = false,
            error = false,
            disabled = false,
            step = 1,
            min = -Infinity,
            max = Infinity,
            value,
            defaultValue,
            onChangeText,
            onIncrement,
            onDecrement,
            onBlur,
            startDecorator,
            endDecorator,
            children,
            style,
            ...inputProps
        },
        ref,
    ) => {
        const { inputRef, focusInput } = useInputRef(ref);
        const { theme } = useTheme();

        const isControlled = value !== undefined;
        const [internalValue, setInternalValue] = useState(defaultValue ?? "");
        const currentValue = isControlled ? value : internalValue;

        const commitValue = (next: string) => {
            if (!isControlled) setInternalValue(next);
            onChangeText?.(next);
        };

        const decoratorColor = resolveTypographyStyles(
            theme,
            color,
            textColor,
        )["none"].color as string;
        const { fontSize = 16 } = resolveInputBaseSize(theme, size);

        const clampValue = (raw: string) => {
            if (raw === "" || raw === "-" || raw === "." || raw === "-.") {
                return raw;
            }

            const parsed = parseFloat(raw);
            if (Number.isNaN(parsed)) return raw;

            const clamped = clamp(parsed, min, max);
            return String(clamped);
        };

        const handleStepChange = (direction: "up" | "down") => {
            const current = parseFloat(currentValue ?? "") || 0;
            const delta = direction === "up" ? step : -step;
            const next = clamp(current + delta, min, max);
            commitValue(String(next));
        };

        const handleOnIncrement = () => {
            onIncrement?.();
            handleStepChange("up");
        };

        const handleOnDecrement = () => {
            onDecrement?.();
            handleStepChange("down");
        };

        const handleKeyPress = (
            event: NativeSyntheticEvent<TextInputKeyPressEventData>,
        ) => {
            const { key } = event.nativeEvent;
            if (key === "ArrowUp") {
                handleStepChange("up");
                return;
            }
            if (key === "ArrowDown") {
                handleStepChange("down");
            }
        };

        return (
            <InputRoot
                color={color}
                textColor={textColor}
                variant={variant}
                size={size}
                fullWidth={fullWidth}
                error={error}
                disabled={disabled}
                accessibilityState={{ disabled }}
                style={style}
                onPress={() => {
                    if (!disabled) {
                        focusInput();
                    }
                }}
            >
                {startDecorator ? (
                    <InputDecoratorWrapper position="start">
                        {cloneDecorator(startDecorator, decoratorColor, fontSize)}
                    </InputDecoratorWrapper>
                ) : null}

                <InputBase
                    ref={inputRef}
                    value={currentValue}
                    onChangeText={commitValue}
                    keyboardType={
                        inputMode === "numeric" ? "number-pad" : "decimal-pad"
                    }
                    onBlur={(event) => {
                        const raw = currentValue ?? "";
                        const next = clampValue(raw);
                        if (next !== raw) {
                            commitValue(next);
                        }
                        onBlur?.(event);
                    }}
                    onKeyPress={handleKeyPress}
                    size={size}
                    fullWidth={fullWidth}
                    disabled={disabled}
                    editable={!disabled}
                    {...inputProps}
                />

                <InputDecoratorWrapper position="end">
                    {endDecorator ? (
                        cloneDecorator(endDecorator, decoratorColor, fontSize)
                    ) : (
                        <SpinnerButtons
                            size={size}
                            onIncrement={handleOnIncrement}
                            onDecrement={handleOnDecrement}
                            disabled={disabled}
                        />
                    )}
                </InputDecoratorWrapper>
            </InputRoot>
        );
    },
);

InputNumber.displayName = "InputNumber";

export { InputNumber };
