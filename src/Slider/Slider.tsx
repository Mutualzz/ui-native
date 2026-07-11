import styled from "@emotion/native";
import {
    forwardRef,
    Fragment,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
    PanResponder,
    Text,
    View,
    type GestureResponderEvent,
    type LayoutChangeEvent,
} from "react-native";
import { useTheme } from "../useTheme";
import { MAX_FONT_SCALE_MULTIPLIER } from "../utils/accessibility";

import { formatColor } from "@mutualzz/ui-core";
import {
    resolveSliderLabelSize,
    resolveSliderThumbSize,
    resolveSliderThumbStyles,
    resolveSliderTickSize,
    resolveSliderTrackStyles,
    resolveSliderTrackThickness,
} from "./Slider.helpers";
import type {
    SliderMark,
    SliderOrientation,
    SliderProps,
} from "./Slider.types";

const SliderRoot = styled(View)<{
    disabled?: boolean;
    orientation: SliderOrientation;
}>(({ disabled, orientation }) => ({
    opacity: disabled ? 0.5 : 1,
    alignSelf: "stretch",
    ...(orientation === "horizontal" ? { width: "100%" } : { height: "100%" }),
}));

const TrackContainer = styled(View)<{
    thickness: number;
    orientation: SliderOrientation;
}>(({ thickness, orientation }) => ({
    position: "relative",
    borderRadius: 9999,
    flexGrow: 1,
    ...(orientation === "horizontal"
        ? { height: thickness, width: "100%" }
        : { width: thickness, height: "100%" }),
}));

const TrackHitArea = styled(View)<{ orientation: SliderOrientation }>(
    ({ orientation }) => ({
        justifyContent: "center",
        alignItems: "center",
        ...(orientation === "horizontal"
            ? { width: "100%", minHeight: 44 }
            : { height: "100%", minWidth: 44 }),
    }),
);

const TrackBase = styled(View)<{ orientation: SliderOrientation }>(() => ({
    position: "absolute",
    borderRadius: 9999,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
}));

const SegmentFilled = styled(View)<{
    orientation: SliderOrientation;
    startPct: number;
    endPct: number;
}>(({ orientation, startPct, endPct }) => ({
    position: "absolute",
    borderRadius: 9999,
    ...(orientation === "horizontal"
        ? {
              left: `${startPct}%`,
              width: `${endPct - startPct}%`,
              top: 0,
              bottom: 0,
          }
        : {
              bottom: `${startPct}%`,
              height: `${endPct - startPct}%`,
              left: 0,
              right: 0,
          }),
}));

const SegmentUnfilled = styled(View)<{
    orientation: SliderOrientation;
    startPct: number;
    endPct: number;
    bg: string;
}>(({ orientation, startPct, endPct, bg }) => ({
    position: "absolute",
    borderRadius: 9999,
    ...(orientation === "horizontal"
        ? {
              left: `${startPct}%`,
              width: `${endPct - startPct}%`,
              top: 0,
              bottom: 0,
          }
        : {
              bottom: `${startPct}%`,
              height: `${endPct - startPct}%`,
              left: 0,
              right: 0,
          }),
    backgroundColor: bg,
}));

const Tick = styled(View)<{
    orientation: SliderOrientation;
    sizePx: number;
    percent: number;
}>(({ orientation, sizePx, percent }) => {
    const minClamp = 1;
    const maxClamp = 99;
    const pct = Math.min(maxClamp, Math.max(minClamp, percent));

    return {
        position: "absolute",
        width: sizePx,
        height: sizePx,
        borderRadius: sizePx / 2,
        ...(orientation === "horizontal"
            ? {
                  left: `${pct}%`,
                  top: "50%",
                  transform: [
                      { translateX: -sizePx / 2 },
                      { translateY: -sizePx / 2 },
                  ],
              }
            : {
                  bottom: `${pct}%`,
                  left: "50%",
                  transform: [
                      { translateX: -sizePx / 2 },
                      { translateY: sizePx / 2 },
                  ],
              }),
    };
});

