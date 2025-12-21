import styled from "@emotion/native";
import { forwardRef, useContext, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import type { CheckboxVisualStyle } from "../Checkbox/Checkbox.helpers";
import { RadioGroupContext } from "../RadioGroup/RadioGroup.context";
import { useTheme } from "../useTheme";
import {
    resolveIconScaling,
    resolveRadioSize,
    resolveRadioStyles,
} from "./Radio.helpers";
import type { RadioProps } from "./Radio.types";

const RadioWrapper = styled(Pressable)<{
    disabled?: boolean;
    fontSize: number;
}>(({ disabled, fontSize }) => ({
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    opacity: disabled ? 0.5 : 1,
    fontSize,
}));

const RadioControl = styled(View)<{
    variantStyle: CheckboxVisualStyle;
    pressedStyle: CheckboxVisualStyle;
    sizePx: number;
    pressed?: boolean;
}>(({ variantStyle, pressedStyle, sizePx, pressed }) => ({
    width: sizePx,
    height: sizePx,
    borderRadius: sizePx / 2,
    borderWidth: 1,
    borderColor: "currentColor",
    alignItems: "center",
    justifyContent: "center",
    ...(variantStyle ?? {}),
    ...(pressed ? (pressedStyle ?? {}) : null),
}));

const LabelWrapper = styled(View)<{ rtl?: boolean }>(({ rtl }) => ({
    marginLeft: rtl ? 0 : 8,
    marginRight: rtl ? 8 : 0,
}));

const DefaultDot = styled(View)<{ dotSize: number }>(({ dotSize }) => ({
    width: dotSize,
    height: dotSize,
    borderRadius: dotSize / 2,
    backgroundColor: "currentColor",
}));

const IconWrapper = styled(View)<{ sizePx: number }>(({ sizePx }) => ({
    width: sizePx,
    height: sizePx,
    alignItems: "center",
    justifyContent: "center",
}));

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
            name: propName,
            value,
            checkedIcon,
            uncheckedIcon,
            rtl,
            style,
            ...props
        },
        ref,
    ) => {
        const { theme } = useTheme();
        const group = useContext(RadioGroupContext);

        const [internalChecked, setInternalChecked] =
            useState(!!defaultChecked);

        const isChecked =
            group && value !== undefined
                ? group.value === value
                : controlledChecked !== undefined
                  ? controlledChecked
                  : internalChecked;

        const color = colorProp ?? group?.color ?? "primary";
        const variant = variantProp ?? group?.variant ?? "solid";
        const size = sizeProp ?? group?.size ?? "md";
        const name = group?.name ?? propName;
        const disabled = group?.disabled ?? propDisabled;

        const fontSize = useMemo(
            () => resolveRadioSize(theme, size).fontSize,
            [group, size],
        );

        const sizePx = typeof size === "number" ? size : fontSize;

        const iconScale = useMemo(() => {
            try {
                return resolveIconScaling(theme, size);
            } catch {
                return { width: sizePx, height: sizePx };
            }
        }, [group, size, sizePx]);

        const dotSize = Math.max(2, Math.round(sizePx * 0.5));

        const { variantStyle, pressedStyle, checkedStyle } = useMemo(() => {
            const base =
                resolveRadioStyles(theme, color, false)?.[variant] ?? {};
            const pressedS =
                resolveRadioStyles(theme, color, true)?.[variant] ?? {};
            const checkedS =
                resolveRadioStyles(theme, color, true)?.[variant] ?? {};
            return {
                variantStyle: base,
                pressedStyle: pressedS,
                checkedStyle: checkedS,
            };
        }, [group, color, variant]);

        const handlePress = () => {
            if (disabled) return;

            if (group && value !== undefined) {
                group.onChange?.(value);
            } else {
                if (controlledChecked === undefined) setInternalChecked(true);
                propOnChange?.(true);
            }
        };

        const pressableDisabled =
            !!disabled ||
            (!!(group && value !== undefined) ? false : isChecked);

        return (
            <RadioWrapper
                ref={ref}
                accessibilityRole="radio"
                accessibilityState={{
                    checked: !!isChecked,
                    disabled: !!disabled,
                }}
                disabled={pressableDisabled}
                onPress={handlePress}
                style={style}
                fontSize={fontSize}
                {...props}
            >
                {rtl && label ? (
                    <LabelWrapper rtl={rtl}>
                        {typeof label === "string" ? (
                            <Text>{label}</Text>
                        ) : (
                            label
                        )}
                    </LabelWrapper>
                ) : null}

                <Pressable disabled={pressableDisabled} onPress={handlePress}>
                    {({ pressed }) => (
                        <RadioControl
                            sizePx={sizePx}
                            pressed={pressed}
                            variantStyle={
                                isChecked ? checkedStyle : variantStyle
                            }
                            pressedStyle={pressedStyle}
                        >
                            {isChecked ? (
                                checkedIcon ? (
                                    <IconWrapper
                                        sizePx={iconScale?.width ?? sizePx}
                                    >
                                        {checkedIcon}
                                    </IconWrapper>
                                ) : (
                                    <DefaultDot dotSize={dotSize} />
                                )
                            ) : uncheckedIcon ? (
                                <IconWrapper
                                    sizePx={iconScale?.width ?? sizePx}
                                >
                                    {uncheckedIcon}
                                </IconWrapper>
                            ) : null}
                        </RadioControl>
                    )}
                </Pressable>

                {!rtl && label ? (
                    <LabelWrapper rtl={rtl}>
                        {typeof label === "string" ? (
                            <Text>{label}</Text>
                        ) : (
                            label
                        )}
                    </LabelWrapper>
                ) : null}
            </RadioWrapper>
        );
    },
);

Radio.displayName = "Radio";

export { Radio };
