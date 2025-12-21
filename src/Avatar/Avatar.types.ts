import type { Color, ColorLike, Size, SizeValue } from "@mutualzz/ui-core";
import type { ReactNode } from "react";
import type { ImageProps } from "react-native";
import type { PaperVariant } from "../Paper/Paper.types";

export type AvatarShape = "circle" | "square" | "rounded";

export interface AvatarProps extends Omit<ImageProps, "source"> {
    src?: string;
    alt?: string;

    children?: ReactNode;

    color?: Color | ColorLike;
    variant?: PaperVariant;
    size?: Size | SizeValue | number;

    elevation?: number;

    shape?: AvatarShape | SizeValue | number;
}
