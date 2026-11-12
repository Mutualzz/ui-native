import { createContext, useContext, useMemo } from "react";
import type {
    SkeletonAnimation,
    SkeletonProviderProps,
} from "./Skeleton.types";

const SkeletonContext = createContext<{ animation: SkeletonAnimation }>({
    animation: "shimmer",
});

export const SkeletonProvider = ({
    animation,
    children,
}: SkeletonProviderProps) => {
    const value = useMemo(() => ({ animation }), [animation]);

    return (
        <SkeletonContext.Provider value={value}>
            {children}
        </SkeletonContext.Provider>
    );
};

export const useSkeletonAnimation = () => useContext(SkeletonContext).animation;
