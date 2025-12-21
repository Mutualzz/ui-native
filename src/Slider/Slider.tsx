import styled from "@emotion/native";
import {
    forwardRef,
    Fragment,
    useCallback,
    useMemo,
    useRef,
    useState,
} from "react";
import { PanResponder, Text, View, type LayoutChangeEvent } from "react-native";
import { useTheme } from "../useTheme";

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

        const trackLenRef = useRef(0);

        const percents = useMemo(
            () => currentValue.map((v) => ((v - min) / (max - min)) * 100),
            [currentValue, min, max],
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

        const emitChange = useCallback(
            (vals: number[]) => {
                onChange?.(isRange ? vals : vals[0]);
            },
            [onChange, isRange],
        );

        const updateValue = useCallback(
            (index: number, newVal: number) => {
                if (disabled) return;

                let v = newVal;
                if (v < min) v = min;
                if (v > max) v = max;
                if (step === null) v = snapToMarks(v);
                else v = Math.round(v / step) * step;

                if (isRange && disableSwap) {
                    if (index === 0 && v > currentValue[1]) return;
                    if (index === 1 && v < currentValue[0]) return;
                }

                const next = [...currentValue];
                next[index] = v;

                if (!isControlled) setInternalValue(next);
                emitChange(next);
            },
            [
                disabled,
                min,
                max,
                step,
                snapToMarks,
                isRange,
                disableSwap,
                currentValue,
                isControlled,
                emitChange,
            ],
        );

        const posToValue = useCallback(
            (posPx: number) => {
                const len = trackLenRef.current || 1;
                const clamped = Math.min(Math.max(posPx / len, 0), 1);
                const raw = clamped * (max - min) + min;
                return raw;
            },
            [min, max],
        );

        const pickClosestThumb = useCallback(
            (val: number) => {
                if (!isRange) return 0;
                const d0 = Math.abs(currentValue[0] - val);
                const d1 = Math.abs(currentValue[1] - val);
                return d0 <= d1 ? 0 : 1;
            },
            [isRange, currentValue],
        );

        const onTrackLayout = (e: LayoutChangeEvent) => {
            const { width, height } = e.nativeEvent.layout;
            trackLenRef.current = orientation === "horizontal" ? width : height;
        };

        const panResponder = useMemo(
            () =>
                PanResponder.create({
                    onStartShouldSetPanResponder: () => !disabled,
                    onMoveShouldSetPanResponder: () => !disabled,
                    onPanResponderGrant: (evt) => {
                        setDraggingIndex((prev) => prev ?? 0);

                        const { locationX, locationY } = evt.nativeEvent;
                        const pos =
                            orientation === "horizontal"
                                ? locationX
                                : trackLenRef.current - locationY;
                        const clickedVal = posToValue(pos);
                        const idx = pickClosestThumb(clickedVal);

                        setDraggingIndex(idx);
                        updateValue(idx, clickedVal);
                    },
                    onPanResponderMove: (evt) => {
                        if (draggingIndex === null) return;
                        const { locationX, locationY } = evt.nativeEvent;
                        const pos =
                            orientation === "horizontal"
                                ? locationX
                                : trackLenRef.current - locationY;
                        const v = posToValue(pos);
                        updateValue(draggingIndex, v);
                    },
                    onPanResponderRelease: () => {
                        const final = isRange
                            ? [...currentValue]
                            : currentValue[0];
                        setDraggingIndex(null);
                        onChangeCommitted?.(final);
                    },
                    onPanResponderTerminate: () => {
                        const final = isRange
                            ? [...currentValue]
                            : currentValue[0];
                        setDraggingIndex(null);
                        onChangeCommitted?.(final);
                    },
                }),
            [
                disabled,
                draggingIndex,
                orientation,
                posToValue,
                pickClosestThumb,
                updateValue,
                onChangeCommitted,
                isRange,
                currentValue,
            ],
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

        return (
            <SliderRoot
                ref={ref}
                orientation={orientation}
                disabled={disabled}
                {...rest}
                accessibilityRole="adjustable"
            >
                <TrackContainer
                    orientation={orientation}
                    thickness={thickness}
                    onLayout={onTrackLayout}
                    {...panResponder.panHandlers}
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
                                    >
                                        {m.label ?? m.value}
                                    </MarkLabel>
                                ) : null}
                            </Fragment>
                        );
                    })}

                    {currentValue.map((val, i) => {
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
                                        >
                                            {renderValueLabel(val, i)}
                                        </ValueLabelText>
                                    </ValueLabel>
                                ) : null}
                            </Fragment>
                        );
                    })}
                </TrackContainer>
            </SliderRoot>
        );
    },
);

Slider.displayName = "Slider";
