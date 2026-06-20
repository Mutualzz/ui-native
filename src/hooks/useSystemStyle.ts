import type { SystemProps } from "@mutualzz/ui-core";
import { useMemo } from "react";
import { useWindowDimensions, type ViewStyle } from "react-native";
import { useTheme } from "../useTheme";
import { splitSystemProps } from "../utils/aliasToNativeStyles";
import { systemToStyle } from "../utils/systemToStyle";

export const useSystemStyle = <T extends Record<string, unknown>>(props: T) => {
    const { theme } = useTheme();
    const { width } = useWindowDimensions();
    const { systemProps, restProps } = splitSystemProps(props);

    const systemStyle = useMemo(
        () => systemToStyle(systemProps as SystemProps, theme, width),
        [systemProps, theme, width],
    );

    return {
        systemStyle,
        restProps,
    } as {
        systemStyle: ViewStyle;
        restProps: Omit<T, keyof SystemProps | "inline">;
    };
};
