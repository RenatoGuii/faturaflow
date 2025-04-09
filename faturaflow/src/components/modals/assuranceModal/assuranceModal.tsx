"use client";

import { LoadingModal, useNotification } from "@/components";
import { OpenModalAssuranceContext, OpenModalManageInvoiceContext } from "@/contexts";
import { useInvoiceService } from "@/resources";
import { useContext, useState } from "react";
import { ToastContainer } from "react-toastify";

export const AssuranceModal: React.FC = () => {
  const useService = useInvoiceService();
  const notification = useNotification();

  const modalAssuranceContext = useContext(OpenModalAssuranceContext);
  const { isDeleteInvoice, itsOpenModalAssurance, currentInvoice, setItsOpenModalAssurance, setIsDeleteInvoice } = modalAssuranceContext;

  const modalManageInvoiceContext = useContext(OpenModalManageInvoiceContext);
  const {setInvoice, setIsEdit, setItsOpenModalManage } = modalManageInvoiceContext;

  const [loading, setLoading] = useState(false);
  
  const alterModalAssuranceView = () => {
    setItsOpenModalAssurance(!itsOpenModalAssurance);
    setIsDeleteInvoice(false);

    if (isDeleteInvoice) {
      setItsOpenModalManage(true);
    }
  }

  const alterModalManageInvoiceView = () => {
    alterModalAssuranceView();

    setIsEdit(true);
    setInvoice(currentInvoice);
    setItsOpenModalManage(true);
  };

  const deleteInvoice = async () => {
    try {
      setLoading(true);

      await useService.deleteInvoice(currentInvoice?.id || "");
      window.location.reload();

      notification.notify("Fatura deletada com sucesso!", "success");
      setLoading(false);
    } catch (error) {
      notification.notify("Houve um erro na execução, tente novamente mais tarde!", "error");
      setLoading(false);
    }
  }

  return (
    <div className="overflow-y-auto fixed inset-0 flex min-h-screen bg-opacity-10 items-center justify-center p-4 text-white z-50">

        {loading ? <LoadingModal /> : null}

        <div className="bg-zinc-950 flex items-center flex-col gap-5 p-5">

          <div className="w-full flex flex-col items-center justify-center">
            <h1 className="text-lg">{isDeleteInvoice ? "Você deseja deletar esta Fatura?" : "Você deseja editar as informações desta fatura?"}</h1>
            {isDeleteInvoice ? <p className="text-sm text-zinc-300">Esta é uma ação irreversível</p> : null}
          </div>

          <p className="bg-purple p-2 rounded-sm">{currentInvoice?.name}</p>
          
          <div className="flex justify-center gap-3">
            <button
              onClick={isDeleteInvoice ? deleteInvoice : alterModalManageInvoiceView}
              type="button"
              className="text-sm border border-transparent hover:border-white 
                          hover:bg-zinc-950 rounded bg-green-700 p-2 text-white transition-colors"
            >
                {isDeleteInvoice ? "Sim, quero deletar" : "Sim, quero editar"}
            </button>

            <button
                onClick={alterModalAssuranceView}
                type="button"
                className="text-sm border border-transparent hover:border-white 
                            hover:bg-zinc-950 rounded bg-red-700 p-2 text-white transition-colors"
            >
                Não, quero retornar
            </button>

          </div>

        </div>

        <ToastContainer 
        position='top-right' 
        autoClose={10000}
        hideProgressBar={false}
        draggable={false}
        closeOnClick={true}
        pauseOnHover={true}
        />
      
    </div>


  );
};
