import { createContext, type ReactNode, useContext, useMemo } from "react";

export interface UiLabels {
    closeModal: string;
    increment: string;
    decrement: string;
    showPassword: string;
    openColorPicker: string;
    randomColor: string;
    randomColorHint: string;
    removeColorStop: string;
}

export const defaultUiLabels: UiLabels = {
    closeModal: "Close modal",
    increment: "Increment",
    decrement: "Decrement",
    showPassword: "Show password",
    openColorPicker: "Open color picker",
    randomColor: "Random color",
    randomColorHint: "Picks a random color",
    removeColorStop: "Remove color stop",
};

const UiLabelsContext = createContext<UiLabels>(defaultUiLabels);

export const UiLabelsProvider = ({
    labels,
    children,
}: {
    labels: Partial<UiLabels>;
    children: ReactNode;
}) => {
    const mergedLabels = useMemo(
        () => ({ ...defaultUiLabels, ...labels }),
        [labels],
    );

    return (
        <UiLabelsContext.Provider value={mergedLabels}>
            {children}
        </UiLabelsContext.Provider>
    );
};

export const useUiLabels = () => useContext(UiLabelsContext);
