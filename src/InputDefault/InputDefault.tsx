import { cloneElement, forwardRef, isValidElement } from "react";
import type { ReactNode } from "react";
import type { TextInput } from "react-native";
import { useInputRef } from "../Input/useInputRef";
import { InputBase } from "../InputBase/InputBase";
import { resolveInputBaseSize } from "../InputBase/InputBase.helpers";
import { InputDecoratorWrapper } from "../InputDecoratorWrapper/InputDecoratorWrapper";
import { InputRoot } from "../InputRoot/InputRoot";
import type { InputRootProps } from "../InputRoot/InputRoot.types";
import { resolveTypographyStyles } from "../Typography/Typography.helpers";
import { useTheme } from "../useTheme";

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

const InputDefault = forwardRef<TextInput, InputRootProps>(
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
            children,

            onBlur,
            style,
            ...inputProps
        }: InputRootProps,
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
                {startDecorator && (
                    <InputDecoratorWrapper position="start">
                        {cloneDecorator(startDecorator, decoratorColor, fontSize)}
                    </InputDecoratorWrapper>
                )}

                <InputBase
                    {...inputProps}
                    {...(onBlur ? { onBlur } : {})}
                    size={size}
                    fullWidth={fullWidth}
                    ref={inputRef}
                    editable={!disabled}
                />

                {endDecorator && (
                    <InputDecoratorWrapper position="end">
                        {cloneDecorator(endDecorator, decoratorColor, fontSize)}
                    </InputDecoratorWrapper>
                )}
            </InputRoot>
        );
    },
);

InputDefault.displayName = "InputDefault";

export { InputDefault };
