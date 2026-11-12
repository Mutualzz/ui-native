import { formatColor } from "@mutualzz/ui-core";
import { forwardRef, useMemo, useState } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import Animated, { useReducedMotion } from "react-native-reanimated";
import { useFontScale } from "../hooks/useFontScale";
import { useSystemStyle } from "../hooks/useSystemStyle";
import { useTheme } from "../useTheme";
import { useSkeletonAnimation } from "./Skeleton.context";
import type {
    SkeletonAnimation,
    SkeletonProps,
    SkeletonVariant,
} from "./Skeleton.types";

const ANIMATION_DURATION_MS = 1600;
const MAX_TEXT_SCALE = 2;

const variantRadius: Record<SkeletonVariant, number> = {
    text: 4,
    circular: 9999,
    rectangular: 0,
    rounded: 8,
};

const shimmerKeyframes = {
    from: { transform: [{ translateX: "-100%" as const }] },
    to: { transform: [{ translateX: "100%" as const }] },
};

const pulseKeyframes = {
    "0%": { opacity: 1 },
    "50%": { opacity: 0.45 },
    "100%": { opacity: 1 },
};

const syncedAnimationDelay = () => -(Date.now() % ANIMATION_DURATION_MS);

const resolveAnimationSettings = (animationDelay: number) => ({
    animationDuration: ANIMATION_DURATION_MS,
    animationIterationCount: "infinite" as const,
    animationTimingFunction: "ease-in-out" as const,
    animationDelay,
});

const Skeleton = forwardRef<View, SkeletonProps>(
    (
        {
            variant = "text",
            animation,
            size,
            lines = 1,
            loading = true,
            fontSize = 14,
            children,
            style,
            ...props
        },
        ref,
    ) => {
        const { theme } = useTheme();
        const providerAnimation = useSkeletonAnimation();
        const reducedMotion = useReducedMotion();
        const fontScale = useFontScale();
        const [animationDelay] = useState(syncedAnimationDelay);
        const { systemStyle, restProps } = useSystemStyle(
            props as Record<string, unknown>,
        );

        const colors = useMemo(
            () => ({
                base: formatColor(theme.typography.colors.primary, {
                    alpha: 12,
                    format: "hexa",
                }),
                highlight: formatColor(theme.typography.colors.primary, {
                    alpha: 10,
                    format: "hexa",
                }),
            }),
            [theme.typography.colors.primary],
        );

        if (!loading) return <>{children}</>;

        const resolvedAnimation: SkeletonAnimation = reducedMotion
            ? "none"
            : (animation ?? providerAnimation);

        const hasChildren = children !== undefined && children !== null;
        const scaledFontSize = fontSize * Math.min(fontScale, MAX_TEXT_SCALE);
        const animationSettings = resolveAnimationSettings(animationDelay);

        const blockStyle = (blockVariant: SkeletonVariant): ViewStyle => ({
            backgroundColor: colors.base,
            overflow: "hidden",
            borderRadius: variantRadius[blockVariant],
            ...(blockVariant === "text" &&
                !hasChildren && {
                    height: scaledFontSize * 0.8,
                    marginVertical: scaledFontSize * 0.2,
                }),
            ...(hasChildren && { alignSelf: "flex-start" }),
        });

        const pulseStyle =
            resolvedAnimation === "pulse"
                ? { animationName: pulseKeyframes, ...animationSettings }
                : undefined;

        const shimmer =
            resolvedAnimation === "shimmer" ? (
                <Animated.View
                    pointerEvents="none"
                    style={[
                        StyleSheet.absoluteFill,
                        {
                            experimental_backgroundImage: `linear-gradient(90deg, transparent, ${colors.highlight}, transparent)`,
                            animationName: shimmerKeyframes,
                            ...animationSettings,
                        },
                    ]}
                />
            ) : null;

        if (lines > 1 && !hasChildren) {
            return (
                <View
                    ref={ref}
                    accessibilityElementsHidden
                    importantForAccessibility="no-hide-descendants"
                    style={[systemStyle, style]}
                    {...restProps}
                >
                    {Array.from({ length: lines }, (_line, index) => (
                        <Animated.View
                            key={index}
                            style={[
                                blockStyle("text"),
                                index === lines - 1 && { width: "60%" },
                                pulseStyle,
                            ]}
                        >
                            {shimmer}
                        </Animated.View>
                    ))}
                </View>
            );
        }

        return (
            <Animated.View
                ref={ref}
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
                style={[
                    blockStyle(variant),
                    size !== undefined && { width: size, height: size },
                    systemStyle,
                    style,
                    pulseStyle,
                ]}
                {...restProps}
            >
                {hasChildren && (
                    <View style={{ opacity: 0 }} pointerEvents="none">
                        {children}
                    </View>
                )}
                {shimmer}
            </Animated.View>
        );
    },
);

Skeleton.displayName = "Skeleton";

export { Skeleton };
