import type { Theme } from "@emotion/react";
import type { SystemProps } from "@mutualzz/ui-core";
import type { ViewStyle } from "react-native";
import { aliasMaps } from "@mutualzz/ui-core";
import { aliasToNativeStyles } from "./aliasToNativeStyles";
import { resolveResponsiveValue } from "./responsive";

const filteredKeys = Object.keys(aliasMaps).filter(
    (key) => !["color", "bgColor", "backgroundColor"].includes(key),
);

export const systemToStyle = (
    props: SystemProps,
    theme: Theme,
    width: number,
): ViewStyle => {
    const relevant: Record<string, unknown> = {};

    for (const key of filteredKeys) {
        if (props[key as keyof typeof props] != null) {
            relevant[key] = props[key as keyof typeof props];
        }
    }

    const inline = "inline" in props ? props.inline : undefined;
    const inlineStyles: ViewStyle = {};

    if (inline != null) {
        const resolvedInline = resolveResponsiveValue(theme, inline, width);
        inlineStyles.alignSelf = resolvedInline ? "flex-start" : "stretch";
    }

    return {
        alignContent: "stretch",
        flexShrink: 1,
        ...inlineStyles,
        ...aliasToNativeStyles(relevant, theme, width),
    };
};
