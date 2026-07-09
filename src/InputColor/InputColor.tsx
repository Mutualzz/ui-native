import {
    formatColor,
    handleColor,
    randomColor,
    useColorInput,
    type ColorLike,
} from "@mutualzz/ui-core";
import {
    cloneElement,
    forwardRef,
    isValidElement,
    useEffect,
    useMemo,
    useState,
} from "react";
import type { ReactNode } from "react";
import { Pressable, TextInput, View } from "react-native";
import { ColorPicker } from "../ColorPicker/ColorPicker";
import { IconButton } from "../IconButton/IconButton";
import { useInputRef } from "../Input/useInputRef";
import { InputBase } from "../InputBase/InputBase";
import { resolveInputBaseSize } from "../InputBase/InputBase.helpers";
import { InputDecoratorWrapper } from "../InputDecoratorWrapper/InputDecoratorWrapper";
import { InputRoot } from "../InputRoot/InputRoot";
import { Modal } from "../Modal/Modal";
import { Paper } from "../Paper/Paper";
import { resolveTypographyStyles } from "../Typography/Typography.helpers";
import { useTheme } from "../useTheme";
import {
    resolveColorPickerButtonSize,
    resolveColorPickerButtonStyles,
} from "./InputColor.helpers";
import type { InputColorProps } from "./InputColor.types";

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

const InputColor = forwardRef<TextInput, InputColorProps>(
    (
        {
            variant = "outlined",
            size = "md",
            color = "neutral",
            textColor = "primary",
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

        const decoratorColor = resolveTypographyStyles(
            theme,
            color,
            textColor,
        )["none"].color as string;
        const { fontSize = 16 } = resolveInputBaseSize(theme, size);

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

        useEffect(() => {
            if (!isControlled) return;
            try {
                setColorDirectly(handleColor(colorProp).hex);
            } catch {
                // ignore invalid controlled value
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [isControlled, colorProp]);

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
                textColor={textColor}
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
                        {cloneDecorator(startDecorator, decoratorColor, fontSize)}
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
                    {cloneDecorator(endDecorator, decoratorColor, fontSize)}
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
