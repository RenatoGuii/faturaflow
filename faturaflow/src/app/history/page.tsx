'use client'

import { Sidebar } from "@/components";
import { OpenSideBarContext } from "@/contexts";
import { useContext, useState } from "react";

export default function HistoryPage() {
    const sidebarContext = useContext(OpenSideBarContext);
    const { itsOpenSidebar } = sidebarContext;

    return (
        <>
            <main>
                <div>
                    <div>
                        <Sidebar />
                    </div>
                    <div className={`bg-blue-600 ${itsOpenSidebar ? "ml-64" : "ml-0"}`}>

                        

                    </div>
                </div>
            </main>
        </>
    )
}