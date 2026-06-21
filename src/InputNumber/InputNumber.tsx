import {
    clamp,
    formatColor,
    resolveSize,
} from "@mutualzz/ui-core";
import { forwardRef } from "react";
import {
    Pressable,
    TextInput,
    type NativeSyntheticEvent,
    type TextInputKeyPressEventData,
} from "react-native";
import Svg, { Polyline } from "react-native-svg";
import { useInputRef } from "../Input/useInputRef";
import { InputBase } from "../InputBase/InputBase";
import { baseSizeMap } from "../InputBase/InputBase.helpers";
import { InputDecoratorWrapper } from "../InputDecoratorWrapper/InputDecoratorWrapper";
import { InputRoot } from "../InputRoot/InputRoot";
import { Stack } from "../Stack/Stack";
import { useTheme } from "../useTheme";
import type { InputNumberProps } from "./InputNumber.types";

const SpinnerButtons = ({
    onIncrement,
    onDecrement,
    disabled,
    size = "md",
}: Pick<
    InputNumberProps,
    "onIncrement" | "onDecrement" | "disabled" | "size"
>) => {
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
                accessibilityLabel="Increment"
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
                accessibilityLabel="Decrement"
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

        const clampValue = (raw: string) => {
            if (
                raw === "" ||
                raw === "-" ||
                raw === "." ||
                raw === "-."
            ) {
                return raw;
            }

            const parsed = parseFloat(raw);
            if (Number.isNaN(parsed)) return raw;

            const clamped = clamp(parsed, min, max);
            return String(clamped);
        };

        const handleStepChange = (direction: "up" | "down") => {
            const current = parseFloat(value ?? "") || 0;
            const delta = direction === "up" ? step : -step;
            const next = clamp(current + delta, min, max);
            onChangeText?.(String(next));
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
                style={style}
                onPress={() => {
                    if (!disabled) {
                        focusInput();
                    }
                }}
            >
                {startDecorator ? (
                    <InputDecoratorWrapper position="start">
                        {startDecorator}
                    </InputDecoratorWrapper>
                ) : null}

                <InputBase
                    ref={inputRef}
                    value={value}
                    defaultValue={defaultValue}
                    onChangeText={onChangeText}
                    keyboardType={
                        inputMode === "numeric" ? "number-pad" : "decimal-pad"
                    }
                    onBlur={(event) => {
                        const raw = value ?? "";
                        const next = clampValue(raw);
                        if (next !== raw) {
                            onChangeText?.(next);
                        }
                        onBlur?.(event);
                    }}
                    onKeyPress={handleKeyPress}
                    size={size}
                    fullWidth={fullWidth}
                    disabled={disabled}
                    {...inputProps}
                />

                <InputDecoratorWrapper position="end">
                    {endDecorator ?? (
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
