import type { Size, SizeValue } from "@mutualzz/ui-core";
import type { InputRootProps } from "../InputRoot/InputRoot.types";

export interface InputBaseProps extends InputRootProps {
    size?: Size | SizeValue | number;
    fullWidth?: boolean;
}
