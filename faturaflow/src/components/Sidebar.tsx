'use client'

import { OpenSideBarContext } from "@/contexts"
import Link from "next/link"
import { useContext } from "react"
import { IoMdClose } from "react-icons/io"
import { LuFileSpreadsheet } from "react-icons/lu"
import { MdDashboard, MdLogout } from "react-icons/md"
import { VscMenu } from "react-icons/vsc"

export const Sidebar: React.FC = () => {
    const sidebarContext = useContext(OpenSideBarContext);
    const { itsOpenSidebar, setItsOpenSidebar } = sidebarContext;

    const OpenSideBar = () => {
        setItsOpenSidebar(!itsOpenSidebar);
    }

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
                                <a href="#" className="flex items-center p-2 rounded-lg text-white hover:bg-secondaryColor group duration-200">
                                    <MdDashboard />
                                    <span className="ms-3">Dashboard</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center p-2 rounded-lg text-white hover:bg-secondaryColor group duration-200">
                                    <LuFileSpreadsheet />
                                    <span className="flex-1 ms-3 whitespace-nowrap">Faturas</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center p-2 rounded-lg text-white hover:bg-secondaryColor group duration-200">
                                    <MdLogout />
                                    <span className="flex-1 ms-3 whitespace-nowrap">Sair</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    <Link href="/" className="px-3 py-5 flex gap-4 hover:bg-gray-600 duration-200">
                        <div className="bg-white h-12 w-12 rounded-full" />
                        <div>
                            <p className="flex-grow w-40 whitespace-nowrap overflow-hidden overflow-ellipsis">{`Nome Sobrenome`}</p>
                            <p className="flex-grow w-40 whitespace-nowrap overflow-hidden overflow-ellipsis">{`email@email.com`}</p>
                        </div>
                    </Link>
                </div>
            </aside>

            {itsOpenSidebar && (
                <div className="fixed inset-0 bg-black opacity-50 z-10" onClick={OpenSideBar}></div>
            )}
        </>
    )
}