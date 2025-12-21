import { createContext } from "react";
import type { ButtonGroupProps } from "./ButtonGroup.types";

export type ButtonGroupContextProps = Omit<
    ButtonGroupProps,
    "children" | "orientation" | "separatorColor"
>;

export const ButtonGroupContext = createContext<ButtonGroupContextProps | null>(
    null,
);
