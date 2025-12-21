import styled from "@emotion/native";
import type {
    Color,
    ColorLike,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import { useContext, type FC } from "react";
import { Pressable, Text } from "react-native";
import { SelectContext } from "../Select/Select.context";
import { resolveOptionSize, resolveOptionStyles } from "./Option.helpers";
import type { OptionProps } from "./Option.types";

const OptionWrapper = styled(Pressable)<{
    color: Color | ColorLike;
    variant: Variant;
    size: Size | SizeValue | number;
    isSelected: boolean;
    disabled?: boolean;
}>(({ theme, color, variant, size, isSelected, disabled }) => ({
    ...resolveOptionStyles(theme, color, isSelected)[variant],
    ...resolveOptionSize(theme, size),

    opacity: disabled ? 0.5 : 1,

    flexDirection: "row",
    alignItems: "center",
}));

const Option: FC<OptionProps> = ({
    value,
    disabled: disabledProp,
    color: colorProp,
    variant: variantProp,
    size: sizeProp,
    label,
    children,
    style,
    ...props
}) => {
    const parent = useContext(SelectContext);

    const color = colorProp ?? parent?.color ?? "primary";
    const variant = variantProp ?? parent?.variant ?? "solid";
    const size = sizeProp ?? parent?.size ?? "md";
    const disabled = parent?.disabled ?? disabledProp;

    const isSelected = parent?.multiple
        ? Array.isArray(parent.value) && parent.value.includes(value)
        : parent?.value === value;

    const handlePress = () => {
        if (!disabled) parent?.onSelect(value);
    };

    return (
        <OptionWrapper
            {...props}
            color={color}
            variant={variant}
            size={size}
            isSelected={isSelected}
            disabled={disabled}
            onPress={handlePress}
            accessibilityRole="menuitem"
            accessibilityState={{ selected: isSelected, disabled }}
            style={({ pressed }) => [
                pressed && !disabled ? { opacity: 0.85 } : null,
                style,
            ]}
        >
            <Text>{children ?? label ?? String(value)}</Text>
        </OptionWrapper>
    );
};

Option.displayName = "Option";

export { Option };
