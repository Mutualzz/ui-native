import type { Theme } from "@emotion/react";
import {
    createColor,
    dynamicElevation,
    formatColor,
    resolveColor,
    resolvePanelFill,
    resolveTypographyColor,
    resolveWallpaperSurfaceStyles,
    isWallpaperSurfaceRole,
    type Color,
    type ColorLike,
    type PaperVariant,
    type SurfaceRole,
    type TypographyColor,
} from "@mutualzz/ui-core";
import type { ViewStyle } from "react-native";

export const resolvePaperStyles = (
    theme: Theme,
    color: Color | ColorLike,
    textColor: TypographyColor | ColorLike | "inherit" | "transparent",
    variant: PaperVariant,
    elevation: number,
    surfaceRole?: SurfaceRole,
): Record<PaperVariant, ViewStyle> => {
    const { colors } = theme;
    const surface =
        surfaceRole &&
        theme.backgroundImageUrl &&
        isWallpaperSurfaceRole(surfaceRole)
            ? resolveWallpaperSurfaceStyles(theme, surfaceRole)
            : null;

    const resolvedColor = resolveColor(color, theme);

    const resolvedTextColor =
        textColor === "inherit" || textColor === "transparent"
            ? undefined
            : resolveTypographyColor(textColor, theme);

    const solidTextColor = formatColor(theme.typography.colors.primary, {
        format: "hexa",
        negate: createColor(resolvedColor).isLight(),
    });

    const elevatedColor = dynamicElevation(
        variant === "solid" ? resolvedColor : colors.surface,
        elevation,
    );

    const panelVariant = variant === "elevation" ? "elevation" : variant;
    const elevatedFill = resolvePanelFill(
        theme,
        elevatedColor,
        panelVariant,
        elevation,
        surfaceRole,
    );

    const elevatedBackgroundStyles: ViewStyle = {
        ...(elevatedFill.background
            ? { backgroundColor: elevatedFill.background }
            : {}),
        ...(elevatedFill.backgroundColor
            ? { backgroundColor: elevatedFill.backgroundColor }
            : {}),
    };

    const elevationShadow: ViewStyle =
        surface || elevation === 0
            ? {}
            : {
                  elevation,
                  shadowColor: "#000",
                  shadowOpacity: Math.min(0.1 + elevation * 0.05, 0.5),
                  shadowOffset: { width: 0, height: 2 + elevation },
                  shadowRadius: 4 + elevation,
              };

    const panelBackground: ViewStyle =
        elevation === 0 && (variant === "outlined" || variant === "plain")
            ? { backgroundColor: "transparent" }
            : elevatedBackgroundStyles;

    const applySurface = (base: ViewStyle): ViewStyle =>
        surface
            ? {
                  ...base,
                  backgroundColor: surface.background,
              }
            : base;

    const elevationStyles: ViewStyle = surface
        ? { backgroundColor: surface.background, overflow: "hidden" }
        : {
              ...elevatedBackgroundStyles,
              ...elevationShadow,
              borderRadius: 12,
              overflow: "hidden",
          };

    return {
        elevation: elevationStyles,
        solid: applySurface({
            backgroundColor: formatColor(elevatedColor),
            ...elevationShadow,
            ...(solidTextColor ? { color: solidTextColor } : {}),
        }),
        outlined: applySurface({
            ...panelBackground,
            ...elevationShadow,
            borderWidth: 1,
            borderColor: formatColor(resolvedColor, {
                alpha: 20,
                format: "hexa",
            }),
            borderStyle: "solid",
            ...(resolvedTextColor ? { color: resolvedTextColor } : {}),
        }),
        plain: applySurface({
            ...panelBackground,
            ...elevationShadow,
            ...(resolvedTextColor ? { color: resolvedTextColor } : {}),
        }),
        soft: applySurface({
            backgroundColor: formatColor(
                elevation === 0 ? resolvedColor : elevatedColor,
                {
                    alpha: 10,
                    format: "hexa",
                },
            ),
            ...(resolvedTextColor ? { color: resolvedTextColor } : {}),
        }),
    };
};
