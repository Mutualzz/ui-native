import type { ButtonProps } from "../Button/Button.types";

export type IconButtonProps = Omit<
    ButtonProps,
    "startDecorator" | "endDecorator" | "verticalAlign" | "horizontalAlign"
>;
