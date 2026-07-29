import type { Theme } from "@emotion/react";
import type { Breakpoint, Responsive } from "@mutualzz/ui-core";

export const getActiveBreakpoint = (
    theme: Theme,
    width: number,
): Breakpoint => {
    const keys = theme.breakpoints.keys;
    let active = keys[0];

    for (const key of keys) {
        if (width >= theme.breakpoints.values[key]) {
            active = key;
        }
    }

    return active;
};

export const resolveResponsiveValue = <T>(
    theme: Theme,
    prop: Responsive<T>,
    width: number,
): T => {
    if (prop == null || typeof prop !== "object" || Array.isArray(prop)) {
        return prop;
    }

    const bp = getActiveBreakpoint(theme, width);
    const bpProp = prop as Partial<Record<Breakpoint, T>>;
    const allBreakpoints = theme.breakpoints.keys;
    const definedBreakpoints = Object.keys(bpProp) as Breakpoint[];

    if (definedBreakpoints.length === 0) {
        return prop as T;
    }

    if (bpProp[bp] !== undefined) {
        return bpProp[bp]!;
    }

    const sortedBreakpoints = [...definedBreakpoints].sort(
        (a, b) => allBreakpoints.indexOf(a) - allBreakpoints.indexOf(b),
    );
    const smallestBreakpoint = sortedBreakpoints[0];
    const smallestIndex = allBreakpoints.indexOf(smallestBreakpoint);
    const currentIndex = allBreakpoints.indexOf(bp);

    if (currentIndex < smallestIndex) {
        return bpProp[smallestBreakpoint]!;
    }

    for (const key of sortedBreakpoints) {
        const index = allBreakpoints.indexOf(key);
        if (index > currentIndex && bpProp[key] !== undefined) {
            return bpProp[key]!;
        }
    }

    return bpProp[sortedBreakpoints[sortedBreakpoints.length - 1]]!;
};
