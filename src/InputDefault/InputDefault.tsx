import { forwardRef } from "react";
import type { TextInput } from "react-native";
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
            ...props
        }: InputRootProps,
        ref,
    ) => {
        const inputBaseProps = {
            ...props,
            ...(onBlur ? { onBlur } : {}),
            size,
            fullWidth,
            ref,
            editable: !disabled,
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
                {...props}
            >
                {startDecorator && (
                    <InputDecoratorWrapper position="start">
                        {startDecorator}
                    </InputDecoratorWrapper>
                )}

                <InputBase {...inputBaseProps} />

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
