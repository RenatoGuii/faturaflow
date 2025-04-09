'use client'

import { Invoice, InvoiceItem } from "@/resources";
import { createContext, ReactNode, useState } from "react";

interface OpenModalAssuranceContextType {
    itsOpenModalAssurance: boolean;
    setItsOpenModalAssurance: (value: boolean) => void;
    isDeleteInvoice: boolean;
    setIsDeleteInvoice: (value: boolean) => void;
    currentInvoice: Invoice | undefined;  
    setCurrentInvoice: (invoice: Invoice | undefined) => void;  
}

const defaultContextValue: OpenModalAssuranceContextType = {
    itsOpenModalAssurance: false,
    setItsOpenModalAssurance: () => {},
    isDeleteInvoice: false,
    setIsDeleteInvoice: () => {},
    currentInvoice: undefined,  
    setCurrentInvoice: () => {},  
};

export const OpenModalAssuranceContext = createContext<OpenModalAssuranceContextType>(defaultContextValue);

export const OpenModalAssuranceProvider = ({ children }: { children: ReactNode }) => {
    const [itsOpenModalAssurance, setItsOpenModalAssurance] = useState<boolean>(false);
    const [isDeleteInvoice, setIsDeleteInvoice] = useState<boolean>(false);
    const [currentInvoice, setCurrentInvoice] = useState<Invoice | undefined>(undefined);  

    return (
        <OpenModalAssuranceContext.Provider value={{ itsOpenModalAssurance, setItsOpenModalAssurance, isDeleteInvoice, setIsDeleteInvoice, currentInvoice, setCurrentInvoice }}>
            {children}
        </OpenModalAssuranceContext.Provider>
    );
};
