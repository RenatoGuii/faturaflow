'use client'

import { OpenSideBarContext } from "@/contexts"
import { useAuth, UserSessionToken } from "@/resources"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { IoMdClose } from "react-icons/io"
import { LuFileSpreadsheet } from "react-icons/lu"
import { MdDashboard, MdLogout } from "react-icons/md"
import { VscMenu } from "react-icons/vsc"

export const Sidebar: React.FC = () => {
    const [userData, setUserData] = useState<UserSessionToken | null>(null);
    const sidebarContext = useContext(OpenSideBarContext);
    const { itsOpenSidebar, setItsOpenSidebar } = sidebarContext;

    const useService = useAuth();
    const router = useRouter();

    const OpenSideBar = () => {
        setItsOpenSidebar(!itsOpenSidebar);
    }

    const logout = () => {
        useService.invalidateSession();
        router.push("/auth")
    }

    useEffect(() => {
        setUserData(useService.getUserSessionToken);
    }, [])

    return (
        <>
            <button 
                onClick={OpenSideBar} 
                type="button" 
                className="inline-flex absolute items-center p-2 mt-2 ms-3 text-2xl rounded-lg lg:hidden focus:outline-none focus:ring-2 focus:ring-gray-600 hover:text-gray-400 hover:bg-gray-700 hover:ring-gray-600 z-10"
            >
                <VscMenu />
            </button>

            <aside className={`${itsOpenSidebar ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed top-0 left-0 z-20 w-64 h-screen transition-transform`}>
                <div className="h-full pt-4 overflow-y-auto bg-darkGray flex flex-col justify-between">
                    <div className="px-3 flex justify-between">
                        <img src="/imgs/logo-big.png" alt="logo-big" className="w-40" />
                        <button 
                            onClick={OpenSideBar} 
                            type="button" 
                            className="inline-flex items-center text-2xl rounded-lg lg:hidden"
                        >
                            <IoMdClose />
                        </button>
                    </div>

                    <div className="flex-grow my-4 px-3">
                        <ul className="space-y-2 font-medium">
                            <li>
                                <Link href="/dashboard" className="flex items-center p-2 rounded-lg text-white hover:bg-secondaryColor group duration-200">
                                    <MdDashboard />
                                    <span className="ms-3">Dashboard</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/invoices" className="flex items-center p-2 rounded-lg text-white hover:bg-secondaryColor group duration-200">
                                    <LuFileSpreadsheet />
                                    <span className="flex-1 ms-3 whitespace-nowrap">Faturas</span>
                                </Link>
                            </li>
                            <li onClick={logout}>
                                <a href="#" className="flex items-center p-2 rounded-lg text-white hover:bg-secondaryColor group duration-200">
                                    <MdLogout />
                                    <span className="flex-1 ms-3 whitespace-nowrap">Sair</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="px-3 py-5 flex flex-col gap-4 hover:bg-gray-600 duration-200">
                        <p className="flex-grow w-full whitespace-nowrap overflow-hidden overflow-ellipsis">{userData?.name} {userData?.lastName}</p>
                        <p className="flex-grow w-full whitespace-nowrap overflow-hidden overflow-ellipsis">{userData?.email}</p>
                    </div>
                </div>
            </aside>

            {itsOpenSidebar && (
                <div className="fixed inset-0 bg-black opacity-50 z-10" onClick={OpenSideBar}></div>
            )}
        </>
    )
}