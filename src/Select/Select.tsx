import styled from "@emotion/native";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import {
    Dimensions,
    Modal,
    Pressable,
    ScrollView,
    View,
    type LayoutRectangle,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { DecoratorWrapper } from "../DecoratorWrapper/DecoratorWrapper";
import { Typography } from "../Typography/Typography";
import { useTheme } from "../useTheme";
import { SelectContext } from "./Select.context";
import {
    resolveSelectContentStyles,
    resolveSelectSize,
    resolveSelectStyles,
} from "./Select.helpers";
import type { SelectProps } from "./Select.types";

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
        flexDirection: "row",
        alignItems: "center",
        ...resolveSelectSize(theme, size).container,
        ...resolveSelectStyles(theme, color)[variant].container,
    }),
);

const TriggerText = styled(Typography)<SelectProps & { hasValue: boolean }>(
    ({
        theme,
        color = "primary",
        variant = "solid",
        size = "md",
        hasValue,
    }) => ({
        flex: 1,
        opacity: hasValue ? 1 : 0.5,
        ...resolveSelectStyles(theme, color)[variant].text,
        ...resolveSelectSize(theme, size).text,
    }),
);

const DropdownIcon = styled(Svg)({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 24,
    height: 24,
    flexShrink: 0,
    opacity: 0.7,
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

// TODO: Fix the select and the option components
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
        const { theme } = useTheme();

        const [internalValue, setInternalValue] = useState(
            defaultValue ?? (multiple ? [] : ""),
        );
        const isControlled = value !== undefined;
        const currentValue = isControlled ? value : internalValue;

        const [isOpen, setIsOpen] = useState(false);
        const [anchorLayout, setAnchorLayout] =
            useState<LayoutRectangle | null>(null);
        const [placement, setPlacement] = useState<Placement>("bottom");
        const anchorRef = useRef<View | null>(null);

        const POPUP_VERTICAL_OFFSET = 56;

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

        const setAnchorRef = useCallback(
            (node: View | null) => {
                anchorRef.current = node;
                if (!ref) return;
                if (typeof ref === "function") {
                    ref(node);
                } else {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (ref as any).current = node;
                }
            },
            [ref],
        );

        const measureAnchor = useCallback(() => {
            const node = anchorRef.current;
            if (!node || typeof node.measureInWindow !== "function") return;
            node.measureInWindow(
                (x: number, y: number, width: number, height: number) => {
                    setAnchorLayout({ x, y, width, height });
                },
            );
        }, []);

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

        useEffect(() => {
            if (!isOpen) return;
            requestAnimationFrame(() => {
                measureAnchor();
            });
        }, [isOpen, measureAnchor]);

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

        const iconColor = resolveSelectStyles(theme, color)[variant].text.color;

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
                    ref={setAnchorRef}
                    {...props}
                >
                    {startDecorator && (
                        <DecoratorWrapper>{startDecorator}</DecoratorWrapper>
                    )}

                    <TriggerText
                        color={color}
                        variant={variant}
                        size={size}
                        hasValue={hasValue}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {displayValue ? displayValue : placeholder}
                    </TriggerText>

                    <DecoratorWrapper>
                        {endDecorator ?? (
                            <DropdownIcon fill={iconColor} viewBox="0 0 24 24">
                                <Path d="m12 5.83 2.46 2.46c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L12.7 3.7a.9959.9959 0 0 0-1.41 0L8.12 6.88c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 5.83zm0 12.34-2.46-2.46a.9959.9959 0 0 0-1.41 0c-.39.39-.39 1.02 0 1.41l3.17 3.18c.39.39 1.02.39 1.41 0l3.17-3.17c.39-.39.39-1.02 0-1.41a.9959.9959 0 0 0-1.41 0L12 18.17z"></Path>
                            </DropdownIcon>
                        )}
                    </DecoratorWrapper>
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
                                                anchorLayout.height +
                                                POPUP_VERTICAL_OFFSET
                                              : 100,
                                      }
                                    : {
                                          bottom: anchorLayout
                                              ? Dimensions.get("window")
                                                    .height -
                                                anchorLayout.y +
                                                POPUP_VERTICAL_OFFSET
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
