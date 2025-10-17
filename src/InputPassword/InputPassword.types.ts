import type { InputRootProps } from "../InputRoot/InputRoot.types";

export interface InputPasswordProps
    extends Omit<InputRootProps, "secureTextEntry"> {
    /**
     * If the input should hide the text being entered.
     * Should always be true for password inputs.
     *
     * @readonly
     * @default true
     */
    secureTextEntry?: true;
}
