import type { InputRootProps } from "../InputRoot/InputRoot.types";

export interface InputNumberProps
    extends Omit<InputRootProps, "inputMode" | "type" | "value"> {
    type?: "number";
    inputMode?: "decimal" | "numeric";
    step?: number;
    min?: number;
    max?: number;
    value?: string;
    onIncrement?: () => void;
    onDecrement?: () => void;
}
