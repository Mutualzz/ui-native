import type { Responsive, SystemProps } from "@mutualzz/ui-core";
import type { ViewProps } from "react-native";

export type NativeSystemProps = Omit<SystemProps, "css">;

export interface BoxProps
    extends ViewProps,
        Omit<NativeSystemProps, keyof ViewProps | "style"> {
    inline?: Responsive<boolean>;
}
