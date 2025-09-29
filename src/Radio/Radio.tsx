import type { Size, SizeValue } from "@mutualzz/ui-core";

import styled from "@emotion/native";
import { forwardRef, useContext, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { RadioGroupContext } from "../RadioGroup/RadioGroup.context";
import { useTheme } from "../useTheme";
import {
    resolveIconScaling,
    resolveRadioColor,
    resolveRadioSize,
    resolveRadioStyles,
} from "./Radio.helpers";
import type { RadioProps } from "./Radio.types";

const RadioWrapper = styled(Pressable)<RadioProps>(({ disabled }) => ({
    position: "relative",
    alignItems: "center",
    flexDirection: "row",
    userSelect: "none",
    ...(disabled && {
        opacity: 0.5,
        pointerEvents: "none",
    }),
}));

RadioWrapper.displayName = "RadioWrapper";

const RadioControl = styled(View)<RadioProps>(
    ({
        theme,
        color = "primary",
        variant = "plain",
        size = "md",
        checked,
    }) => ({
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
        ...resolveRadioSize(theme, size),
        ...resolveRadioStyles(theme, color, checked)[variant],
    }),
);

RadioControl.displayName = "RadioControl";

const RadioLabel = styled(Text)<{
    rtl?: boolean;
    disabled?: boolean;
    color: string;
}>(({ rtl, disabled, color }) => ({
    color,
    opacity: disabled ? 0.5 : 1,
    ...(rtl ? { marginRight: 8 } : { marginLeft: 8 }),
}));

RadioLabel.displayName = "RadioLabel";

const IconWrapper = styled(View)<{
    size?: Size | SizeValue | number;
}>(({ theme, size = "md" }) => ({
    alignItems: "center",
    justifyContent: "center",
    ...resolveIconScaling(theme, size),
}));

IconWrapper.displayName = "IconWrapper";

const CheckedIcon = ({ color }: { color: string }) => (
    <View
        style={{
            width: "60%",
            height: "60%",
            backgroundColor: color,
            borderRadius: 50,
        }}
    />
);

/**
 *  Radio component for selecting options.
 *  It supports different sizes, colors, and variants.
 *  The component can be controlled or uncontrolled.
 *  It can display custom icons for checked and unchecked states.
 *  The component can be used with a label and supports RTL layout.
 *  The `onChange` event handler is called when the radio state changes.
 *  The `disabled` prop can be used to disable the radio input.
 *  The `name` and `value` props are used to group radio inputs and set the value.
 *  The `checkedIcon` and `uncheckedIcon` props allow for custom icons
 *  to be displayed in the checked and unchecked states, respectively.
 *  The `rtl` prop can be used to control the layout direction.
 */
const Radio = forwardRef<View, RadioProps>(
    (
        {
            checked: controlledChecked,
            defaultChecked,
            onChange: propOnChange,
            label,
            disabled: propDisabled,
            color: colorProp,
            variant: variantProp,
            size: sizeProp,
            value,
            checkedIcon,
            uncheckedIcon,
            rtl,
            ...props
        },
        ref,
    ) => {
        const { theme } = useTheme();

        const group = useContext(RadioGroupContext);
        const [internalChecked, setInternalChecked] = useState(
            defaultChecked ?? false,
        );

        let isChecked: boolean;
        if (group && value !== undefined) isChecked = group.value === value;
        else if (controlledChecked !== undefined) isChecked = controlledChecked;
        else isChecked = internalChecked;

        const color = colorProp ?? group?.color ?? "primary";
        const variant = variantProp ?? group?.variant ?? "solid";
        const size = sizeProp ?? group?.size ?? "md";
        const disabled = group?.disabled ?? propDisabled;

        const textColor = resolveRadioColor(theme, color)[variant];
        const iconColor = resolveRadioColor(theme, color)[variant];

        const handlePress = () => {
            if (disabled) return;

            if (group && value !== undefined) {
                group.onChange?.(value);
            } else if (controlledChecked === undefined) {
                setInternalChecked(true);
            }

            propOnChange?.(value || "");
        };

        return (
            <RadioWrapper
                ref={ref}
                disabled={disabled}
                size={size}
                onPress={handlePress}
                accessibilityRole="radio"
                accessibilityState={{ checked: isChecked }}
                style={({ pressed }) => ({
                    opacity: pressed && !disabled ? 0.8 : disabled ? 0.5 : 1,
                })}
                {...props}
            >
                {rtl && label && (
                    <RadioLabel disabled={disabled} rtl={rtl} color={textColor}>
                        {label}
                    </RadioLabel>
                )}
                <RadioControl
                    color={color}
                    variant={variant}
                    checked={isChecked}
                    size={size}
                >
                    {isChecked ? (
                        checkedIcon ? (
                            <IconWrapper size={size}>{checkedIcon}</IconWrapper>
                        ) : (
                            <IconWrapper size={size}>
                                <CheckedIcon color={iconColor} />
                            </IconWrapper>
                        )
                    ) : uncheckedIcon ? (
                        <IconWrapper size={size}>{uncheckedIcon}</IconWrapper>
                    ) : null}
                </RadioControl>

                {!rtl && label && (
                    <RadioLabel disabled={disabled} rtl={rtl} color={textColor}>
                        {label}
                    </RadioLabel>
                )}
            </RadioWrapper>
        );
    },
);

export { Radio };
