import { Dimensions, PixelRatio } from "react-native";

const { width } = Dimensions.get("window");
const BASE_WIDTH = 390;

export const scale = (size: number) => (width / BASE_WIDTH) * size;

export const fontScale = (size: number) =>
    PixelRatio.roundToNearestPixel(scale(size));
