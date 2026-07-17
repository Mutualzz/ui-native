import type { Theme } from "@emotion/react";
import {
    createColor,
    dynamicElevation,
    flipNumber,
    formatColor,
    isValidGradient,
    resolveColor,
    resolveTypographyColor,
    resolveWallpaperSurfaceStyles,
    type Color,
    type ColorLike,
    type TypographyColor,
    type WallpaperSurfaceRole,
} from "@mutualzz/ui-core";
import type { ViewStyle } from "react-native";
import type { PaperVariant } from "./Paper.types";

export const resolvePaperStyles = (
    theme: Theme,
    color: Color | ColorLike,
    textColor: TypographyColor | ColorLike | "inherit" | "transparent",
    variant: PaperVariant,
    elevation: number,
    transparency: number,
    surfaceRole?: WallpaperSurfaceRole,
): Record<PaperVariant, ViewStyle> => {
    const { colors } = theme;
    const surface =
        surfaceRole && theme.backgroundImageUrl
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

    const isGradient = isValidGradient(elevatedColor);
    const gradientLayer = isGradient
        ? formatColor(elevatedColor, {
              alpha: flipNumber(transparency),
              format: "hexa",
          })
        : null;

    const opaqueBase = formatColor(colors.background);

    const elevatedBackgroundStyles: ViewStyle = isGradient
        ? {
              backgroundColor: opaqueBase,
          }
        : {
              backgroundColor: elevatedColor,
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

    const transparentPanel: ViewStyle = { backgroundColor: "transparent" };

    const panelBackground: ViewStyle =
        elevation === 0 ? transparentPanel : elevatedBackgroundStyles;

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
                elevation === 0
                    ? resolvedColor
                    : (gradientLayer ?? resolvedColor),
                {
                    alpha: 10,
                    format: "hexa",
                },
            ),
            ...(resolvedTextColor ? { color: resolvedTextColor } : {}),
        }),
    };
};
