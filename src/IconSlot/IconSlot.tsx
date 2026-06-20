import {
    Children,
    cloneElement,
    forwardRef,
    isValidElement,
} from "react";
import { View } from "react-native";
import type { IconSlotChild, IconSlotProps } from "./IconSlot.types";

const IconSlot = forwardRef<View, IconSlotProps>(
    ({ size, children, style, ...props }, ref) => {
        const child = Children.only(children);

        return (
            <View
                ref={ref}
                style={[
                    {
                        alignItems: "center",
                        justifyContent: "center",
                        alignSelf: "center",
                        flexShrink: 0,
                        ...(size != null
                            ? { width: size, height: size }
                            : {}),
                    },
                    style,
                ]}
                {...props}
            >
                {isValidElement(child) && size != null
                    ? cloneElement(child as IconSlotChild, { size })
                    : child}
            </View>
        );
    },
);

IconSlot.displayName = "IconSlot";

export { IconSlot };
