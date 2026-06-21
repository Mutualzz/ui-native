import { forwardRef } from "react";
import type { TextInput } from "react-native";
import { useInputRef } from "../Input/useInputRef";
import { InputBase } from "../InputBase/InputBase";
import { InputDecoratorWrapper } from "../InputDecoratorWrapper/InputDecoratorWrapper";
import { InputRoot } from "../InputRoot/InputRoot";
import type { InputRootProps } from "../InputRoot/InputRoot.types";

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
                        {startDecorator}
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
                        {endDecorator}
                    </InputDecoratorWrapper>
                )}
            </InputRoot>
        );
    },
);

InputDefault.displayName = "InputDefault";

export { InputDefault };
