'use client'

import { Invoice, InvoiceItem } from "@/resources";
import { createContext, ReactNode, useState } from "react";

interface OpenModalItemsContextType {
    itsOpenModal: boolean;
    setItsOpenModal: (value: boolean) => void;
    invoiceContext: Invoice | undefined;  
    setInvoiceContext: (invoice: Invoice | undefined) => void;  
}

const defaultContextValue: OpenModalItemsContextType = {
    itsOpenModal: false,
    setItsOpenModal: () => {},
    invoiceContext: undefined,  
    setInvoiceContext: () => {},  
};

export const OpenModalItemsContext = createContext<OpenModalItemsContextType>(defaultContextValue);

export const OpenModalItemsProvider = ({ children }: { children: ReactNode }) => {
    const [itsOpenModal, setItsOpenModal] = useState<boolean>(false);
    const [invoiceContext, setInvoiceContext] = useState<Invoice | undefined>(undefined);  

    return (
        <OpenModalItemsContext.Provider value={{ itsOpenModal, setItsOpenModal, invoiceContext, setInvoiceContext }}>
            {children}
        </OpenModalItemsContext.Provider>
    );
};