const Thumb = styled(View)<{
    orientation: SliderOrientation;
    percent: number;
    sizePx: number;
}>(({ orientation, percent, sizePx }) => ({
    position: "absolute",
    zIndex: 2,
    ...(orientation === "horizontal"
        ? {
              left: `${percent}%`,
              top: "50%",
              transform: [
                  { translateX: -sizePx / 2 },
                  { translateY: -sizePx / 2 },
              ],
          }
        : {
              top: `${100 - percent}%`,
              left: "50%",
              transform: [
                  { translateX: -sizePx / 2 },
                  { translateY: -sizePx / 2 },
              ],
          }),
}));

const ValueLabel = styled(View)<{
    orientation: SliderOrientation;
    percent: number;
    fontSize: number;
    thumbSize: number;
    bg: string;
}>(({ orientation, percent, fontSize, thumbSize, bg }) => {
    const labelOffset = thumbSize + 10;
    const pct = Math.min(Math.max(percent, 0), 100);

    return {
        position: "absolute",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        backgroundColor: bg,
        zIndex: 3,
        fontSize,
        ...(orientation === "horizontal"
            ? {
                  left: `${pct}%`,
                  top: -labelOffset,
                  transform: [{ translateX: -50 }],
              }
            : {
                  left: -labelOffset,
                  top: `${100 - pct}%`,
                  transform: [{ translateY: -10 }],
              }),
    };
});

const ValueLabelText = styled(Text)<{ fontSize: number; color: string }>(
    ({ fontSize, color }) => ({
        fontSize,
        color,
    }),
);

const MarkLabel = styled(Text)<{
    orientation: SliderOrientation;
    percent: number;
    fontSize: number;
    color: string;
}>(({ orientation, percent, fontSize, color }) => ({
    position: "absolute",
    fontSize,
    color,
    ...(orientation === "horizontal"
        ? { left: `${percent}%`, top: 18, transform: [{ translateX: -30 }] }
        : {
              top: `${100 - percent}%`,
              left: 18,
              transform: [{ translateY: -8 }],
          }),
}));

