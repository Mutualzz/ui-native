import type { ReactNode } from "react";
import type { InputRootProps } from "../InputRoot/InputRoot.types";

export interface InputPasswordProps extends InputRootProps {
    type?: "password";

    visible?: boolean;

    iconVisible?: boolean;

    showPasswordIcon?: ReactNode;
    hidePasswordIcon?: ReactNode;

    onTogglePassword?: (visible?: boolean) => void;
    onShowPassword?: (visible?: boolean) => void;
    onHidePassword?: (visible?: boolean) => void;
}
