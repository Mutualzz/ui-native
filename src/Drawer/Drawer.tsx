import styled from "@emotion/native";
import { forwardRef, useEffect, useMemo, useRef } from "react";
import {
    Animated,
    Modal,
    PanResponder,
    View,
    type ViewStyle,
} from "react-native";
import { resolvePaperStyles } from "../Paper/Paper.helpers";
import { useTheme } from "../useTheme";
import {
    getClosedTranslate,
    resolveDrawerSize,
    resolveSwipeArea,
    resolveSwipeThreshold,
} from "./Drawer.helpers";
import type { DrawerProps } from "./Drawer.types";

const Backdrop = styled.Pressable({
    ...{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    backgroundColor: "rgba(0,0,0,0.4)",
});

const SwipeableArea = styled.View({
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
});

const Drawer = forwardRef<View, DrawerProps>(
    (
        {
            color = "primary",
            variant = "elevation",
            size = "md",
            open,
            elevation = 0,
            hideBackdrop,
            onOpen,
            onClose,
            anchor = "left",
            swipeable = true,
            transparency = 90,
            disablePortal = false,
            swipeArea = "md",
            threshold = "md",
            children,
            style,
            ...props
        },
        ref,
    ) => {
        const { theme } = useTheme();

        const drawerSizePx = resolveDrawerSize(theme, anchor, size);
        const resolvedArea = resolveSwipeArea(theme, swipeArea);
        const resolvedThreshold = resolveSwipeThreshold(theme, threshold);

        const closed = getClosedTranslate(anchor, drawerSizePx);

        const translateX = useRef(
            new Animated.Value(open ? 0 : closed.x),
        ).current;
        const translateY = useRef(
            new Animated.Value(open ? 0 : closed.y),
        ).current;

        useEffect(() => {
            Animated.timing(translateX, {
                toValue: open ? 0 : closed.x,
                duration: 300,
                useNativeDriver: true,
            }).start();
            Animated.timing(translateY, {
                toValue: open ? 0 : closed.y,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }, [open, closed.x, closed.y, translateX, translateY]);

        const closePanResponder = useMemo(
            () =>
                PanResponder.create({
                    onMoveShouldSetPanResponder: () => swipeable && open,
                    onPanResponderRelease: (_evt, gesture) => {
                        if (!swipeable || !open) return;

                        const dx = gesture.dx;
                        const dy = gesture.dy;

                        let shouldClose = false;
                        if (anchor === "left" && dx < -resolvedThreshold)
                            shouldClose = true;
                        if (anchor === "right" && dx > resolvedThreshold)
                            shouldClose = true;
                        if (anchor === "top" && dy < -resolvedThreshold)
                            shouldClose = true;
                        if (anchor === "bottom" && dy > resolvedThreshold)
                            shouldClose = true;

                        if (shouldClose) onClose();
                    },
                }),
            [swipeable, open, anchor, resolvedThreshold, onClose],
        );

        const openPanResponder = useMemo(
            () =>
                PanResponder.create({
                    onMoveShouldSetPanResponder: () => swipeable && !open,
                    onPanResponderRelease: (_evt, gesture) => {
                        if (!swipeable || open) return;

                        const dx = gesture.dx;
                        const dy = gesture.dy;

                        let shouldOpen = false;
                        if (anchor === "left" && dx > resolvedThreshold)
                            shouldOpen = true;
                        if (anchor === "right" && dx < -resolvedThreshold)
                            shouldOpen = true;
                        if (anchor === "top" && dy > resolvedThreshold)
                            shouldOpen = true;
                        if (anchor === "bottom" && dy < -resolvedThreshold)
                            shouldOpen = true;

                        if (shouldOpen) onOpen();
                    },
                }),
            [swipeable, open, anchor, resolvedThreshold, onOpen],
        );

        const paperStyle = resolvePaperStyles(
            theme,
            color,
            variant,
            elevation,
            transparency,
        )[variant];

        const basePositionStyle: ViewStyle =
            anchor === "left"
                ? { left: 0, top: 0, bottom: 0, width: drawerSizePx }
                : anchor === "right"
                  ? { right: 0, top: 0, bottom: 0, width: drawerSizePx }
                  : anchor === "top"
                    ? { top: 0, left: 0, right: 0, height: drawerSizePx }
                    : { bottom: 0, left: 0, right: 0, height: drawerSizePx };

        const drawerNode = (
            <View style={{ flex: 1 }} pointerEvents="box-none">
                {!hideBackdrop && open && <Backdrop onPress={onClose} />}

                <Animated.View
                    ref={ref}
                    {...props}
                    {...closePanResponder.panHandlers}
                    style={[
                        {
                            position: "absolute",
                            zIndex: theme.zIndex?.drawer ?? 1200,
                            overflow: "hidden",
                            flexDirection:
                                anchor === "left" || anchor === "right"
                                    ? "column"
                                    : "row",
                            transform: [{ translateX }, { translateY }],
                        },
                        basePositionStyle,
                        paperStyle,
                        style,
                    ]}
                >
                    {children}
                </Animated.View>

                {!open && swipeable && (
                    <SwipeableArea
                        pointerEvents="auto"
                        {...openPanResponder.panHandlers}
                        style={
                            anchor === "left"
                                ? {
                                      left: 0,
                                      top: 0,
                                      bottom: 0,
                                      width: resolvedArea,
                                  }
                                : anchor === "right"
                                  ? {
                                        right: 0,
                                        top: 0,
                                        bottom: 0,
                                        width: resolvedArea,
                                    }
                                  : anchor === "top"
                                    ? {
                                          top: 0,
                                          left: 0,
                                          right: 0,
                                          height: resolvedArea,
                                      }
                                    : {
                                          bottom: 0,
                                          left: 0,
                                          right: 0,
                                          height: resolvedArea,
                                      }
                        }
                    />
                )}
            </View>
        );

        if (disablePortal) return drawerNode;

        return (
            <Modal visible={open || swipeable} transparent animationType="none">
                {drawerNode}
            </Modal>
        );
    },
);

Drawer.displayName = "Drawer";

export { Drawer };
