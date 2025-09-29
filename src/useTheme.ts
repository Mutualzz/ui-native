import { useContext } from "react";
import { ThemeContext } from "./ThemeProvider";

/**
 * Custom hook for accessing the theme context.
 * @returns The theme context value.
 */
export const useTheme = () => {
    const context = useContext(ThemeContext);
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!context)
        throw new Error("useTheme must be used within a ThemeProvider");

    return context;
};
