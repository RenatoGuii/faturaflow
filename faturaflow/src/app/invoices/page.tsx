'use client'

import { AssuranceModal, AuthenticatedPage, InvoiceList, ManageInvoiceModal, Sidebar } from "@/components";
import { OpenModalAssuranceContext, OpenModalManageInvoiceContext, OpenSideBarContext } from "@/contexts";
import Link from "next/link";
import { useContext} from "react";

export default function InvoicesPage() {
    const sidebarContext = useContext(OpenSideBarContext);
    const { itsOpenSidebar } = sidebarContext;
    
    const modalContext = useContext(OpenModalManageInvoiceContext);
    const { itsOpenModalManage, setItsOpenModalManage } = modalContext

    const modalAssuranceContext = useContext(OpenModalAssuranceContext);
    const { itsOpenModalAssurance } = modalAssuranceContext;

    const alterModalView = () => {
        setItsOpenModalManage(!itsOpenModalManage);
    }

    return (
        <>
            <AuthenticatedPage>
                <main>
                    <div>
                        <div>
                            <Sidebar />
                        </div>

                        {itsOpenModalAssurance ? <AssuranceModal /> : null}

                        <div className="lg:ml-64">

                            <div className="bg-zinc-950 p-7 flex flex-col justify-center items-center">
                                <div className=" flex justify-between w-full p-5 border-b border-secondaryColor mb-8">
                                    {itsOpenModalManage ? <ManageInvoiceModal /> : null}

                                    <h1 className="text-4xl -tracking-wide">Faturas</h1>

                                    <Link href="">
                                        <button onClick={alterModalView} className="text-sm duration-300 rounded-sm border border-transparent hover:border-white hover:bg-zinc-950 p-2 bg-green-500 transition-colors">Adicionar Fatura</button>
                                    </Link>
                                </div>

                                <div className="w-full lg:w-830px">
                                    <InvoiceList editIcon={true} title="HISTÓRICO DE FATURAS" filters={true} allInvoices={true} />
                                </div>
                            </div>

                        </div>
                    </div>
                </main>
            </AuthenticatedPage>
        </>
    )
}