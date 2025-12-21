import styled from "@emotion/native";
import { resolveSize } from "@mutualzz/ui-core";
import { Children, forwardRef, isValidElement } from "react";
import { View } from "react-native";
import type { ButtonProps } from "../Button/Button.types";
import { useTheme } from "../useTheme";
import { ButtonGroupContext } from "./ButtonGroup.context";
import {
    baseSpacingMap,
    resolveButtonGroupItemStyles,
} from "./ButtonGroup.helpers";
import type { ButtonGroupProps } from "./ButtonGroup.types";

const Root = styled.View({ flexWrap: "wrap" });

const ButtonGroup = forwardRef<View, ButtonGroupProps>(
    (
        {
            orientation = "horizontal",
            spacing = 0,
            color,
            size,
            variant,
            verticalAlign,
            horizontalAlign,
            disabled,
            loading,
            fullWidth,
            separatorColor,
            toggleable,
            value,
            onChange,
            exclusive,
            children: childrenProp,
            style,
            ...props
        },
        ref,
    ) => {
        const { theme } = useTheme();

        const resolvedSpacing = resolveSize(theme, spacing, baseSpacingMap);

        const mappedChildren = Children.toArray(childrenProp).map(
            (child, idx, arr) => {
                if (!isValidElement<ButtonProps>(child)) return child;

                const childValue = child.props.value;
                const selected = exclusive
                    ? value === childValue
                    : Array.isArray(value) && value.includes(childValue);

                const position =
                    idx === 0
                        ? "first"
                        : idx === arr.length - 1
                          ? "last"
                          : "middle";

                const groupItemStyle =
                    resolvedSpacing === 0
                        ? resolveButtonGroupItemStyles(
                              theme,
                              orientation,
                              child.props.color ?? color,
                              child.props.variant ?? variant,
                              separatorColor,
                              position,
                          )
                        : undefined;

                const isLast = idx === arr.length - 1;

                const spacedItemWrapperStyle =
                    resolvedSpacing > 0 && !isLast
                        ? {
                              marginRight:
                                  orientation === "horizontal"
                                      ? resolvedSpacing
                                      : 0,
                              marginBottom:
                                  orientation === "vertical"
                                      ? resolvedSpacing
                                      : 0,
                          }
                        : undefined;

                const cloned = (
                    <child.type
                        {...child.props}
                        color={child.props.color ?? color}
                        size={child.props.size ?? size}
                        variant={child.props.variant ?? variant}
                        verticalAlign={
                            child.props.verticalAlign ?? verticalAlign
                        }
                        horizontalAlign={
                            child.props.horizontalAlign ?? horizontalAlign
                        }
                        disabled={child.props.disabled ?? disabled}
                        loading={child.props.loading ?? loading}
                        selected={selected}
                        style={[child.props.style, groupItemStyle].filter(
                            Boolean,
                        )}
                    />
                );

                return resolvedSpacing > 0 ? (
                    <View key={child.key ?? idx} style={spacedItemWrapperStyle}>
                        {cloned}
                    </View>
                ) : (
                    <View key={child.key ?? idx}>{cloned}</View>
                );
            },
        );

        return (
            <ButtonGroupContext.Provider
                value={{
                    color,
                    variant,
                    size,
                    verticalAlign,
                    horizontalAlign,
                    fullWidth,
                    disabled,
                    loading,
                    toggleable,
                    value,
                    onChange,
                    exclusive,
                }}
            >
                <Root
                    ref={ref}
                    {...props}
                    style={[
                        {
                            flexDirection:
                                orientation === "vertical" ? "column" : "row",
                            flexGrow: fullWidth ? 1 : 0,
                            alignItems: "stretch",
                            ...(disabled ? { opacity: 0.5 } : null),
                        },
                        style,
                    ]}
                >
                    {mappedChildren}
                </Root>
            </ButtonGroupContext.Provider>
        );
    },
);

ButtonGroup.displayName = "ButtonGroup";

export { ButtonGroup };