export const Slider = forwardRef<View, SliderProps>(
    (
        {
            color = "primary",
            variant = "solid",
            size = "md",
            min = 0,
            max = 100,
            step = null,
            defaultValue,
            value,
            onChange,
            onChangeCommitted,
            orientation = "horizontal",
            disabled,
            marks,
            valueLabelDisplay = "off",
            valueLabelFormat,
            getAriaLabel,
            getAriaValueText,
            disableSwap,
            ...rest
        },
        ref,
    ) => {
        const { t } = useTranslation("common");
        const { theme } = useTheme();

        const isRange = Array.isArray(value ?? defaultValue);
        const [internalValue, setInternalValue] = useState<number[]>(
            isRange
                ? ((defaultValue as number[] | undefined) ?? [min, max])
                : [(defaultValue as number | undefined) ?? min],
        );

        const isControlled = value !== undefined;
        const currentValue: number[] = isControlled
            ? Array.isArray(value)
                ? value
                : [value as number]
            : internalValue;

        const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
        // Local override while dragging so the thumb stays under the finger
        // even if a controlled parent updates slowly / out of order.
        const [dragValue, setDragValue] = useState<number[] | null>(null);
        const displayValue = dragValue ?? currentValue;

        const trackRef = useRef<View>(null);
        const trackLenRef = useRef(0);
        const trackOriginRef = useRef({ x: 0, y: 0 });
        const draggingIndexRef = useRef<number | null>(null);
        const currentValueRef = useRef(currentValue);
        const displayValueRef = useRef(displayValue);
        const isRangeRef = useRef(isRange);
        const disabledRef = useRef(disabled);
        const orientationRef = useRef(orientation);
        const isControlledRef = useRef(isControlled);
        const disableSwapRef = useRef(disableSwap);
        const onChangeRef = useRef(onChange);
        const onChangeCommittedRef = useRef(onChangeCommitted);
        const resolveValueRef = useRef<(v: number) => number>((v) => v);

        useEffect(() => {
            currentValueRef.current = currentValue;
        }, [currentValue]);
        useEffect(() => {
            displayValueRef.current = displayValue;
        }, [displayValue]);
        useEffect(() => {
            isRangeRef.current = isRange;
            disabledRef.current = disabled;
            orientationRef.current = orientation;
            isControlledRef.current = isControlled;
            disableSwapRef.current = disableSwap;
            onChangeRef.current = onChange;
            onChangeCommittedRef.current = onChangeCommitted;
        });

        const percents = useMemo(
            () => displayValue.map((v) => ((v - min) / (max - min)) * 100),
            [displayValue, min, max],
        );
        const sortedPercents = useMemo(
            () => [...percents].sort((a, b) => a - b),
            [percents],
        );

        const resolvedMarks: SliderMark[] = useMemo(() => {
            if (marks === true) {
                const s = step ?? 1;
                const out: SliderMark[] = [];
                for (let i = min; i <= max; i += s) out.push({ value: i });
                return out;
            }
            if (Array.isArray(marks)) {
                const seen = new Set<number>();
                return marks.filter((m) =>
                    seen.has(m.value) ? false : (seen.add(m.value), true),
                );
            }
            return [];
        }, [marks, min, max, step]);

        const snapToMarks = useCallback(
            (val: number) => {
                if (!Array.isArray(marks)) return val;
                const sorted = [min, max, ...marks.map((m) => m.value)]
                    .filter((v, i, a) => a.indexOf(v) === i)
                    .sort((a, b) => a - b);
                return sorted.reduce(
                    (closest, curr) =>
                        Math.abs(curr - val) < Math.abs(closest - val)
                            ? curr
                            : closest,
                    sorted[0],
                );
            },
            [marks, min, max],
        );

        const resolveValue = useCallback(
            (newVal: number) => {
                let v = newVal;
                if (v < min) v = min;
                if (v > max) v = max;
                if (step === null) v = snapToMarks(v);
                else v = Math.round(v / step) * step;
                if (v < min) v = min;
                if (v > max) v = max;
                return v;
            },
            [min, max, step, snapToMarks],
        );

        useEffect(() => {
            resolveValueRef.current = resolveValue;
        }, [resolveValue]);

        const applyValue = useCallback((index: number, newVal: number) => {
            if (disabledRef.current) return;

            const v = resolveValueRef.current(newVal);
            const base = displayValueRef.current;

            if (isRangeRef.current && disableSwapRef.current) {
                if (index === 0 && v > base[1]) return;
                if (index === 1 && v < base[0]) return;
            }

            const next = [...base];
            next[index] = v;

            // Keep the thumb glued to the gesture immediately.
            setDragValue(next);
            displayValueRef.current = next;

            if (!isControlledRef.current) setInternalValue(next);
            onChangeRef.current?.(isRangeRef.current ? next : next[0]);
        }, []);

        const posToValue = useCallback(
            (posPx: number) => {
                const len = trackLenRef.current || 1;
                const clamped = Math.min(Math.max(posPx / len, 0), 1);
                return clamped * (max - min) + min;
            },
            [min, max],
        );
        const posToValueRef = useRef(posToValue);
        useEffect(() => {
            posToValueRef.current = posToValue;
        }, [posToValue]);

        const eventToPos = useCallback((evt: GestureResponderEvent) => {
            const { pageX, pageY } = evt.nativeEvent;
            if (orientationRef.current === "horizontal") {
                return pageX - trackOriginRef.current.x;
            }
            return trackLenRef.current - (pageY - trackOriginRef.current.y);
        }, []);

        const syncTrackOrigin = useCallback((evt: GestureResponderEvent) => {
            const { locationX, locationY, pageX, pageY } = evt.nativeEvent;
            // Derive window origin from this event so the first move frames
            // don't wait on async measureInWindow.
            trackOriginRef.current = {
                x: pageX - locationX,
                y: pageY - locationY,
            };
        }, []);

        const onTrackLayout = (e: LayoutChangeEvent) => {
            const { width, height } = e.nativeEvent.layout;
            trackLenRef.current =
                orientationRef.current === "horizontal" ? width : height;
            trackRef.current?.measureInWindow((x, y, w, h) => {
                trackOriginRef.current = { x, y };
                trackLenRef.current =
                    orientationRef.current === "horizontal" ? w : h;
            });
        };

        const endDrag = useCallback(() => {
            const finalVals = displayValueRef.current;
            const final = isRangeRef.current ? [...finalVals] : finalVals[0];
            draggingIndexRef.current = null;
            setDraggingIndex(null);
            setDragValue(null);
            onChangeCommittedRef.current?.(final);
        }, []);

        // Stable PanResponder — never recreate mid-drag (that caused snap/lag).
        const panResponder = useMemo(
            () =>
                PanResponder.create({
                    onStartShouldSetPanResponder: () => !disabledRef.current,
                    onMoveShouldSetPanResponder: () => !disabledRef.current,
                    onPanResponderTerminationRequest: () => false,
                    onPanResponderGrant: (evt) => {
                        syncTrackOrigin(evt);

                        const clickedVal = posToValueRef.current(
                            eventToPos(evt),
                        );
                        const base = currentValueRef.current;
                        let idx = 0;
                        if (isRangeRef.current) {
                            const d0 = Math.abs(base[0] - clickedVal);
                            const d1 = Math.abs(base[1] - clickedVal);
                            idx = d0 <= d1 ? 0 : 1;
                        }

                        draggingIndexRef.current = idx;
                        setDraggingIndex(idx);
                        // Seed drag state from the committed value before applying.
                        displayValueRef.current = [...base];
                        applyValue(idx, clickedVal);
                    },
                    onPanResponderMove: (evt) => {
                        const idx = draggingIndexRef.current;
                        if (idx === null) return;
                        applyValue(idx, posToValueRef.current(eventToPos(evt)));
                    },
                    onPanResponderRelease: endDrag,
                    onPanResponderTerminate: endDrag,
                }),
            [applyValue, endDrag, eventToPos, syncTrackOrigin],
        );

        const thumbSize = resolveSliderThumbSize(theme, size);
        const thumbPx = Number(thumbSize.width);
        const thickness = resolveSliderTrackThickness(theme, size);
        const tickPx = Number(resolveSliderTickSize(theme, size).width);
        const labelFont = resolveSliderLabelSize(theme, size);

        const neutralTrack = useMemo(
            () =>
                formatColor(theme.colors.neutral, {
                    darken: 25,
                    format: "hexa",
                }),
            [theme],
        );

        const trackStyleObj = resolveSliderTrackStyles(
            theme,
            color,
            draggingIndex !== null,
        )[variant];
        const thumbStyleObj = resolveSliderThumbStyles(
            theme,
            color,
            draggingIndex !== null,
        )[variant];

        const renderValueLabel = (val: number, idx: number) => {
            if (valueLabelFormat) {
                if (typeof valueLabelFormat === "function")
                    return valueLabelFormat(val, idx);
                return valueLabelFormat
                    .replace("{value}", String(val))
                    .replace("{index}", String(idx));
            }
            if (getAriaValueText) return getAriaValueText(val, idx);
            if (getAriaLabel) return getAriaLabel(idx);
            return Number.isFinite(val) ? val.toFixed(0) : String(val);
        };

        // Without this, "adjustable" only tells a screen reader that
        // *something* can be adjusted — it never announces the current
        // value, and swiping up/down (the standard adjustable gesture)
        // does nothing without an onAccessibilityAction handler.
        const stepAmount = step ?? 1;

        const handleAccessibilityAction = useCallback(
            (event: { nativeEvent: { actionName: string } }) => {
                if (disabled || isRange) return;

                if (event.nativeEvent.actionName === "increment") {
                    const next = resolveValue(currentValue[0] + stepAmount);
                    applyValue(0, next);
                    onChangeCommitted?.(next);
                } else if (event.nativeEvent.actionName === "decrement") {
                    const next = resolveValue(currentValue[0] - stepAmount);
                    applyValue(0, next);
                    onChangeCommitted?.(next);
                }
            },
            [
                disabled,
                isRange,
                applyValue,
                resolveValue,
                currentValue,
                stepAmount,
                onChangeCommitted,
            ],
        );

        const toAccessibilityText = (node: ReturnType<typeof renderValueLabel>) =>
            typeof node === "string" || typeof node === "number"
                ? String(node)
                : undefined;

        const accessibilityValue = isRange
            ? {
                  min,
                  max,
                  text: `${toAccessibilityText(renderValueLabel(currentValue[0], 0)) ?? currentValue[0]} to ${toAccessibilityText(renderValueLabel(currentValue[1], 1)) ?? currentValue[1]}`,
              }
            : {
                  min,
                  max,
                  now: currentValue[0],
                  text: toAccessibilityText(renderValueLabel(currentValue[0], 0)),
              };

        return (
            <SliderRoot
                ref={ref}
                orientation={orientation}
                disabled={disabled}
                {...rest}
                accessibilityRole="adjustable"
                accessibilityValue={accessibilityValue}
                accessibilityActions={
                    isRange
                        ? undefined
                        : [{ name: "increment" }, { name: "decrement" }]
                }
                onAccessibilityAction={handleAccessibilityAction}
                accessibilityHint={
                    isRange
                        ? t("a11y.rangeSliderHint", {
                              defaultValue:
                                  "Range slider. Adjust by dragging.",
                          })
                        : undefined
                }
            >
                <TrackHitArea
                    ref={trackRef}
                    orientation={orientation}
                    onLayout={onTrackLayout}
                    {...panResponder.panHandlers}
                >
                    <TrackContainer
                        orientation={orientation}
                        thickness={thickness}
                    >
                    <TrackBase
                        orientation={orientation}
                        style={{ backgroundColor: neutralTrack }}
                    />

                    {isRange ? (
                        <>
                            <SegmentFilled
                                orientation={orientation}
                                startPct={0}
                                endPct={sortedPercents[0]}
                                style={trackStyleObj}
                            />
                            <SegmentUnfilled
                                orientation={orientation}
                                startPct={sortedPercents[0]}
                                endPct={sortedPercents[1]}
                                bg={neutralTrack}
                            />
                            <SegmentFilled
                                orientation={orientation}
                                startPct={sortedPercents[1]}
                                endPct={100}
                                style={trackStyleObj}
                            />
                        </>
                    ) : (
                        <>
                            <SegmentFilled
                                orientation={orientation}
                                startPct={0}
                                endPct={sortedPercents[0]}
                                style={trackStyleObj}
                            />
                            <SegmentUnfilled
                                orientation={orientation}
                                startPct={sortedPercents[0]}
                                endPct={100}
                                bg={neutralTrack}
                            />
                        </>
                    )}

                    {resolvedMarks.map((m, i) => {
                        const pct = ((m.value - min) / (max - min)) * 100;
                        return (
                            <Fragment key={`m-${i}`}>
                                <Tick
                                    orientation={orientation}
                                    percent={pct}
                                    sizePx={tickPx}
                                    style={{
                                        backgroundColor:
                                            theme.colors.common.white,
                                    }}
                                />
                                {marks !== true ? (
                                    <MarkLabel
                                        orientation={orientation}
                                        percent={pct}
                                        fontSize={labelFont}
                                        color={theme.typography.colors.accent}
                                        maxFontSizeMultiplier={
                                            MAX_FONT_SCALE_MULTIPLIER
                                        }
                                    >
                                        {m.label ?? m.value}
                                    </MarkLabel>
                                ) : null}
                            </Fragment>
                        );
                    })}

                    {displayValue.map((val, i) => {
                        const pct = percents[i];
                        const showLabel =
                            valueLabelDisplay === "on" ||
                            (valueLabelDisplay === "auto" &&
                                draggingIndex === i);

                        return (
                            <Fragment key={`t-${i}`}>
                                <Thumb
                                    orientation={orientation}
                                    percent={pct}
                                    sizePx={thumbPx}
                                    style={{
                                        ...thumbSize,
                                        ...thumbStyleObj,
                                    }}
                                />
                                {showLabel ? (
                                    <ValueLabel
                                        orientation={orientation}
                                        percent={pct}
                                        fontSize={labelFont}
                                        thumbSize={thumbPx}
                                        bg={theme.colors.neutral}
                                    >
                                        <ValueLabelText
                                            fontSize={labelFont}
                                            color={
                                                theme.typography.colors.primary
                                            }
                                            maxFontSizeMultiplier={
                                                MAX_FONT_SCALE_MULTIPLIER
                                            }
                                        >
                                            {renderValueLabel(val, i)}
                                        </ValueLabelText>
                                    </ValueLabel>
                                ) : null}
                            </Fragment>
                        );
                    })}
                </TrackContainer>
                </TrackHitArea>
            </SliderRoot>
        );
    },
);

Slider.displayName = "Slider";
