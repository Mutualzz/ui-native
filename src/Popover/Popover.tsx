import styled from "@emotion/native";
import { clamp } from "@mutualzz/ui-core";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import {
    Modal,
    Pressable,
    useWindowDimensions,
    type LayoutChangeEvent,
    type View,
} from "react-native";

import { Paper } from "../Paper/Paper";
import {
    getBestPlacement,
    getPopoverPosition,
    resolvePopoverSize,
    resolvePopoverStyles,
    type PopoverPlacement,
    type Rect,
} from "./Popover.helpers";
import type { PopoverProps } from "./Popover.types";

const OFFSET = 10;

const PopoverRoot = styled.View({
    position: "relative",
    alignSelf: "flex-start",
});

const Backdrop = styled(Pressable)({
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
});

const PopoverContainer = styled.View<{ top: number; left: number }>(
    ({ top, left }) => ({
        position: "absolute",
        top,
        left,
    }),
);

const PopoverContent = styled(Paper)<{
    placement?: PopoverPlacement;
    size: PopoverProps["size"];
    transparency: number;
}>(
    ({
        theme,
        size = "md",
        color = "neutral",

        variant = "elevation",
        elevation = 0,
        transparency = 80,
    }) => ({
        borderRadius: 4,
        zIndex: theme.zIndex?.tooltip ?? 9999,
        ...resolvePopoverSize(theme, size),
        ...resolvePopoverStyles(theme, color, variant, elevation, transparency)[
            variant
        ],
    }),
);

export const Popover = forwardRef<View, PopoverProps>(
    (
        {
            color = "primary",
            variant = "elevation",
            size = "md",
            trigger,
            children,
            isOpen: isOpenProp,
            disablePortal = false,
            closeOnClickOutside = true,
            closeOnInteract = false,
            placement: placementProp,
            elevation = 0,
            transparency = 80,
            ...props
        },
        ref,
    ) => {
        const { width: viewportWidth, height: viewportHeight } =
            useWindowDimensions();

        const [visible, setVisible] = useState(false);
        const [measured, setMeasured] = useState(false);
        const [position, setPosition] = useState({ top: 0, left: 0 });
        const [internalPlacement, setInternalPlacement] =
            useState<PopoverPlacement>("bottom");
        const [popoverSize, setPopoverSize] = useState({ width: 0, height: 0 });

        const triggerRef = useRef<View>(null);

        const isControlled = isOpenProp !== undefined;
        const isOpen = isControlled ? !!isOpenProp : visible;
        const placement = placementProp ?? internalPlacement;

        const measureTriggerInWindow =
            useCallback(async (): Promise<Rect | null> => {
                const node = triggerRef.current;
                if (!node) return null;

                return new Promise((resolve) => {
                    node.measureInWindow(
                        (
                            x: number,
                            y: number,
                            width: number,
                            height: number,
                        ) => {
                            if (!width && !height) return resolve(null);
                            resolve({ x, y, width, height });
                        },
                    );
                });
            }, []);

        const updatePosition = useCallback(async () => {
            if (!isOpen) return;
            if (popoverSize.width === 0 && popoverSize.height === 0) return;

            const triggerRect = await measureTriggerInWindow();
            if (!triggerRect) return;

            const popoverRect: Rect = {
                x: 0,
                y: 0,
                width: popoverSize.width,
                height: popoverSize.height,
            };

            const best = getBestPlacement(
                triggerRect,
                popoverRect,
                viewportWidth,
                viewportHeight,
                OFFSET,
            );
            setInternalPlacement(best);

            const bestPos = getPopoverPosition(
                best,
                triggerRect,
                popoverRect,
                OFFSET,
            );

            const clamped = {
                top: clamp(
                    bestPos.top,
                    0,
                    Math.max(0, viewportHeight - popoverRect.height),
                ),
                left: clamp(
                    bestPos.left,
                    0,
                    Math.max(0, viewportWidth - popoverRect.width),
                ),
            };

            setPosition(clamped);
            setMeasured(true);
        }, [
            isOpen,
            measureTriggerInWindow,
            popoverSize.height,
            popoverSize.width,
            viewportHeight,
            viewportWidth,
        ]);

        useEffect(() => {
            if (!isOpen) {
                setMeasured(false);
                return;
            }
            const t = setTimeout(() => void updatePosition(), 0);
            return () => clearTimeout(t);
        }, [isOpen, updatePosition]);

        useEffect(() => {
            if (!isOpen) return;
            void updatePosition();
        }, [viewportWidth, viewportHeight, isOpen, updatePosition]);

        const close = useCallback(() => {
            if (!isControlled) setVisible(false);
        }, [isControlled]);

        const toggleVisibility = () => {
            if (!isControlled) setVisible((p) => !p);
        };

        const onBackdropPress = () => {
            if (!closeOnClickOutside) return;
            close();
        };

        const onContentPress = () => {
            if (!closeOnInteract) return;
            close();
        };

        const onPopoverLayout = (e: LayoutChangeEvent) => {
            const { width, height } = e.nativeEvent.layout;
            setPopoverSize((prev) =>
                prev.width === width && prev.height === height
                    ? prev
                    : { width, height },
            );
        };

        const content = isOpen ? (
            <PopoverContainer
                top={measured ? position.top : -99999}
                left={measured ? position.left : -99999}
            >
                <PopoverContent
                    {...props}
                    color={color}
                    variant={variant}
                    size={size}
                    transparency={transparency}
                    elevation={elevation}
                    placement={placement}
                    onLayout={onPopoverLayout}
                >
                    <Pressable onPress={onContentPress}>{children}</Pressable>
                </PopoverContent>
            </PopoverContainer>
        ) : null;

        return (
            <PopoverRoot ref={ref}>
                <Pressable ref={triggerRef} onPress={toggleVisibility}>
                    {trigger}
                </Pressable>

                {isOpen ? (
                    disablePortal ? (
                        <>
                            {closeOnClickOutside ? (
                                <Backdrop onPress={onBackdropPress} />
                            ) : null}
                            {content}
                        </>
                    ) : (
                        <Modal
                            transparent
                            visible
                            animationType="none"
                            onRequestClose={close}
                        >
                            {closeOnClickOutside ? (
                                <Backdrop onPress={onBackdropPress} />
                            ) : null}
                            {content}
                        </Modal>
                    )
                ) : null}
            </PopoverRoot>
        );
    },
);

Popover.displayName = "Popover";
