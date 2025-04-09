'use client'

import { Invoice } from "@/resources";
import { createContext, ReactNode, useState } from "react";

interface OpenModalManageInvoiceContextType {
    itsOpenModalManage: boolean;
    setItsOpenModalManage: (value: boolean) => void;
    isEdit: boolean;
    setIsEdit: (value: boolean) => void;
    invoice: Invoice | undefined;  
    setInvoice: (invoice: Invoice | undefined) => void; 
}

const defaultContextValue: OpenModalManageInvoiceContextType = {
    itsOpenModalManage: false,
    setItsOpenModalManage: () => {},
    isEdit: false,
    setIsEdit: () => {},
    invoice: undefined,  
    setInvoice: () => {},  
};

export const OpenModalManageInvoiceContext = createContext<OpenModalManageInvoiceContextType>(defaultContextValue);

export const OpenModalManageInvoiceProvider = ({ children }: { children: ReactNode }) => {
    const [itsOpenModalManage, setItsOpenModalManage] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [invoice, setInvoice] = useState<Invoice | undefined>(undefined);  

    return (
        <OpenModalManageInvoiceContext.Provider value={{ itsOpenModalManage, setItsOpenModalManage, invoice, setInvoice, isEdit, setIsEdit }}>
            {children}
        </OpenModalManageInvoiceContext.Provider>
    );
};
