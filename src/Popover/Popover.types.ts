import type { Size, SizeValue } from "@mutualzz/ui-core";
import type { ReactNode } from "react";
import type { PaperProps } from "../Paper/Paper.types";

export type PopoverPlacement = "top" | "bottom" | "left" | "right";

export interface PopoverProps extends Omit<PaperProps, "content"> {
    size?: Size | SizeValue | number;
    trigger?: ReactNode;

    isOpen?: boolean;

    disablePortal?: boolean;

    closeOnClickOutside?: boolean;
    closeOnInteract?: boolean;

    placement?: PopoverPlacement;

    nonTranslucent?: boolean;
}
