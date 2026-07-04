import {
    formatColor,
    handleColor,
    randomColor,
    useColorInput,
    type ColorLike,
} from "@mutualzz/ui-core";
import { forwardRef, useMemo, useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { ColorPicker } from "../ColorPicker/ColorPicker";
import { IconButton } from "../IconButton/IconButton";
import { useInputRef } from "../Input/useInputRef";
import { InputBase } from "../InputBase/InputBase";
import { InputDecoratorWrapper } from "../InputDecoratorWrapper/InputDecoratorWrapper";
import { InputRoot } from "../InputRoot/InputRoot";
import { Modal } from "../Modal/Modal";
import { Paper } from "../Paper/Paper";
import { useTheme } from "../useTheme";
import {
    resolveColorPickerButtonSize,
    resolveColorPickerButtonStyles,
} from "./InputColor.helpers";
import type { InputColorProps } from "./InputColor.types";

const InputColor = forwardRef<TextInput, InputColorProps>(
    (
        {
            variant = "outlined",
            size = "md",
            color = "neutral",
            startDecorator,
            endDecorator,
            fullWidth = false,
            disabled = false,
            showColorPicker = true,
            showRandom = false,
            value: colorProp,
            defaultValue,
            allowAlpha = false,
            onChange,
            onChangeResult,
            style,
            ...inputProps
        },
        ref,
    ) => {
        const { inputRef, focusInput } = useInputRef(ref);
        const { theme } = useTheme();
        const [pickerOpen, setPickerOpen] = useState(false);
        const isControlled = colorProp != null;
        const [internalValue, setInternalValue] = useState<ColorLike>(
            defaultValue ?? randomColor("hex"),
        );
        const currentValue = isControlled ? colorProp : internalValue;

        const {
            inputValue,
            color: validatedColor,
            handleChange,
            setColorDirectly,
        } = useColorInput(currentValue, 100, "hex", false);

        const swatchStyles = useMemo(
            () => resolveColorPickerButtonStyles(theme, validatedColor).solid,
            [theme, validatedColor],
        );
        const swatchSize = useMemo(
            () => resolveColorPickerButtonSize(theme, size),
            [theme, size],
        );

        const commitColor = (next: ColorLike) => {
            const result = handleColor(next);
            setColorDirectly(result.hex);
            if (!isControlled) setInternalValue(result.hex);
            onChangeResult?.(result);
            onChange?.(next);
        };

        return (
            <InputRoot
                color={color}
                variant={variant}
                size={size}
                fullWidth={fullWidth}
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

                <InputDecoratorWrapper position="start">
                    {showColorPicker ? (
                        <Pressable
                            disabled={disabled}
                            onPress={() => setPickerOpen(true)}
                            style={[swatchSize, swatchStyles]}
                            accessibilityLabel="Open color picker"
                        />
                    ) : (
                        <View style={[swatchSize, swatchStyles]} />
                    )}
                </InputDecoratorWrapper>

                <InputBase
                    ref={inputRef}
                    value={inputValue}
                    onChangeText={(text) => {
                        handleChange(text as ColorLike);
                        try {
                            const result = handleColor(text);
                            if (!isControlled) setInternalValue(result.hex);
                            onChangeResult?.(result);
                            onChange?.(text as ColorLike);
                        } catch {
                            // ignore invalid intermediate values
                        }
                    }}
                    autoCapitalize="none"
                    autoCorrect={false}
                    size={size}
                    fullWidth={fullWidth}
                    disabled={disabled}
                    editable={!disabled}
                    {...inputProps}
                />

                <InputDecoratorWrapper position="end">
                    {showRandom ? (
                        <IconButton
                            disabled={disabled}
                            onPress={() => commitColor(randomColor("hex"))}
                            accessibilityLabel="Random color"
                        >
                            <View
                                style={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: 6,
                                    backgroundColor: formatColor(
                                        theme.typography.colors.primary,
                                    ),
                                }}
                            />
                        </IconButton>
                    ) : null}
                    {endDecorator}
                </InputDecoratorWrapper>

                <Modal
                    open={pickerOpen}
                    onClose={() => setPickerOpen(false)}
                    showCloseButton
                >
                    <Paper elevation={4} style={{ padding: 8 }}>
                        <ColorPicker
                            color={validatedColor}
                            allowAlpha={allowAlpha}
                            onChange={(next) => {
                                commitColor(next);
                            }}
                        />
                    </Paper>
                </Modal>
            </InputRoot>
        );
    },
);

InputColor.displayName = "InputColor";

export { InputColor };
