'use client'

import { InvoiceBarChart, InvoiceLineChart, InvoiceList, InvoicePieChart, Sidebar } from "@/components";

export default function DashboardPage() {
    return (
        <>
            <main>
                <div>
                    <div>
                        <Sidebar />
                    </div>
                    <div className="lg:ml-64">

                        <div className="bg-zinc-950 p-7 flex flex-col justify-center items-center">

                            <div className="w-full p-5 border-b border-secondaryColor mb-8">
                                <h1 className="text-4xl text-gray-300 -tracking-wide">Dashboard</h1>
                            </div>

                            <InvoiceBarChart />

                            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-1450px py-5 rounded">

                                <div className="bg-zinc-900 px-5 pt-6 pb-5 rounded flex flex-col items-center justify-center gap-5 text-center">
                                    <h1 className="text-lg">Distribuição de Faturas</h1>
                                    <InvoicePieChart />
                                </div>

                                <div className="bg-zinc-900 px-5 pt-6 pb-5 rounded flex flex-col items-center justify-center gap-5 text-center md:col-span-2 ">
                                    <h1 className="text-lg">Total de Faturas ao longo do tempo</h1>
                                    <InvoiceLineChart />
                                </div>

                            </div>

                            <div className="w-full lg:w-830px">
                                <InvoiceList filters={false} />
                            </div>

                        </div>

                    </div>
                </div>
            </main>
        </>
    )
}