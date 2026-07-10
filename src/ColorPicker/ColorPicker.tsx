import {
    computeInsertedStopPosition,
    createColor,
    handleColor,
    randomColor,
    snap,
    type HsvaColor,
} from "@mutualzz/ui-core";
import { PlusIcon, XIcon } from "phosphor-react-native";
import {
    forwardRef,
    useCallback,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    PanResponder,
    Pressable,
    View,
    type LayoutChangeEvent,
    type ViewStyle,
} from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { Button } from "../Button/Button";
import { IconButton } from "../IconButton/IconButton";
import { Slider } from "../Slider/Slider";
import { Stack } from "../Stack/Stack";
import { Typography } from "../Typography/Typography";
import { useTheme } from "../useTheme";
import {
    COLOR_PICKER_WIDTH,
    createPickerGradientStops,
    enforceMinGap,
    gradientStopsToLinearGradient,
    hsvaToDisplayHex,
    hueToHex,
    newStopId,
    sortStops,
    sortStopsStable,
} from "./ColorPicker.helpers";
import type { ColorPickerProps, GradientStop } from "./ColorPicker.types";

const PICKER_WIDTH = COLOR_PICKER_WIDTH;
const HUE_BAR_HEIGHT = 24;
const DRAG_THRESHOLD_PX = 3;

