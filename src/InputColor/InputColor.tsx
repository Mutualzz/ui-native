import {
    constructLinearGradient,
    extractGradientInfo,
    handleColor,
    isValidGradient,
    randomColor,
    useColorInput,
    type ColorLike,
    type ColorResult,
    type HsvaColor,
} from "@mutualzz/ui-core";
import {
    cloneElement,
    forwardRef,
    isValidElement,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { DiceFiveIcon } from "phosphor-react-native";
import { Pressable, type TextInput, View } from "react-native";
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
    toGradientStops,
} from "./InputColor.helpers";
import { COLOR_PICKER_WIDTH } from "../ColorPicker/ColorPicker.helpers";
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
            allowGradient = false,
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
        const { t } = useTranslation("common");
        const { inputRef, focusInput } = useInputRef(ref);
        const { theme } = useTheme();

        const decoratorColor = resolveTypographyStyles(theme, color, textColor)[
            "none"
        ].color as string;
        const mutedDecoratorColor = resolveTypographyStyles(
            theme,
            color,
            "muted",
        )["none"].color as string;
        const { fontSize = 16 } = resolveInputBaseSize(theme, size);

        const [pickerOpen, setPickerOpen] = useState(false);
        const isControlled = colorProp != null;
        const [internalValue, setInternalValue] = useState<ColorLike>(
            defaultValue ?? randomColor("hex"),
        );
        const [gradientRotation, setGradientRotation] = useState(() => {
            const initial = colorProp ?? defaultValue;
            if (typeof initial === "string" && isValidGradient(initial)) {
                return extractGradientInfo(initial)?.angle ?? 90;
            }
            return 90;
        });
        const [focusedStop, setFocusedStop] = useState(0);

        const currentValue = isControlled ? colorProp : internalValue;

        const syncGradientAngle = useCallback((value: ColorLike) => {
            if (typeof value !== "string" || !isValidGradient(value)) return;
            const angle = extractGradientInfo(value)?.angle;
            if (angle != null) setGradientRotation(angle);
        }, []);

        const {
            inputValue,
            color: validatedColor,
            handleChange,
            setColorDirectly,
        } = useColorInput(currentValue, 100, "hex", allowGradient);

        const [pickerColor, setPickerColor] = useState<HsvaColor | HsvaColor[]>(
            () => {
                try {
                    if (Array.isArray(currentValue)) {
                        return currentValue.map((c) => handleColor(c).hsva);
                    }
                    return toGradientStops(currentValue);
                } catch {
                    return handleColor(randomColor("hsv")).hsva;
                }
            },
        );

        const colorForPicker =
            typeof currentValue === "string" && isValidGradient(currentValue)
                ? currentValue
                : pickerColor;

        useEffect(() => {
            if (!isControlled) return;

            try {
                if (isValidGradient(currentValue)) {
                    const stops = toGradientStops(currentValue);
                    const stop = focusedStop ?? 0;
                    setColorDirectly(handleColor(stops[stop]).hex);
                    setPickerColor(stops);
                    syncGradientAngle(currentValue);
                    return;
                }

                const hex = handleColor(currentValue).hex;
                setColorDirectly(hex);
                setPickerColor(handleColor(currentValue).hsva);
            } catch {
                // ignore invalid controlled values
            }
        }, [colorProp, focusedStop, isControlled, syncGradientAngle]);

        const handleNewColor = useCallback(
            (
                newColor: ColorResult | ColorResult[] | ColorLike,
                stop?: number,
            ) => {
                if (typeof newColor === "string") {
                    try {
                        if (isValidGradient(newColor)) {
                            const stops = toGradientStops(newColor);
                            const activeStop = stop ?? focusedStop ?? 0;
                            setPickerColor(stops);
                            setColorDirectly(
                                handleColor(stops[activeStop] ?? stops[0]).hex,
                            );
                            setFocusedStop(activeStop);
                            syncGradientAngle(newColor);
                            if (!isControlled) setInternalValue(newColor);
                            onChange?.(newColor);
                            return;
                        }

                        const result = handleColor(newColor);
                        setColorDirectly(result.hex);
                        setPickerColor(result.hsva);
                        if (!isControlled) setInternalValue(newColor);
                        onChangeResult?.(result);
                        onChange?.(newColor);
                        return;
                    } catch {
                        return;
                    }
                }

                if (Array.isArray(newColor)) {
                    const finalStop = stop ?? 0;
                    setColorDirectly(newColor[finalStop].hex);
                    setPickerColor(newColor.map((c) => c.hsva));
                    setFocusedStop(finalStop);

                    if (!isControlled) {
                        setInternalValue(
                            newColor.length > 1
                                ? constructLinearGradient(
                                      gradientRotation,
                                      newColor.map((c, i, arr) => ({
                                          color: c.hex,
                                          position:
                                              (i / (arr.length - 1)) * 100,
                                      })),
                                  )
                                : newColor[0].hex,
                        );
                    }

                    onChangeResult?.(newColor[finalStop]);
                    if (newColor.length > 1) {
                        onChange?.(
                            constructLinearGradient(
                                gradientRotation,
                                newColor.map((c, i, arr) => ({
                                    color: c.hex,
                                    position: (i / (arr.length - 1)) * 100,
                                })),
                            ),
                        );
                    } else {
                        onChange?.(newColor[0].hex);
                    }
                    return;
                }

                setColorDirectly(newColor.hex);
                setPickerColor(newColor.hsva);
                if (!isControlled) setInternalValue(newColor.hex);
                onChangeResult?.(newColor);
                onChange?.(newColor.hex);
            },
            [
                focusedStop,
                gradientRotation,
                isControlled,
                onChange,
                onChangeResult,
                setColorDirectly,
                syncGradientAngle,
            ],
        );

        const swatchStyles = useMemo(
            () => resolveColorPickerButtonStyles(theme, validatedColor).solid,
            [theme, validatedColor],
        );
        const swatchSize = useMemo(
            () => resolveColorPickerButtonSize(theme, size),
            [theme, size],
        );

        const handleRotationChange = (rotation: number) => {
            setGradientRotation(rotation);
        };

        const handleRandomColor = () => {
            const next = allowGradient
                ? randomColor("linear-gradient")
                : randomColor("hex");
            try {
                if (isValidGradient(next)) {
                    const stops = toGradientStops(next);
                    setPickerColor(stops);
                    setColorDirectly(handleColor(stops[0]).hex);
                    syncGradientAngle(next);
                } else {
                    const result = handleColor(next);
                    setPickerColor(result.hsva);
                    setColorDirectly(result.hex);
                }
                if (!isControlled) setInternalValue(next);
                onChange?.(next);
            } catch {
                // ignore
            }
        };

        return (
            <>
                <InputRoot
                    color={color}
                    textColor={textColor}
                    variant={variant}
                    size={size}
                    fullWidth={fullWidth}
                    disabled={disabled}
                    style={style}
                    onPress={() => {
                        if (!disabled) focusInput();
                    }}
                >
                    {startDecorator ? (
                        <InputDecoratorWrapper position="start">
                            {cloneDecorator(
                                startDecorator,
                                decoratorColor,
                                fontSize,
                            )}
                        </InputDecoratorWrapper>
                    ) : null}

                    <InputDecoratorWrapper position="start">
                        {showColorPicker ? (
                            <Pressable
                                disabled={disabled}
                                onPress={() => setPickerOpen(true)}
                                style={[swatchSize, swatchStyles]}
                                accessibilityLabel={t("a11y.openColorPicker", {
                                    defaultValue: "Open color picker",
                                })}
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
                                if (!isControlled)
                                    setInternalValue(text as ColorLike);
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
                                variant="plain"
                                color="neutral"
                                size="sm"
                                padding={2}
                                disabled={disabled}
                                onPress={handleRandomColor}
                                accessibilityLabel={t("a11y.randomColor", {
                                    defaultValue: "Random color",
                                })}
                                accessibilityHint={t("a11y.randomColorHint", {
                                    defaultValue: "Picks a random color",
                                })}
                            >
                                <DiceFiveIcon
                                    size={Math.min(14, fontSize)}
                                    color={mutedDecoratorColor}
                                />
                            </IconButton>
                        ) : null}
                        {cloneDecorator(endDecorator, decoratorColor, fontSize)}
                    </InputDecoratorWrapper>
                </InputRoot>

                <Modal
                    open={pickerOpen}
                    onClose={() => setPickerOpen(false)}
                    showCloseButton
                >
                    <Paper
                        elevation={4}
                        style={{
                            padding: 12,
                            alignSelf: "center",
                            width: COLOR_PICKER_WIDTH + 24,
                            flexShrink: 0,
                        }}
                    >
                        <ColorPicker
                            color={colorForPicker}
                            allowAlpha={allowAlpha}
                            allowGradient={allowGradient}
                            rotation={gradientRotation}
                            onRotationChange={handleRotationChange}
                            currentStop={focusedStop}
                            onStopChange={setFocusedStop}
                            onChange={handleNewColor}
                        />
                    </Paper>
                </Modal>
            </>
        );
    },
);

InputColor.displayName = "InputColor";

export { InputColor };
