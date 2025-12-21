import styled from "@emotion/native";
import {
    Children,
    cloneElement,
    forwardRef,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    Modal,
    Pressable,
    Text,
    View,
    useWindowDimensions,
} from "react-native";
import { useTheme } from "../useTheme";

import {
    computePosition,
    resolveTooltipContainerSize,
    resolveTooltipContainerStyles,
    resolveTooltipTextStyles,
} from "./Tooltip.helpers";
import type { Rect, TooltipProps } from "./Tooltip.types";

const Backdrop = styled(Pressable)({
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
});

const TipContainer = styled(View)({
    position: "absolute",
    maxWidth: 280,
});

const TipBubble = styled(View)({
    flexDirection: "row",
    alignItems: "center",
});

const TipText = styled(Text)({
    lineHeight: 16,
});

export const Tooltip = forwardRef<View, TooltipProps>(
    (
        {
            id,
            title,
            content,
            children,
            placement = "top",
            open: openProp,
            defaultOpen,
            onHover,
            enterDelay = 100,
            leaveDelay = 100,
            disableTouchListener,
            color = "neutral",
            variant = "none",
            size = "md",
            elevation = 2,
            offset = 8,
            ...props
        },
        ref,
    ) => {
        const { theme } = useTheme();
        const { width: sw, height: sh } = useWindowDimensions();

        const label = content ?? title;

        const isControlled = openProp !== undefined;
        const [uncontrolled, setUncontrolled] = useState(!!defaultOpen);
        const open = isControlled ? !!openProp : uncontrolled;

        const anchorRef = useRef<View>(null);

        const [anchorRect, setAnchorRect] = useState<Rect | null>(null);
        const [tipSize, setTipSize] = useState<{
            width: number;
            height: number;
        } | null>(null);
        const [pos, setPos] = useState<{ left: number; top: number } | null>(
            null,
        );

        const enterTimer = useRef<NodeJS.Timeout | undefined>(undefined);
        const leaveTimer = useRef<NodeJS.Timeout | undefined>(undefined);

        const setOpen = (val: boolean) => {
            if (!isControlled) setUncontrolled(val);
            onHover?.(val);
        };

        const measureAnchor = () =>
            new Promise<Rect | null>((resolve) => {
                const node = anchorRef.current;
                if (!node?.measureInWindow) return resolve(null);
                node.measureInWindow(
                    (x: number, y: number, width: number, height: number) =>
                        resolve({ x, y, width, height }),
                );
            });

        const scheduleOpen = async () => {
            if (disableTouchListener) return;
            clearTimeout(leaveTimer.current);
            clearTimeout(enterTimer.current);

            enterTimer.current = setTimeout(async () => {
                const rect = await measureAnchor();
                if (!rect) return;
                setAnchorRect(rect);
                setOpen(true);
            }, enterDelay);
        };

        const scheduleClose = () => {
            clearTimeout(enterTimer.current);
            clearTimeout(leaveTimer.current);

            leaveTimer.current = setTimeout(() => {
                setOpen(false);
                setTipSize(null);
                setPos(null);
            }, leaveDelay);
        };

        useEffect(() => {
            return () => {
                clearTimeout(enterTimer.current);
                clearTimeout(leaveTimer.current);
            };
        }, []);

        useEffect(() => {
            if (!open || !anchorRect || !tipSize) return;
            setPos(
                computePosition({
                    placement,
                    anchor: anchorRect,
                    tip: tipSize,
                    screen: { width: sw, height: sh },
                    offset,
                }),
            );
        }, [open, anchorRect, tipSize, placement, sw, sh, offset]);

        const containerSize = useMemo(
            () => resolveTooltipContainerSize(theme, size),
            [theme, size],
        );

        const containerStyle = useMemo(() => {
            const base = resolveTooltipContainerStyles(theme, color, elevation)[
                variant
            ];

            return {
                paddingVertical: containerSize.paddingVertical,
                paddingHorizontal: containerSize.paddingHorizontal,
                borderRadius: containerSize.borderRadius,
                ...base,
            };
        }, [theme, color, elevation, variant, containerSize]);

        const textStyle = useMemo(
            () => ({
                fontSize: containerSize.fontSize,
                ...resolveTooltipTextStyles(theme, color)[variant],
            }),
            [theme, color, variant, containerSize.fontSize],
        );

        const child = children ? Children.only<any>(children) : null;

        const wrappedChild =
            child &&
            cloneElement(child, {
                ref: anchorRef,
                onPressIn: (...args: any[]) => {
                    child.props?.onPressIn?.(...args);
                    void scheduleOpen();
                },
                onPressOut: (...args: any[]) => {
                    child.props?.onPressOut?.(...args);
                    scheduleClose();
                },
                onLongPress: (...args: any[]) => {
                    child.props?.onLongPress?.(...args);
                    if (disableTouchListener) return;
                    clearTimeout(enterTimer.current);
                    void (async () => {
                        const rect = await measureAnchor();
                        if (!rect) return;
                        setAnchorRect(rect);
                        setOpen(true);
                    })();
                },
            });

        return (
            <View ref={ref} {...props}>
                {wrappedChild}

                <Modal
                    transparent
                    visible={open && !!label}
                    animationType="none"
                    onRequestClose={() => setOpen(false)}
                >
                    <Backdrop onPress={() => setOpen(false)} />

                    <TipContainer
                        style={
                            pos
                                ? {
                                      left: pos.left,
                                      top: pos.top,
                                  }
                                : { left: -9999, top: -9999 }
                        }
                        onLayout={(e) => {
                            const { width, height } = e.nativeEvent.layout;
                            if (
                                !tipSize ||
                                tipSize.width !== width ||
                                tipSize.height !== height
                            ) {
                                setTipSize({ width, height });
                            }
                        }}
                    >
                        <TipBubble style={containerStyle}>
                            {typeof label === "string" ||
                            typeof label === "number" ? (
                                <TipText style={textStyle}>{label}</TipText>
                            ) : (
                                label
                            )}
                        </TipBubble>
                    </TipContainer>
                </Modal>
            </View>
        );
    },
);
