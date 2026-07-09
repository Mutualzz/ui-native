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
    View,
    type LayoutChangeEvent,
    type ViewStyle,
} from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { Slider } from "../Slider/Slider";
import { Stack } from "../Stack/Stack";
import {
    hsvaToColorLike,
    hsvaToDisplayHex,
    hueToHex,
    toHsva,
} from "./ColorPicker.helpers";
import type { ColorPickerProps } from "./ColorPicker.types";

const SATURATION_SIZE = 180;

export const ColorPicker = forwardRef<View, ColorPickerProps>(
    ({ color, allowAlpha = false, onChange }, ref) => {
        const gradientId = useId().replace(/:/g, "");
        const [hsva, setHsva] = useState(() => toHsva(color));
        const [layout, setLayout] = useState({
            width: SATURATION_SIZE,
            height: SATURATION_SIZE,
        });

        const lastEmitted = useRef(color);

        useEffect(() => {
            if (color === lastEmitted.current) return;
            lastEmitted.current = color;
            setHsva(toHsva(color));
        }, [color]);

        const hueBackground = useMemo(() => hueToHex(hsva.h), [hsva.h]);
        const satGradientId = `${gradientId}-sat`;
        const valGradientId = `${gradientId}-val`;
        const hueGradientId = `${gradientId}-hue`;

        const updateColor = useCallback(
            (next: typeof hsva) => {
                setHsva(next);
                const colorLike = hsvaToColorLike(next);
                lastEmitted.current = colorLike;
                onChange?.(colorLike);
            },
            [onChange],
        );

        const updateFromPoint = useCallback(
            (x: number, y: number) => {
                const s = Math.max(0, Math.min(100, (x / layout.width) * 100));
                const v = Math.max(
                    0,
                    Math.min(100, 100 - (y / layout.height) * 100),
                );
                updateColor({ ...hsva, s, v });
            },
            [hsva, layout.height, layout.width, updateColor],
        );

        const panResponder = useMemo(
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

        const pointerStyle: ViewStyle = {
            position: "absolute",
            left: (hsva.s / 100) * layout.width - 8,
            top: (1 - hsva.v / 100) * layout.height - 8,
            width: 16,
            height: 16,
            borderRadius: 8,
            borderWidth: 2,
            borderColor: "#fff",
            backgroundColor: hsvaToDisplayHex(hsva),
        };

        return (
            <Stack ref={ref} spacing={2} p={2} width={SATURATION_SIZE + 16}>
                <View
                    onLayout={(event: LayoutChangeEvent) => {
                        const { width, height } = event.nativeEvent.layout;
                        setLayout({ width, height });
                    }}
                    style={{
                        width: SATURATION_SIZE,
                        height: SATURATION_SIZE,
                        borderRadius: 8,
                        overflow: "hidden",
                    }}
                    {...panResponder.panHandlers}
                >
                    <Svg
                        width={layout.width}
                        height={layout.height}
                        viewBox={`0 0 ${layout.width} ${layout.height}`}
                    >
                        <Defs>
                            <LinearGradient
                                id={satGradientId}
                                x1="0"
                                y1="0"
                                x2="1"
                                y2="0"
                            >
                                <Stop
                                    offset="0%"
                                    stopColor="#ffffff"
                                    stopOpacity="1"
                                />
                                <Stop
                                    offset="100%"
                                    stopColor="#ffffff"
                                    stopOpacity="0"
                                />
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

                <View
                    style={{
                        width: SATURATION_SIZE,
                        height: 16,
                        borderRadius: 8,
                        overflow: "hidden",
                    }}
                >
                    <Svg width={SATURATION_SIZE} height={16}>
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
                            width={SATURATION_SIZE}
                            height={16}
                            fill={`url(#${hueGradientId})`}
                        />
                    </Svg>
                </View>

                <Slider
                    min={0}
                    max={360}
                    step={1}
                    value={hsva.h}
                    onChange={(value) =>
                        updateColor({
                            ...hsva,
                            h: Array.isArray(value) ? value[0] : value,
                        })
                    }
                />

                {allowAlpha ? (
                    <Slider
                        min={0}
                        max={1}
                        step={0.01}
                        value={hsva.alpha}
                        onChange={(value) =>
                            updateColor({
                                ...hsva,
                                alpha: Array.isArray(value) ? value[0] : value,
                            })
                        }
                    />
                ) : null}
            </Stack>
        );
    },
);

ColorPicker.displayName = "ColorPicker";
