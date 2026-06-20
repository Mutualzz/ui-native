import { forwardRef, useCallback, useMemo, useState } from "react";
import {
    PanResponder,
    View,
    type LayoutChangeEvent,
    type ViewStyle,
} from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { Slider } from "../Slider/Slider";
import { Stack } from "../Stack/Stack";
import { hsvaToColorLike, hsvaToHslaString, toHsva } from "./ColorPicker.helpers";
import type { ColorPickerProps } from "./ColorPicker.types";

const SATURATION_SIZE = 180;

export const ColorPicker = forwardRef<View, ColorPickerProps>(
    ({ color, allowAlpha = false, onChange }, ref) => {
        const [hsva, setHsva] = useState(() => toHsva(color));
        const [layout, setLayout] = useState({
            width: SATURATION_SIZE,
            height: SATURATION_SIZE,
        });

        const hueBackground = useMemo(
            () => `hsl(${hsva.h}, 100%, 50%)`,
            [hsva.h],
        );

        const updateColor = useCallback(
            (next: typeof hsva) => {
                setHsva(next);
                onChange?.(hsvaToColorLike(next));
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
            backgroundColor: hsvaToHslaString(hsva),
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
                    <Svg width="100%" height="100%">
                        <Defs>
                            <LinearGradient id="white" x1="0" y1="0" x2="1" y2="0">
                                <Stop offset="0%" stopColor="#fff" />
                                <Stop offset="100%" stopColor={hueBackground} />
                            </LinearGradient>
                            <LinearGradient id="black" x1="0" y1="0" x2="0" y2="1">
                                <Stop offset="0%" stopColor="transparent" />
                                <Stop offset="100%" stopColor="#000" />
                            </LinearGradient>
                        </Defs>
                        <Rect width="100%" height="100%" fill="url(#white)" />
                        <Rect width="100%" height="100%" fill="url(#black)" />
                    </Svg>
                    <View pointerEvents="none" style={pointerStyle} />
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
