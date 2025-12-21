import styled from "@emotion/native";
import { forwardRef, useCallback, useMemo, useRef, useState } from "react";
import { Pressable, Text, View, type LayoutChangeEvent } from "react-native";
import { useTheme } from "../useTheme";

import { ScrollView } from "react-native-gesture-handler";
import Svg, { Path } from "react-native-svg";
import { DecoratorWrapper } from "../DecoratorWrapper/DecoratorWrapper";
import { SelectContext } from "./Select.context";
import {
    resolveSelectContentStyles,
    resolveSelectSize,
    resolveSelectStyles,
} from "./Select.helpers";
import type { SelectProps } from "./Select.types";

const Backdrop = styled(Pressable)({
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
});

const SelectWrapper = styled(Pressable)<{
    disabled?: boolean;
}>(({ disabled }) => ({
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    overflow: "hidden",
    borderRadius: 6,
    opacity: disabled ? 0.5 : 1,
}));

const PlaceholderText = styled(Text)({
    flexGrow: 1,
});

const ContentContainer = styled(ScrollView)({
    borderRadius: 6,
    paddingVertical: 4,
    maxHeight: 200,
    overflow: "hidden",
});

const DropdownPositioner = styled(View)<{
    top: number;
    left: number;
    width: number;
}>(({ theme, top, left, width }) => ({
    position: "absolute",
    top,
    left,
    width,
    zIndex: theme.zIndex.modal,
}));

const ArrowIcon = ({ reverse }: { reverse: boolean }) => (
    <Svg
        style={{ transform: [{ rotate: reverse ? "180deg" : "0deg" }] }}
        width={16}
        height={16}
        viewBox="0 0 24 24"
    >
        <Path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
        />
    </Svg>
);

export const Select = forwardRef<View, SelectProps>(
    (
        {
            size = "md",
            variant = "solid",
            color = "primary",
            startDecorator,
            endDecorator,
            multiple = false,
            disabled = false,
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

        const anchorRef = useRef<View>(null);
        const [internalValue, setInternalValue] = useState<any>(
            defaultValue ?? (multiple ? [] : ""),
        );
        const isControlled = value !== undefined;
        const currentValue = isControlled ? value : internalValue;

        const [open, setOpen] = useState(false);
        const [contentSize, setContentSize] = useState({ width: 0, height: 0 });
        const [anchorLayout, setAnchorLayout] = useState({
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        });

        const sizeStyles = useMemo(
            () => resolveSelectSize(theme, size),
            [theme, size],
        );

        const wrapperStyle = useMemo(
            () => ({
                ...sizeStyles,
                ...resolveSelectStyles(theme, color)[variant],
            }),
            [theme, color, variant, sizeStyles],
        );

        const placeholderColorStyle = useMemo(
            () => ({
                color:
                    resolveSelectContentStyles(theme, color)[variant].color ??
                    wrapperStyle.color,
            }),
            [theme, color, variant, wrapperStyle.color],
        );

        const onAnchorLayout = (e: LayoutChangeEvent) => {
            const { x, y, width, height } = e.nativeEvent.layout;
            setAnchorLayout({ x, y, width, height });
        };

        const computeDropdownPosition = useCallback(
            (dropdownH = contentSize.height || 200) => {
                const offset = 4;
                const windowHeight = 8000;

                const spaceBelow =
                    windowHeight - (anchorLayout.y + anchorLayout.height);
                const spaceAbove = anchorLayout.y;

                let top = anchorLayout.y + anchorLayout.height + offset;

                if (spaceBelow < dropdownH && spaceAbove > dropdownH)
                    top = anchorLayout.y - dropdownH - offset;

                return {
                    top: Math.max(0, top),
                    left: anchorLayout.x,
                    width: anchorLayout.width,
                };
            },
            [anchorLayout, contentSize.height],
        );

        const [dropdownPos, setDropdownPos] = useState({
            top: 0,
            left: 0,
            width: 0,
        });

        const openDropdown = useCallback(() => {
            if (disabled) return;
            setOpen(true);
            setTimeout(() => {
                const pos = computeDropdownPosition();
                setDropdownPos(pos);
            }, 0);
        }, [computeDropdownPosition, disabled]);

        const closeDropdown = useCallback(() => setOpen(false), []);

        const onBackdropPress = () => {
            if (!closeOnClickOutside) return;
            closeDropdown();
        };

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
                }

                if (!isControlled) setInternalValue(newValue);
                onValueChange?.(newValue);

                if (!multiple) closeDropdown();
            },
            [
                closeDropdown,
                currentValue,
                disabled,
                isControlled,
                multiple,
                onValueChange,
            ],
        );

        const onContentLayout = (e: LayoutChangeEvent) => {
            const { width, height } = e.nativeEvent.layout;
            setContentSize((p) =>
                p.width === width && p.height === height
                    ? p
                    : { width, height },
            );
            const pos = computeDropdownPosition(height);
            setDropdownPos(pos);
        };

        const displayValue = useMemo(() => {
            if (multiple && Array.isArray(currentValue)) {
                return currentValue.length ? currentValue.join(", ") : null;
            }
            return currentValue !== undefined &&
                currentValue !== null &&
                currentValue !== ""
                ? String(currentValue)
                : null;
        }, [currentValue, multiple]);

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
                    closeOnSelect: !multiple,
                    requestClose: closeDropdown,
                }}
            >
                <View ref={ref} style={{ position: "relative" }}>
                    <View ref={anchorRef} onLayout={onAnchorLayout}>
                        <SelectWrapper
                            disabled={disabled}
                            style={wrapperStyle}
                            onPress={() =>
                                open ? closeDropdown() : openDropdown()
                            }
                            {...props}
                        >
                            {startDecorator ? (
                                <DecoratorWrapper>
                                    {startDecorator}
                                </DecoratorWrapper>
                            ) : null}

                            <PlaceholderText
                                style={placeholderColorStyle}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                {displayValue ?? placeholder}
                            </PlaceholderText>

                            <DecoratorWrapper>
                                {endDecorator ?? <ArrowIcon reverse={open} />}
                            </DecoratorWrapper>
                        </SelectWrapper>
                    </View>

                    {open && (
                        <>
                            {closeOnClickOutside ? (
                                <Backdrop onPress={onBackdropPress} />
                            ) : null}

                            <DropdownPositioner
                                top={dropdownPos.top}
                                left={dropdownPos.left}
                                width={dropdownPos.width}
                            >
                                <ContentContainer
                                    onLayout={onContentLayout}
                                    style={{
                                        ...resolveSelectContentStyles(
                                            theme,
                                            color,
                                        )[variant],
                                        shadowOpacity: 0.15,
                                        shadowRadius: 6,
                                        elevation: 6,
                                    }}
                                >
                                    {children}
                                </ContentContainer>
                            </DropdownPositioner>
                        </>
                    )}
                </View>
            </SelectContext.Provider>
        );
    },
);
