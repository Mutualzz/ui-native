import { forwardRef } from "react";
import type { TextInput } from "react-native";
import { InputColor } from "../InputColor/InputColor";
import type { InputColorProps } from "../InputColor/InputColor.types";
import { InputDefault } from "../InputDefault/InputDefault";
import { InputNumber } from "../InputNumber/InputNumber";
import type { InputNumberProps } from "../InputNumber/InputNumber.types";
import { InputPassword } from "../InputPassword/InputPassword";
import type { InputPasswordProps } from "../InputPassword/InputPassword.types";
import type { InputRootProps } from "../InputRoot/InputRoot.types";
import type { InputProps } from "./Input.types";

const Input = forwardRef<TextInput, InputProps>((props, ref) => {
    if ("type" in props && props.type === "password") {
        return (
            <InputPassword ref={ref} {...(props as InputPasswordProps)} />
        );
    }

    if ("type" in props && props.type === "number") {
        return <InputNumber ref={ref} {...(props as InputNumberProps)} />;
    }

    if ("type" in props && props.type === "color") {
        return <InputColor ref={ref} {...(props as InputColorProps)} />;
    }

    return <InputDefault ref={ref} {...(props as InputRootProps)} />;
});

Input.displayName = "Input";

export { Input };
