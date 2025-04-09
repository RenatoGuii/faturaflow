'use client'

import { AuthenticatedPage, InvoiceBarChart, InvoiceLineChart, InvoiceList, InvoicePieChart, ManageInvoiceModal, Sidebar } from "@/components";
import { OpenModalManageInvoiceContext } from "@/contexts";
import Link from "next/link";
import { useContext } from "react";

export default function DashboardPage() {
    const modalContext = useContext(OpenModalManageInvoiceContext);
    const { itsOpenModalManage, setItsOpenModalManage } = modalContext

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
                        <div className="lg:ml-64">

                            <div className="bg-zinc-950 p-7 flex flex-col justify-center items-center">

                                {itsOpenModalManage ? <ManageInvoiceModal /> : null}

                                <div className="flex items-center justify-between w-full p-5 border-b border-secondaryColor mb-8">
                                    <h1 className="text-4xl -tracking-wide">Dashboard</h1>
                                    <Link href="">
                                        <button onClick={alterModalView} className="text-sm duration-300 rounded-sm border border-transparent hover:border-white hover:bg-zinc-950 p-2 bg-green-500 transition-colors">Adicionar Fatura</button>
                                    </Link>
                                </div>

                                <InvoiceBarChart />

                                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-1450px py-5 rounded">

                                    <div className="bg-zinc-900 px-5 rounded flex flex-col items-center justify-center text-center">
                                        <InvoicePieChart />
                                    </div>

                                    <div className="  rounded flex flex-col items-center justify-center gap-5 text-center md:col-span-2 ">
                                        <div className="w-full overflow-x-auto">
                                            <InvoiceLineChart />
                                        </div>
                                    </div>

                                </div>

                                <div className="w-full lg:w-830px">
                                    <InvoiceList editIcon={false} title="FATURAS QUE IRÃO VENCER ESSE MÊS" filters={true} allInvoices={false} />
                                </div>

                            </div>

                        </div>
                    </div>
                </main>
            </AuthenticatedPage>
        </>
    )
}

