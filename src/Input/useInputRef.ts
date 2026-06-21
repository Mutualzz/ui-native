import { useCallback, useImperativeHandle, useRef } from "react";
import type { Ref } from "react";
import type { TextInput } from "react-native";

export const useInputRef = (forwardedRef: Ref<TextInput>) => {
    const inputRef = useRef<TextInput>(null);

    useImperativeHandle(forwardedRef, () => inputRef.current as TextInput);

    const focusInput = useCallback(() => {
        inputRef.current?.focus();
    }, []);

    return { inputRef, focusInput };
};
