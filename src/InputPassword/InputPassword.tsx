import { resolveSize } from "@mutualzz/ui-core";
import { forwardRef, useCallback, useEffect, useMemo, useState } from "react";
import type { TextInput } from "react-native";
import { Pressable } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { InputBase } from "../InputBase/InputBase";
import { InputDecoratorWrapper } from "../InputDecoratorWrapper/InputDecoratorWrapper";
import { InputRoot } from "../InputRoot/InputRoot";
import { useTheme } from "../useTheme";
import { normalizeTypography } from "../utils/normalize";
import { resolvePasswordIconStyles } from "./InputPassword.helpers";
import type { InputPasswordProps } from "./InputPassword.types";

interface IconProps {
    size: number;
    strokeColor: string;
}

const ShowPasswordIcon = ({ size, strokeColor }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
            d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"
            stroke={strokeColor}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Circle
            cx={12}
            cy={12}
            r={3}
            stroke={strokeColor}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const HidePasswordIcon = ({ size, strokeColor }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
            d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a20.3 20.3 0 0 1 5.09-5.91M10.58 10.58A3 3 0 0 0 13.41 13.41M9.88 3.88A10.94 10.94 0 0 1 12 5c7 0 11 7 11 7a20.3 20.3 0 0 1-4.38 4.38M1 1l22 22"
            stroke={strokeColor}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const InputPassword = forwardRef<TextInput, InputPasswordProps>(
    (
        {
            color = "neutral",
            textColor = "primary",
            variant = "outlined",
            size = "md",
            startDecorator,
            endDecorator,
            fullWidth = false,
            error = false,
            disabled = false,
            iconVisible = true,
            showPasswordIcon,
            hidePasswordIcon,
            onTogglePassword,
            onShowPassword,
            onHidePassword,
            visible: visibleProp,
            ...props
        },
        ref,
    ) => {
        const { theme } = useTheme();
        const [visibleInternal, setVisibleInternal] = useState(false);

        const isControlled = visibleProp !== undefined;
        const visible = isControlled ? visibleProp : visibleInternal;

        useEffect(() => {
            if (visible) onShowPassword?.();
            else onHidePassword?.();
        }, [visible]);

        const togglePassword = useCallback(() => {
            if (isControlled) {
                onTogglePassword?.(!visible);
            } else {
                setVisibleInternal((prev) => {
                    const next = !prev;
                    onTogglePassword?.(next);
                    return next;
                });
            }
        }, [onTogglePassword]);

        const showToggleIcon =
            iconVisible && !(endDecorator && !showPasswordIcon);

        const fontSize = useMemo(() => {
            const resolvedSize = resolveSize(theme, size, {
                sm: "body-md",
                md: "body-lg",
                lg: "title-md",
            }) as keyof typeof theme.typography.levels;

            return normalizeTypography(theme.typography.levels[resolvedSize])
                .fontSize;
        }, [theme, size]);

        const strokeColor = useMemo(() => {
            if (!iconVisible) return "currentColor";

            if (!showPasswordIcon || !hidePasswordIcon)
                return resolvePasswordIconStyles(theme, color)[variant];

            return "currentColor";
        }, [
            theme,
            color,
            variant,
            iconVisible,
            showPasswordIcon,
            hidePasswordIcon,
        ]);

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
                    {...props}
                    ref={ref}
                    size={size}
                    fullWidth={fullWidth}
                    editable={!disabled}
                    secureTextEntry={!visible}
                />

                {endDecorator ? (
                    <InputDecoratorWrapper>
                        {endDecorator}
                    </InputDecoratorWrapper>
                ) : showToggleIcon ? (
                    <Pressable
                        onPress={togglePassword}
                        disabled={disabled}
                        hitSlop={8}
                    >
                        <InputDecoratorWrapper>
                            {visible
                                ? (hidePasswordIcon ?? (
                                      <HidePasswordIcon
                                          size={fontSize}
                                          strokeColor={strokeColor}
                                      />
                                  ))
                                : (showPasswordIcon ?? (
                                      <ShowPasswordIcon
                                          size={fontSize}
                                          strokeColor={strokeColor}
                                      />
                                  ))}
                        </InputDecoratorWrapper>
                    </Pressable>
                ) : null}
            </InputRoot>
        );
    },
);

export { InputPassword };
