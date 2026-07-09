import { useWindowDimensions } from "react-native";

import { isLargeTextEnabled } from "../utils/accessibility";

export function useFontScale() {
    const { fontScale } = useWindowDimensions();
    return fontScale;
}

export function useLargeTextEnabled() {
    const fontScale = useFontScale();
    return isLargeTextEnabled(fontScale);
}
