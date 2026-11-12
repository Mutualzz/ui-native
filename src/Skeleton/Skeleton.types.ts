import type { ReactNode } from "react";
import type { ViewProps } from "react-native";
import type { NativeSystemProps } from "../Box/Box.types";

export type SkeletonVariant = "text" | "circular" | "rectangular" | "rounded";

export type SkeletonAnimation = "shimmer" | "pulse" | "none";

export interface SkeletonProps
    extends
        ViewProps,
        Omit<NativeSystemProps, keyof ViewProps | "style" | "fontSize"> {
    variant?: SkeletonVariant;
    animation?: SkeletonAnimation;
    size?: number;
    lines?: number;
    loading?: boolean;
    fontSize?: number;
    children?: ReactNode;
}

export interface SkeletonProviderProps {
    animation: SkeletonAnimation;
    children?: ReactNode;
}
