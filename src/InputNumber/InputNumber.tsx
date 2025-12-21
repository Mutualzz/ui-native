import { clamp, formatColor, resolveSize } from "@mutualzz/ui-core";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import Svg, { Polyline } from "react-native-svg";
import { InputBase } from "../InputBase/InputBase";
import { baseSizeMap } from "../InputBase/InputBase.helpers";
import { InputDecoratorWrapper } from "../InputDecoratorWrapper/InputDecoratorWrapper";
import { InputRoot } from "../InputRoot/InputRoot";
import { useTheme } from "../useTheme";
import type { InputNumberProps } from "./InputNumber.types";

const iconSizeMap: Record<string, number> = {
    sm: 18,
    md: 20,
    lg: 24,
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
    const { theme } = useTheme();

    const resolvedSize = resolveSize(theme, size, baseSizeMap);

    const spinnerHeight = resolvedSize * 1.6;
    const spinnerWidth = resolvedSize * 1.2;
    const iconSize = iconSizeMap[size as keyof typeof iconSizeMap] ?? 20;

    const hoverBg = formatColor(theme.colors.surface, { format: "hexa" });

    return (
        <View
            style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: spinnerHeight,
                width: spinnerWidth,
                flexShrink: 0,
                overflow: "hidden",
                borderRadius: 4,
                marginLeft: 4,
            }}
        >
            <Pressable
                onPress={onIncrement}
                disabled={disabled}
                accessibilityRole="button"
                accessibilityLabel="Increment"
                style={({ pressed }) => [
                    {
                        alignItems: "center",
                        justifyContent: "center",
                        height: "50%",
                        width: "100%",
                        backgroundColor:
                            pressed && !disabled ? hoverBg : "transparent",
                        opacity: disabled ? 0.5 : 1,
                    },
                ]}
            >
                <Svg
                    width={iconSize}
                    height={iconSize}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <Polyline points="18 15 12 9 6 15" />
                </Svg>
            </Pressable>

            <Pressable
                onPress={onDecrement}
                disabled={disabled}
                accessibilityRole="button"
                accessibilityLabel="Decrement"
                style={({ pressed }) => [
                    {
                        alignItems: "center",
                        justifyContent: "center",
                        height: "50%",
                        width: "100%",
                        backgroundColor:
                            pressed && !disabled ? hoverBg : "transparent",
                        opacity: disabled ? 0.5 : 1,
                    },
                ]}
            >
                <Svg
                    width={iconSize}
                    height={iconSize}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <Polyline points="6 9 12 15 18 9" />
                </Svg>
            </Pressable>
        </View>
    );
};

SpinnerButtons.displayName = "SpinnerButtons";

const InputNumber = forwardRef<TextInput, InputNumberProps>(
    (
        {
            color = "neutral",
            textColor = "primary",
            variant = "outlined",
            size = "md",
            inputMode = "decimal",
            fullWidth = false,
            error = false,
            disabled = false,
            step = 1,
            min = -Infinity,
            max = Infinity,
            onChange,
            onIncrement,
            onDecrement,
            startDecorator,
            endDecorator,
            value: controlledValue,
            defaultValue,
            ...props
        },
        ref,
    ) => {
        const inputRef = useRef<TextInput>(null);
        useImperativeHandle(ref, () => inputRef.current!);

        const isControlled = controlledValue !== undefined;
        const [uncontrolled, setUncontrolled] = useState(defaultValue ?? "");

        const value = isControlled ? controlledValue! : uncontrolled;

        const setValue = (next: string) => {
            if (!isControlled) setUncontrolled(next);
            onChange?.(next);
        };

        const clampIfValid = (raw: string) => {
            if (raw === "" || raw === "-" || raw === "." || raw === "-.")
                return raw;

            const parsed = parseFloat(raw);
            if (Number.isNaN(parsed)) return raw;

            const clamped = clamp(parsed, min, max);
            return String(clamped);
        };

        const handleBlur = () => {
            const next = clampIfValid(value);
            if (next !== value) setValue(next);
        };

        const handleChangeText = (text: string) => {
            const trimmed = text.trim();

            if (!/^-?\d*\.?\d*$/.test(trimmed)) return;

            const parsed = parseFloat(trimmed);
            if (
                trimmed !== "" &&
                trimmed !== "-" &&
                trimmed !== "." &&
                trimmed !== "-."
            ) {
                if (
                    !Number.isNaN(parsed) &&
                    (parsed < min || parsed > max || !Number.isFinite(parsed))
                ) {
                    setValue(String(clamp(parsed, min, max)));
                    return;
                }
            }

            setValue(trimmed);
        };

        const stepChange = (direction: "up" | "down") => {
            const current = parseFloat(value) || 0;
            const delta = direction === "up" ? step : -step;
            const next = clamp(current + delta, min, max);
            setValue(String(next));
        };

        const handleOnIncrement = () => {
            onIncrement?.();
            stepChange("up");
        };

        const handleOnDecrement = () => {
            onDecrement?.();
            stepChange("down");
        };

        const keyboardType =
            inputMode === "numeric" ? "numeric" : "decimal-pad";

        return (
            <InputRoot
                color={color}
                textColor={textColor}
                variant={variant}
                size={size}
                fullWidth={fullWidth}
                error={error}
                disabled={disabled}
                {...props}
            >
                {startDecorator ? (
                    <InputDecoratorWrapper>
                        {startDecorator}
                    </InputDecoratorWrapper>
                ) : null}

                <InputBase
                    ref={inputRef}
                    {...props}
                    value={value}
                    onChangeText={handleChangeText}
                    onBlur={handleBlur}
                    editable={!disabled}
                    keyboardType={keyboardType}
                    onKeyPress={(e) => {
                        const k = e.nativeEvent.key;
                        if (k === "ArrowUp") stepChange("up");
                        if (k === "ArrowDown") stepChange("down");
                    }}
                    size={size}
                    fullWidth={fullWidth}
                />

                <InputDecoratorWrapper>
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
