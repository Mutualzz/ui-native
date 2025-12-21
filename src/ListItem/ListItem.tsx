import styled from "@emotion/native";
import type {
    Color,
    ColorLike,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import { forwardRef, useContext, useMemo } from "react";
import type { View } from "react-native";
import { Text } from "react-native";
import { ListContext } from "../List/List.context";
import { NestedListContext } from "../List/NestedList.context";
import { useTheme } from "../useTheme";
import {
    cssMarkerToGlyph,
    isCssMarkerNative,
    resolveListItemSize,
    resolveListItemStyles,
    resolveListItemTextStyles,
} from "./ListItem.helpers";
import type { ListItemProps } from "./ListItem.types";

const Row = styled.View({
    flexDirection: "row",
    alignItems: "center",
});

const ListItemRoot = styled.View<{
    orientation: "vertical" | "horizontal";
    variant: Variant;
    color: Color | ColorLike;
    size: Size | SizeValue | number;
    marker?: string;
}>(({ theme, orientation, variant, color, size, marker }) => ({
    position: "relative",

    ...(marker ? { paddingVertical: 8 } : null),

    flexDirection: orientation === "horizontal" ? "row" : "row",
    alignItems: marker && !isCssMarkerNative(marker) ? "center" : "center",

    ...resolveListItemSize(theme, size),
    ...resolveListItemStyles(theme, color)[variant],
}));

const ListItem = forwardRef<View, ListItemProps & { marker?: string }>(
    (props, ref) => {
        const { theme } = useTheme();

        const nesting = useContext(NestedListContext);
        const {
            marker,
            color,
            orientation = "vertical",
            size = "md",
            variant = "plain",
        } = useContext(ListContext);

        const {
            children,
            startDecorator,
            endDecorator,
            color: colorOverride,
            marker: markerOverride,
            size: sizeOverride,
            variant: variantOverride,
            style,
            ...rest
        } = props;

        let markerToUse: string | undefined;
        if (markerOverride !== undefined) markerToUse = markerOverride;
        else if (typeof marker === "function") markerToUse = marker(nesting);
        else if (Array.isArray(marker))
            markerToUse = marker[nesting] ?? marker[marker.length - 1];
        else if (typeof marker === "string") markerToUse = marker;

        const shouldRenderCustomMarker =
            !isCssMarkerNative(markerToUse) &&
            markerToUse !== undefined &&
            markerToUse !== "";

        const shouldRenderCssMarker =
            isCssMarkerNative(markerToUse) && markerToUse !== "none";

        const markerGlyph = useMemo(() => {
            if (!markerToUse) return "";
            if (shouldRenderCustomMarker) return markerToUse;
            if (shouldRenderCssMarker) return cssMarkerToGlyph(markerToUse);
            return "";
        }, [markerToUse, shouldRenderCustomMarker, shouldRenderCssMarker]);

        const resolvedColor = colorOverride ?? color;
        const resolvedVariant = variantOverride ?? variant;
        const resolvedSize = sizeOverride ?? size;

        return (
            <ListItemRoot
                ref={ref}
                {...rest}
                orientation={orientation}
                color={resolvedColor ?? "neutral"}
                variant={resolvedVariant}
                size={resolvedSize}
                marker={markerToUse}
                style={style}
            >
                <Row style={{ gap: 8 }}>
                    {startDecorator}

                    {markerGlyph ? (
                        <Text
                            style={[
                                { minWidth: 16, textAlign: "center" },
                                resolveListItemTextStyles(
                                    theme,
                                    resolvedColor ?? "neutral",
                                ),
                            ]}
                        >
                            {markerGlyph}
                        </Text>
                    ) : null}

                    <Row style={{ flexShrink: 1, minWidth: 0 }}>{children}</Row>

                    {endDecorator}
                </Row>
            </ListItemRoot>
        );
    },
);

ListItem.displayName = "ListItem";

export { ListItem };
