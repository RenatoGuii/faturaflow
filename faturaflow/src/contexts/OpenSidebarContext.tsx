'use client'

import { createContext, ReactNode, useState } from "react";

interface OpenSideBarContextType {
    itsOpenSidebar: boolean;
    setItsOpenSidebar: (value: boolean) => void;
}

const defaultContextValue: OpenSideBarContextType = {
    itsOpenSidebar: false,
    setItsOpenSidebar: () => {}, 
};

export const OpenSideBarContext = createContext<OpenSideBarContextType>(defaultContextValue);

export const OpenSideBarProvider = ({ children }: { children: ReactNode }) => {
    const [itsOpenSidebar, setItsOpenSidebar] = useState<boolean>(false);

    return (
        <OpenSideBarContext.Provider value={{ itsOpenSidebar, setItsOpenSidebar }}>
            {children}
        </OpenSideBarContext.Provider>
    );
};