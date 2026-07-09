import styled from "@emotion/native";
import {
    forwardRef,
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import {
    BackHandler,
    Pressable,
    Modal as RNModal,
    StyleSheet,
    useWindowDimensions,
    View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { IconButton } from "../IconButton/IconButton";
import type { ModalProps } from "./Modal.types";

const DISMISS_DISTANCE = 120;
const DISMISS_VELOCITY = 900;
const SPRING_CONFIG = {
    damping: 22,
    stiffness: 240,
    mass: 0.85,
};

let openModalCount = 0;

export function hasOpenModals() {
    return openModalCount > 0;
}

const ModalRoot = styled.View<{ layout: "center" | "fullscreen" }>(
    ({ layout }) => ({
        flex: 1,

        ...(layout === "center"
            ? {
                  justifyContent: "center",
                  alignItems: "center",
                  paddingVertical: 32,
              }
            : {
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
              }),
    }),
);

const BACKDROP_COLOR = "rgba(0,0,0,0.35)";

const ModalContainer = styled.View<{
    layout: "center" | "fullscreen";
    height?: number;
}>(({ layout, height }) => {
    if (layout === "center") {
        return {
            position: "relative",
            width: "100%",
            maxWidth: 720,
            maxHeight: "100%",
            overflow: "hidden",
            alignSelf: "center",
            ...(height != null ? { height } : {}),
        };
    }

    return {
        position: "relative",
        width: "100%",
        alignSelf: "stretch",
        flex: 1,
    };
});

const ModalContent = styled.View<{
    layout: "center" | "fullscreen";
    height?: number;
}>(({ layout, height }) => {
    if (layout === "center") {
        return {
            width: "100%",
            minHeight: 0,
            position: "relative",
            overflow: "hidden",
            ...(height != null ? { height } : {}),
        };
    }

    return {
        width: "100%",
        minHeight: 0,
        position: "relative",
        alignSelf: "stretch",
        flex: 1,
    };
});

const CloseButton = styled(IconButton)<{ layout: "center" | "fullscreen" }>(
    ({ layout }) => ({
        alignSelf: "flex-end",
        marginTop: layout === "fullscreen" ? 48 : 24,
        marginRight: layout === "fullscreen" ? 48 : 24,
        marginBottom: -48,
        zIndex: 1,
        borderRadius: 16,
        width: layout === "fullscreen" ? 44 : 40,
        height: layout === "fullscreen" ? 44 : 40,
        padding: 0,
        alignItems: "center",
        justifyContent: "center",
    }),
);

const CloseGlyph = styled.Text<{ layout: "center" | "fullscreen" }>(
    ({ layout }) => ({
        fontSize: layout === "fullscreen" ? 18 : 16,
        lineHeight: layout === "fullscreen" ? 18 : 16,
        fontWeight: "700",
    }),
);

const Modal = forwardRef<View, ModalProps>(
    (
        {
            children,
            open,
            keepMounted = false,
            layout = "center",
            height,
            hideBackdrop = false,
            disableBackdropClick = false,
            showCloseButton = true,
            closeButton,
            onClose,

            style,
            ...props
        },
        ref,
    ) => {
        const visible = open;
        const canClose = Boolean(onClose);
        const { height: windowHeight } = useWindowDimensions();
        const [mounted, setMounted] = useState(visible);
        const animationGeneration = useRef(0);
        const onCloseRef = useRef(onClose);
        const wasVisibleRef = useRef(visible);
        onCloseRef.current = onClose;

        const translateY = useSharedValue(windowHeight);
        const backdropOpacity = useSharedValue(0);
        const dragStartY = useSharedValue(0);

        const finishClose = useCallback(() => {
            setMounted(false);
            onCloseRef.current?.();
        }, []);

        const animateOpen = useCallback(() => {
            animationGeneration.current += 1;
            translateY.value = windowHeight;
            backdropOpacity.value = 0;
            translateY.value = withSpring(0, SPRING_CONFIG);
            backdropOpacity.value = withSpring(1, SPRING_CONFIG);
        }, [backdropOpacity, translateY, windowHeight]);

        const animateClose = useCallback(
            (onComplete?: () => void) => {
                const generation = animationGeneration.current + 1;
                animationGeneration.current = generation;
                translateY.value = withSpring(
                    windowHeight,
                    SPRING_CONFIG,
                    (finished) => {
                        if (!finished || animationGeneration.current !== generation) {
                            return;
                        }
                        if (onComplete) runOnJS(onComplete)();
                    },
                );
                backdropOpacity.value = withSpring(0, SPRING_CONFIG);
            },
            [backdropOpacity, translateY, windowHeight],
        );

        const requestClose = useCallback(() => {
            if (!canClose) return;
            animateClose(finishClose);
        }, [animateClose, canClose, finishClose]);

        const showBackdrop = !hideBackdrop;
        const backdropDismissible =
            showBackdrop && canClose && !disableBackdropClick;
        const isFullscreen = layout === "fullscreen";

        useEffect(() => {
            if (visible) {
                wasVisibleRef.current = true;
                setMounted(true);
                return;
            }

            if (!wasVisibleRef.current || !mounted) return;
            wasVisibleRef.current = false;

            animateClose(() => {
                setMounted(false);
            });
        }, [animateClose, mounted, visible]);

        useLayoutEffect(() => {
            if (!mounted || !visible) return;
            animateOpen();
        }, [animateOpen, mounted, visible, windowHeight]);

        useEffect(() => {
            if (!mounted) return;

            openModalCount += 1;
            const subscription = BackHandler.addEventListener(
                "hardwareBackPress",
                () => {
                    if (!canClose) return false;
                    requestClose();
                    return true;
                },
            );

            return () => {
                openModalCount = Math.max(0, openModalCount - 1);
                subscription.remove();
            };
        }, [canClose, mounted, requestClose]);

        const panGesture = Gesture.Pan()
            .enabled(canClose && !disableBackdropClick)
            .activeOffsetY(8)
            .failOffsetX([-20, 20])
            .onStart(() => {
                dragStartY.value = translateY.value;
            })
            .onUpdate((event) => {
                const nextY = Math.max(0, dragStartY.value + event.translationY);
                translateY.value = nextY;
                backdropOpacity.value = Math.max(
                    0,
                    1 - nextY / (windowHeight * 0.45),
                );
            })
            .onEnd((event) => {
                const shouldDismiss =
                    translateY.value > DISMISS_DISTANCE ||
                    event.velocityY > DISMISS_VELOCITY;

                if (shouldDismiss) {
                    runOnJS(requestClose)();
                    return;
                }

                translateY.value = withSpring(0, SPRING_CONFIG);
                backdropOpacity.value = withSpring(1, SPRING_CONFIG);
            });

        const backdropStyle = useAnimatedStyle(() => ({
            opacity: backdropOpacity.value,
        }));

        const modalStyle = useAnimatedStyle(() => ({
            transform: [{ translateY: translateY.value }],
        }));

        if (!mounted && !keepMounted) return null;

        const modalBody = (
            <ModalRoot layout={layout} style={style} {...props}>
                {showBackdrop ? (
                    <Animated.View
                        pointerEvents="none"
                        style={[
                            StyleSheet.absoluteFill,
                            backdropStyle,
                            { backgroundColor: BACKDROP_COLOR },
                        ]}
                    />
                ) : null}

                {backdropDismissible && layout === "center" ? (
                    <Pressable
                        style={StyleSheet.absoluteFill}
                        onPress={requestClose}
                        accessibilityLabel="Close modal"
                    />
                ) : null}

                <GestureDetector gesture={panGesture}>
                    <Animated.View
                        pointerEvents="box-none"
                        style={[
                            {
                                width: "100%",
                                alignSelf: "stretch",
                                ...(isFullscreen ? { flex: 1 } : {}),
                            },
                            modalStyle,
                        ]}
                    >
                        {backdropDismissible && isFullscreen ? (
                            <Pressable
                                style={StyleSheet.absoluteFill}
                                onPress={requestClose}
                                accessibilityLabel="Close modal"
                            />
                        ) : null}

                        <ModalContainer
                            ref={ref}
                            layout={layout}
                            height={height}
                            pointerEvents="box-none"
                        >
                            {showCloseButton &&
                                (disableBackdropClick || canClose) &&
                                (closeButton ?? (
                                    <CloseButton
                                        color="neutral"
                                        variant="plain"
                                        layout={layout}
                                        onPress={requestClose}
                                        disabled={!canClose}
                                        accessibilityLabel="Close modal"
                                    >
                                        <CloseGlyph layout={layout}>
                                            ✕
                                        </CloseGlyph>
                                    </CloseButton>
                                ))}

                            <ModalContent
                                layout={layout}
                                height={height}
                                pointerEvents="box-none"
                            >
                                {children}
                            </ModalContent>
                        </ModalContainer>
                    </Animated.View>
                </GestureDetector>
            </ModalRoot>
        );

        return (
            <RNModal
                visible={mounted}
                transparent
                animationType="none"
                onRequestClose={requestClose}
            >
                {layout === "center" ? (
                    <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior="padding"
                        automaticOffset
                    >
                        {modalBody}
                    </KeyboardAvoidingView>
                ) : (
                    modalBody
                )}
            </RNModal>
        );
    },
);

Modal.displayName = "Modal";

export { Modal, ModalRoot };
