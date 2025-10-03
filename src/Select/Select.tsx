import styled from "@emotion/native";
import { DecoratorWrapper } from "DecoratorWrapper/DecoratorWrapper";
import { forwardRef, useCallback, useEffect, useState } from "react";
import {
    Dimensions,
    Modal,
    Pressable,
    ScrollView,
    View,
    type LayoutRectangle,
} from "react-native";
import { Typography } from "../Typography/Typography";
import { SelectContext } from "./Select.context";
import {
    resolveSelectContentStyles,
    resolveSelectSize,
    resolveSelectStyles,
} from "./Select.helpers";
import type { SelectProps } from "./Select.types";

const Row = styled(View)({
    flexDirection: "row",
    alignItems: "center",
});

const SelectRoot = styled(Pressable)<SelectProps>(
    ({
        theme,
        color = "primary",
        variant = "solid",
        size = "md",
        disabled,
    }) => ({
        width: "100%",
        overflow: "hidden",
        position: "relative",
        opacity: disabled ? 0.5 : 1,
        ...resolveSelectSize(theme, size).container,
        ...resolveSelectStyles(theme, color)[variant].container,
    }),
);

const TriggerText = styled(Typography)<SelectProps & { hasValue: boolean }>(
    ({ theme, size = "md", hasValue }) => ({
        flex: 1,
        opacity: hasValue ? 1 : 0.5,
        ...resolveSelectSize(theme, size).text,
    }),
);

const Chevron = styled(View)({
    width: 18,
    height: 18,
    transform: [{ rotate: "90deg" }],
    borderLeftWidth: 2,
    borderBottomWidth: 2,
});

const PopupContainer = styled(View)<SelectProps>(
    ({ theme, size = "md", variant = "solid", color = "primary" }) => ({
        maxHeight: 240,
        borderRadius: 6,
        overflow: "hidden",
        elevation: 6,
        ...resolveSelectSize(theme, size).popup,
        ...resolveSelectContentStyles(theme, color)[variant].surface,
    }),
);

const PopupList = styled(ScrollView)({
    maxHeight: 240,
});

type Placement = "top" | "bottom";

const Select = forwardRef<View, SelectProps>(
    (
        {
            size = "md",
            variant = "solid",
            color = "primary",
            startDecorator,
            endDecorator,
            multiple = false,
            disabled = false,
            required = false,
            autoFocus = false,
            placeholder = "Select an option",
            value,
            defaultValue,
            onValueChange,
            closeOnClickOutside = true,
            children,
            ...props
        },
        ref,
    ) => {
        const [internalValue, setInternalValue] = useState(
            defaultValue ?? (multiple ? [] : ""),
        );
        const isControlled = value !== undefined;
        const currentValue = isControlled ? value : internalValue;

        const [isOpen, setIsOpen] = useState(false);
        const [anchorLayout, setAnchorLayout] =
            useState<LayoutRectangle | null>(null);
        const [placement, setPlacement] = useState<Placement>("bottom");

        useEffect(() => {
            if (!anchorLayout) return;
            const { height: windowH } = Dimensions.get("window");
            const spaceBelow = windowH - (anchorLayout.y + anchorLayout.height);
            const estPopupH = 200;
            setPlacement(
                spaceBelow < estPopupH && anchorLayout.y > estPopupH
                    ? "top"
                    : "bottom",
            );
        }, [anchorLayout]);

        const hasValue = multiple
            ? Array.isArray(currentValue) && currentValue.length > 0
            : Boolean(currentValue);

        const displayValue = (() => {
            const kids = Array.isArray(children) ? children : [children];
            if (multiple && Array.isArray(currentValue)) {
                return kids
                    .filter(
                        (opt: any) =>
                            opt?.props?.value &&
                            currentValue.includes(opt.props.value),
                    )
                    .map((opt: any, i: number) => (
                        <Typography key={`${opt?.props?.value}-${i}`}>
                            {opt?.props?.children}
                        </Typography>
                    ));
            }
            const sel = kids.find(
                (opt: any) => opt?.props?.value === currentValue,
            );
            return sel ? <Typography>{sel.props.children}</Typography> : null;
        })();

        const handleOptionSelect = useCallback(
            (optionValue: string | number) => {
                if (disabled) return;
                let newValue: any;
                if (multiple) {
                    const arr = Array.isArray(currentValue) ? currentValue : [];
                    newValue = arr.includes(optionValue)
                        ? arr.filter((v) => v !== optionValue)
                        : [...arr, optionValue];
                } else {
                    newValue = optionValue;
                    setIsOpen(false);
                }
                if (!isControlled) setInternalValue(newValue);
                onValueChange?.(newValue);
            },
            [disabled, multiple, currentValue, isControlled, onValueChange],
        );

        return (
            <SelectContext.Provider
                value={{
                    value: currentValue,
                    multiple,
                    onSelect: handleOptionSelect,
                    color,
                    variant,
                    size,
                    disabled,
                }}
            >
                <SelectRoot
                    accessibilityRole="button"
                    onPress={() => !disabled && setIsOpen(true)}
                    onLayout={(e) => setAnchorLayout(e.nativeEvent.layout)}
                    size={size}
                    variant={variant}
                    color={color}
                    disabled={disabled}
                    ref={ref}
                    {...props}
                >
                    <Row>
                        {startDecorator && (
                            <DecoratorWrapper>
                                {startDecorator}
                            </DecoratorWrapper>
                        )}

                        <TriggerText
                            size={size}
                            hasValue={hasValue}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {hasValue ? displayValue : placeholder}
                        </TriggerText>

                        <DecoratorWrapper>
                            {endDecorator ?? <Chevron />}
                        </DecoratorWrapper>
                    </Row>
                </SelectRoot>

                <Modal
                    visible={isOpen}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setIsOpen(false)}
                >
                    <Pressable
                        style={{ flex: 1 }}
                        onPress={
                            closeOnClickOutside
                                ? () => setIsOpen(false)
                                : undefined
                        }
                    >
                        <View
                            pointerEvents="box-none"
                            style={{
                                position: "absolute",
                                left: anchorLayout ? anchorLayout.x : 16,
                                width: anchorLayout
                                    ? anchorLayout.width
                                    : undefined,
                                ...(placement === "bottom"
                                    ? {
                                          top: anchorLayout
                                              ? anchorLayout.y +
                                                (anchorLayout.height + 6)
                                              : 100,
                                      }
                                    : {
                                          bottom: anchorLayout
                                              ? Dimensions.get("window")
                                                    .height -
                                                anchorLayout.y +
                                                6
                                              : undefined,
                                      }),
                            }}
                        >
                            <PopupContainer
                                size={size}
                                variant={variant}
                                color={color}
                            >
                                <PopupList>
                                    <View style={{ paddingVertical: 4 }}>
                                        {children}
                                    </View>
                                </PopupList>
                            </PopupContainer>
                        </View>
                    </Pressable>
                </Modal>
            </SelectContext.Provider>
        );
    },
);

Select.displayName = "Select";

export { Select };
