import styled from "@emotion/native";
import type { Color, ColorLike, Variant } from "@mutualzz/ui-core";
import { forwardRef, useContext } from "react";
import type { View } from "react-native";
import { ListContext } from "./List.context";
import { resolveListStyles } from "./List.helpers";
import type { ListProps } from "./List.types";
import { NestedListContext } from "./NestedList.context";

const INDENT_PX = 24;

const ListRoot = styled.View<{
    nesting: number;
    orientation: "vertical" | "horizontal";
    color: Color | ColorLike;
    variant: Variant;
}>(({ theme, nesting, orientation, color, variant }) => ({
    width: "100%",
    flexGrow: 1,
    position: "relative",
    alignSelf: "flex-start",

    paddingLeft: nesting * INDENT_PX,

    flexDirection: orientation === "horizontal" ? "row" : "column",

    ...resolveListStyles(theme, color)[variant],
}));

const List = forwardRef<View, ListProps>(
    (
        {
            marker,
            children,
            orientation = "vertical",
            color = "neutral",
            variant = "plain",
            size,
            style,
            ...props
        },
        ref,
    ) => {
        const parentNesting = useContext(NestedListContext);

        return (
            <ListContext.Provider
                value={{
                    color,
                    variant,
                    size,
                    orientation,
                    nesting: parentNesting + 1,
                    marker,
                }}
            >
                <NestedListContext.Provider value={parentNesting + 1}>
                    <ListRoot
                        ref={ref}
                        {...props}
                        nesting={parentNesting}
                        orientation={orientation}
                        color={color}
                        variant={variant}
                        style={style}
                    >
                        {children}
                    </ListRoot>
                </NestedListContext.Provider>
            </ListContext.Provider>
        );
    },
);

List.displayName = "List";

export { List };