export const ColorPicker = forwardRef<View, ColorPickerProps>(
    (
        {
            color,
            allowAlpha = false,
            allowGradient = false,
            onChange,
            currentStop: currentStopProp = 0,
            onStopChange,
            rotation: rotationProp = 90,
            onRotationChange,
        },
        ref,
    ) => {
        const { theme } = useTheme();
        const gradientId = useId().replace(/:/g, "");

        const [stops, setStops] = useState<GradientStop[]>(() => {
            return createPickerGradientStops(color).stops;
        });

        const [selectedStopId, setSelectedStopId] = useState<string | null>(
            () => stops[currentStopProp]?.id ?? stops[0]?.id ?? null,
        );
        const [rotation, setRotation] = useState(() =>
            createPickerGradientStops(color).angle,
        );
        const [barWidth, setBarWidth] = useState(PICKER_WIDTH);
        const [hueBarWidth, setHueBarWidth] = useState(PICKER_WIDTH);
        const [draggingId, setDraggingId] = useState<string | null>(null);

        const currentStop = useMemo(() => {
            if (!selectedStopId) return 0;
            const idx = stops.findIndex((s) => s.id === selectedStopId);
            return idx === -1 ? 0 : idx;
        }, [stops, selectedStopId]);

        const lastSyncedColor = useRef(color);
        const dragStartX = useRef(0);
        const dragStopId = useRef<string | null>(null);
        const dragActive = useRef(false);
        const stopsRef = useRef(stops);
        stopsRef.current = stops;
        const currentStopRef = useRef(currentStop);
        currentStopRef.current = currentStop;
        const rotationRef = useRef(rotation);
        rotationRef.current = rotation;

        const notifyChange = useCallback(
            (nextStops: GradientStop[]) => {
                queueMicrotask(() => {
                    if (allowGradient && nextStops.length > 1) {
                        onChange?.(
                            gradientStopsToLinearGradient(
                                rotationRef.current,
                                nextStops,
                            ),
                        );
                        return;
                    }

                    const stop =
                        nextStops[currentStopRef.current] ?? nextStops[0];
                    if (!stop) return;
                    const { position, id, ...hsvaOnly } = stop;
                    onChange?.(handleColor(hsvaOnly).hex);
                });
            },
            [allowGradient, onChange],
        );

        const commitStops = useCallback(
            (
                next: GradientStop[],
                options?: {
                    selectId?: string;
                    stopIndex?: number;
                    emit?: boolean;
                },
            ) => {
                stopsRef.current = next;
                setStops(next);

                if (options?.selectId) {
                    setSelectedStopId(options.selectId);
                }
                if (options?.stopIndex != null) {
                    onStopChange?.(options.stopIndex);
                }
                if (options?.emit !== false) {
                    notifyChange(next);
                }
            },
            [notifyChange, onStopChange],
        );

        const hsva = useMemo(
            () =>
                stops[currentStop] ??
                stops[stops.length - 1] ??
                handleColor(randomColor("hsv")).hsva,
            [stops, currentStop],
        );

        const [layout, setLayout] = useState({
            width: PICKER_WIDTH,
            height: PICKER_WIDTH,
        });

        useEffect(() => {
            if (allowGradient && stops.length > 1) return;
            if (lastSyncedColor.current === color) return;

            const parsed = createPickerGradientStops(
                color,
                stops.map((stop) => stop.id),
            );
            const sorted = sortStops(parsed.stops);

            stopsRef.current = sorted;
            setStops(sorted);
            setRotation(parsed.angle);
            setSelectedStopId((prevId) => {
                if (prevId && sorted.some((s) => s.id === prevId)) {
                    return prevId;
                }
                return sorted[0]?.id ?? null;
            });

            lastSyncedColor.current = color;
        }, [allowGradient, color, stops.length]);

        useEffect(() => {
            setRotation(rotationProp);
        }, [rotationProp]);

        const selectStop = (id: string) => {
            const idx = stops.findIndex((s) => s.id === id);
            if (idx === -1) return;
            setSelectedStopId(id);
            onStopChange?.(idx);
        };

        const updateStopColor = useCallback(
            (value: HsvaColor) => {
                const prev = stopsRef.current;
                const next = [...prev];
                const target = next[currentStopRef.current];
                if (!target) return;
                next[currentStopRef.current] = { ...target, ...value };
                commitStops(next);
            },
            [commitStops],
        );

        const addStop = () => {
            const prev = stopsRef.current;
            if (prev.length >= 5) return;
            const base = hsva;
            const addedId = newStopId();

            const nextRaw: GradientStop[] = [
                ...prev,
                {
                    ...base,
                    id: addedId,
                    h: (base.h + 40) % 360,
                    position: computeInsertedStopPosition(
                        prev,
                        selectedStopId ?? prev[currentStop]?.id ?? "",
                    ),
                },
            ];

            const nextPosition = enforceMinGap(
                nextRaw,
                addedId,
                nextRaw[nextRaw.length - 1]?.position ?? 100,
            );

            const next = sortStops(
                nextRaw.map((stop) =>
                    stop.id === addedId
                        ? { ...stop, position: nextPosition }
                        : stop,
                ),
            );
            const newIndex = next.findIndex((s) => s.id === addedId);

            commitStops(next, {
                selectId: addedId,
                stopIndex: newIndex === -1 ? next.length - 1 : newIndex,
            });
        };

        const removeStop = () => {
            const prev = stopsRef.current;
            if (prev.length <= 1) return;

            const next = sortStops(
                prev.filter((_, i) => i !== currentStopRef.current),
            );
            const nextId =
                next[Math.min(currentStopRef.current, next.length - 1)]?.id;

            commitStops(next, {
                selectId: nextId ?? undefined,
            });
        };

        const barPanResponder = useMemo(
            () =>
                PanResponder.create({
                    onStartShouldSetPanResponder: () => allowGradient,
                    onMoveShouldSetPanResponder: () => allowGradient,
                    onPanResponderGrant: (event) => {
                        const x = event.nativeEvent.locationX;
                        dragStartX.current = x;
                        dragActive.current = false;

                        const nearest = stops.reduce<{
                            id: string;
                            distance: number;
                        } | null>((best, stop) => {
                            const stopX = (stop.position / 100) * barWidth;
                            const distance = Math.abs(stopX - x);
                            if (!best || distance < best.distance) {
                                return { id: stop.id, distance };
                            }
                            return best;
                        }, null);

                        dragStopId.current = nearest?.id ?? stops[0]?.id ?? null;
                        if (dragStopId.current) selectStop(dragStopId.current);
                    },
                    onPanResponderMove: (event) => {
                        if (!dragStopId.current || barWidth <= 0) return;
                        const x = event.nativeEvent.locationX;
                        if (!dragActive.current) {
                            if (Math.abs(x - dragStartX.current) < DRAG_THRESHOLD_PX) {
                                return;
                            }
                            dragActive.current = true;
                            setDraggingId(dragStopId.current);
                        }

                        const activeId = dragStopId.current;
                        const rawPercent = snap(
                            Math.max(0, Math.min(100, (x / barWidth) * 100)),
                            0.1,
                        );

                        const prev = stopsRef.current;
                        const nextPos = enforceMinGap(prev, activeId, rawPercent);
                        const next = prev.map((s) =>
                            s.id === activeId ? { ...s, position: nextPos } : s,
                        );
                        stopsRef.current = next;
                        setStops(next);
                        notifyChange(next);
                    },
                    onPanResponderRelease: () => {
                        const sorted = sortStopsStable(stopsRef.current);
                        commitStops(sorted);
                        dragActive.current = false;
                        dragStopId.current = null;
                        setDraggingId(null);
                    },
                    onPanResponderTerminate: () => {
                        dragActive.current = false;
                        dragStopId.current = null;
                        setDraggingId(null);
                    },
                }),
            [allowGradient, barWidth, commitStops, notifyChange, stops],
        );

        const onSaturationLayout = (event: LayoutChangeEvent) => {
            const { width, height } = event.nativeEvent.layout;
            if (width > 0 && height > 0) {
                setLayout((current) =>
                    current.width === width && current.height === height
                        ? current
                        : { width, height },
                );
            }
        };

        const updateFromPoint = useCallback(
            (x: number, y: number) => {
                const s = Math.max(0, Math.min(100, (x / layout.width) * 100));
                const v = Math.max(
                    0,
                    Math.min(100, 100 - (y / layout.height) * 100),
                );
                updateStopColor({ ...hsva, s, v });
            },
            [hsva, layout.height, layout.width, updateStopColor],
        );

        const saturationPanResponder = useMemo(
            () =>
                PanResponder.create({
                    onStartShouldSetPanResponder: () => true,
                    onMoveShouldSetPanResponder: () => true,
                    onPanResponderGrant: (event) => {
                        const { locationX, locationY } = event.nativeEvent;
                        updateFromPoint(locationX, locationY);
                    },
                    onPanResponderMove: (event) => {
                        const { locationX, locationY } = event.nativeEvent;
                        updateFromPoint(locationX, locationY);
                    },
                }),
            [updateFromPoint],
        );

        const updateHueFromPoint = useCallback(
            (x: number) => {
                const h = Math.max(
                    0,
                    Math.min(360, (x / hueBarWidth) * 360),
                );
                updateStopColor({ ...hsva, h: snap(h, 1) });
            },
            [hsva, hueBarWidth, updateStopColor],
        );

        const huePanResponder = useMemo(
            () =>
                PanResponder.create({
                    onStartShouldSetPanResponder: () => true,
                    onMoveShouldSetPanResponder: () => true,
                    onPanResponderGrant: (event) => {
                        updateHueFromPoint(event.nativeEvent.locationX);
                    },
                    onPanResponderMove: (event) => {
                        updateHueFromPoint(event.nativeEvent.locationX);
                    },
                }),
            [updateHueFromPoint],
        );

        const hueBackground = useMemo(() => hueToHex(hsva.h), [hsva.h]);
        const satGradientId = `${gradientId}-sat`;
        const valGradientId = `${gradientId}-val`;
        const hueGradientId = `${gradientId}-hue`;
        const previewGradientId = `${gradientId}-preview`;

        const pointerStyle: ViewStyle = {
            position: "absolute",
            width: 14,
            height: 14,
            borderRadius: 7,
            borderWidth: 2,
            borderColor: "#fff",
            left: (hsva.s / 100) * layout.width - 7,
            top: (1 - hsva.v / 100) * layout.height - 7,
            backgroundColor: hsvaToDisplayHex(hsva),
        };

        const huePointerStyle: ViewStyle = {
            position: "absolute",
            width: 14,
            height: 14,
            borderRadius: 7,
            borderWidth: 2,
            borderColor: "#fff",
            left: (hsva.h / 360) * hueBarWidth - 7,
            top: HUE_BAR_HEIGHT / 2 - 7,
            backgroundColor: hueBackground,
        };

        const getBorderColor = (stop: HsvaColor) =>
            createColor(handleColor(stop).hex).isLight()
                ? theme.colors.common.black
                : theme.colors.common.white;

        return (
            <Stack
                ref={ref}
                direction="column"
                style={{
                    gap: 10,
                    width: PICKER_WIDTH,
                    alignSelf: "center",
                    flexShrink: 0,
                }}
            >
                {allowGradient ? (
                    <View
                        onLayout={(event) => {
                            const width = event.nativeEvent.layout.width;
                            if (width > 0) setBarWidth(width);
                        }}
                        style={{
                            width: PICKER_WIDTH,
                            height: 32,
                            borderRadius: 10,
                            overflow: "visible",
                            justifyContent: "center",
                        }}
                        {...barPanResponder.panHandlers}
                    >
                        <Svg
                            width={barWidth}
                            height={32}
                            style={{ borderRadius: 10 }}
                        >
                            <Defs>
                                <LinearGradient
                                    id={previewGradientId}
                                    x1="0"
                                    y1="0"
                                    x2="1"
                                    y2="0"
                                >
                                    {sortStops(stops).map((stop) => (
                                        <Stop
                                            key={stop.id}
                                            offset={`${stop.position}%`}
                                            stopColor={hsvaToDisplayHex(stop)}
                                        />
                                    ))}
                                </LinearGradient>
                            </Defs>
                            <Rect
                                x={0}
                                y={0}
                                width={barWidth}
                                height={32}
                                rx={10}
                                fill={`url(#${previewGradientId})`}
                            />
                        </Svg>

                        {stops.length > 1
                            ? stops.map((stop, index) => (
                                  <Pressable
                                      key={stop.id}
                                      onPress={() => selectStop(stop.id)}
                                      style={{
                                          position: "absolute",
                                          left: `${stop.position}%`,
                                          top: "50%",
                                          width: 22,
                                          height: 22,
                                          marginLeft: -11,
                                          marginTop: -11,
                                          borderRadius: 6,
                                          backgroundColor: hsvaToDisplayHex(stop),
                                          borderWidth: 2,
                                          borderColor: getBorderColor(stop),
                                          zIndex:
                                              currentStop === index ||
                                              draggingId === stop.id
                                                  ? 2
                                                  : 1,
                                      }}
                                  />
                              ))
                            : null}
                    </View>
                ) : null}

                <View
                    onLayout={onSaturationLayout}
                    style={{
                        width: PICKER_WIDTH,
                        height: PICKER_WIDTH,
                        borderRadius: 8,
                        overflow: "hidden",
                    }}
                    {...saturationPanResponder.panHandlers}
                >
                    <Svg width={layout.width} height={layout.height}>
                        <Defs>
                            <LinearGradient
                                id={satGradientId}
                                x1="0"
                                y1="0"
                                x2="1"
                                y2="0"
                            >
                                <Stop offset="0%" stopColor="#ffffff" />
                                <Stop offset="100%" stopColor={hueBackground} />
                            </LinearGradient>
                            <LinearGradient
                                id={valGradientId}
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <Stop
                                    offset="0%"
                                    stopColor="#000000"
                                    stopOpacity="0"
                                />
                                <Stop
                                    offset="100%"
                                    stopColor="#000000"
                                    stopOpacity="1"
                                />
                            </LinearGradient>
                        </Defs>
                        <Rect
                            x={0}
                            y={0}
                            width={layout.width}
                            height={layout.height}
                            fill={hueBackground}
                        />
                        <Rect
                            x={0}
                            y={0}
                            width={layout.width}
                            height={layout.height}
                            fill={`url(#${satGradientId})`}
                        />
                        <Rect
                            x={0}
                            y={0}
                            width={layout.width}
                            height={layout.height}
                            fill={`url(#${valGradientId})`}
                        />
                    </Svg>
                    <View pointerEvents="none" style={pointerStyle} />
                </View>

                <Stack
                    direction="row"
                    alignItems="center"
                    style={{ gap: 8, width: PICKER_WIDTH, flexShrink: 0 }}
                >
                    <View
                        onLayout={(event) => {
                            const width = event.nativeEvent.layout.width;
                            if (width > 0) setHueBarWidth(width);
                        }}
                        style={{
                            flex: 1,
                            height: HUE_BAR_HEIGHT,
                            borderRadius: 8,
                            overflow: "hidden",
                        }}
                        {...huePanResponder.panHandlers}
                    >
                        <Svg width={hueBarWidth} height={HUE_BAR_HEIGHT}>
                            <Defs>
                                <LinearGradient
                                    id={hueGradientId}
                                    x1="0"
                                    y1="0"
                                    x2="1"
                                    y2="0"
                                >
                                    <Stop offset="0%" stopColor="#ff0000" />
                                    <Stop offset="17%" stopColor="#ffff00" />
                                    <Stop offset="33%" stopColor="#00ff00" />
                                    <Stop offset="50%" stopColor="#00ffff" />
                                    <Stop offset="67%" stopColor="#0000ff" />
                                    <Stop offset="83%" stopColor="#ff00ff" />
                                    <Stop offset="100%" stopColor="#ff0000" />
                                </LinearGradient>
                            </Defs>
                            <Rect
                                x={0}
                                y={0}
                                width={hueBarWidth}
                                height={HUE_BAR_HEIGHT}
                                fill={`url(#${hueGradientId})`}
                            />
                        </Svg>
                        <View pointerEvents="none" style={huePointerStyle} />
                    </View>

                    {allowGradient && stops.length > 1 ? (
                        <IconButton
                            color="danger"
                            variant="plain"
                            onPress={removeStop}
                            accessibilityLabel="Remove color stop"
                        >
                            <XIcon size={16} weight="bold" />
                        </IconButton>
                    ) : null}
                </Stack>

                {allowGradient ? (
                    <Button
                        color="primary"
                        disabled={stops.length >= 5}
                        onPress={addStop}
                        startDecorator={<PlusIcon size={14} weight="bold" />}
                    >
                        Add color
                    </Button>
                ) : null}

                {allowAlpha ? (
                    <View style={{ width: PICKER_WIDTH, flexShrink: 0 }}>
                        <Slider
                            min={0}
                            max={1}
                            step={0.01}
                            value={hsva.alpha}
                            onChange={(value) =>
                                updateStopColor({
                                    ...hsva,
                                    alpha: Array.isArray(value) ? value[0] : value,
                                })
                            }
                        />
                    </View>
                ) : null}

                {allowGradient && stops.length > 1 ? (
                    <Stack
                        direction="column"
                        style={{ gap: 6, width: PICKER_WIDTH, flexShrink: 0 }}
                    >
                        <Typography level="body-sm" textColor="secondary">
                            Angle {rotation}°
                        </Typography>
                        <Slider
                            min={0}
                            max={360}
                            step={1}
                            value={rotation}
                            onChange={(value) => {
                                const next = Array.isArray(value) ? value[0] : value;
                                setRotation(next);
                                onRotationChange?.(next);
                                rotationRef.current = next;
                                queueMicrotask(() => {
                                    if (stopsRef.current.length > 1) {
                                        onChange?.(
                                            gradientStopsToLinearGradient(
                                                next,
                                                stopsRef.current,
                                            ),
                                        );
                                    }
                                });
                            }}
                        />
                    </Stack>
                ) : null}
            </Stack>
        );
    },
);

ColorPicker.displayName = "ColorPicker";
