"use client"

import { Tabs, TabsList } from "@/components/ui/tabs"
import { OpenModalAssuranceContext, OpenModalItemsContext } from "@/contexts";
import { Invoice, InvoiceItem, useInvoiceService } from "@/resources";
import { Pencil } from "lucide-react";
import { useContext, useEffect, useState } from "react";

interface InvoiceListProps {
  filters: boolean;
  editIcon: boolean;
  allInvoices: boolean;
  title: string;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({ filters, editIcon ,allInvoices, title }: InvoiceListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<Invoice[]>();
  const [orderBy, setOrderBy] = useState<string>("overdueDesc"); 
  const [status, setStatus] = useState<string>("both"); 
  const useService = useInvoiceService();

  const modalContext = useContext(OpenModalItemsContext);
  const { itsOpenModal, invoiceContext } = modalContext;

  const parseDate = (dateStr: string | undefined) => {
    if (!dateStr) return 0; 
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day).getTime(); 
  };
  
  const fetchInvoices = async () => {
    let result;
  
    if (allInvoices) {
      result = await useService.searchAll();
    } else {
      result = await useService.searchAllCurrent();
    }
  
    // Filtrar por status se necessário
    if (status !== "both") {
      result = result.filter(invoice => (invoice.status || "").toLowerCase() === status.toLowerCase());
    }

      // Filtrar pelo nome digitado
    if (searchTerm.trim() !== "") {
      result = result.filter(invoice => (invoice.name || "").toLowerCase().includes(searchTerm.toLowerCase()));
    }
  
    // Ordenar
    if (orderBy === "alphabetical") {
      result.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
    } else if (orderBy === "amountAsc") {
      result.sort((a, b) => (a.totalAmount ?? 0) - (b.totalAmount ?? 0));
    } else if (orderBy === "amountDesc") {
      result.sort((a, b) => (b.totalAmount ?? 0) - (a.totalAmount ?? 0));
    } else if (orderBy === "overdueAsc") {
      result.sort((a, b) => parseDate(a.dueDate) - parseDate(b.dueDate));
    } else if (orderBy === "overdueDesc") {
      result.sort((a, b) => parseDate(b.dueDate) - parseDate(a.dueDate));
    }
  
    setData(result);
  };
  
  useEffect(() => {
    fetchInvoices();
  }, [allInvoices, status, orderBy, searchTerm]); 

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setOrderBy(value);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setStatus(value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="p-6 bg-gradient-to-br bg-zinc-900">
      <div className="mx-auto">

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            {title}
          </h2>

          {filters && (
            <Tabs defaultValue="24hvol" className="w-full">
              <TabsList className="bg-transparent border-0 p-0 gap-2 flex-wrap justify-start">

                <div className="flex flex-col gap-2">
                  <p className="text-gray-300">Ordenar:</p>
                  <select
                    className="ml-auto bg-white/10 text-white rounded-md px-4 py-2 text-sm outline-none"
                    onChange={handleFilterChange}
                  >
                    <option className="bg-gray-700" value="overdueDesc">
                      Vencimento (9 - 0)
                    </option>
                    <option className="bg-gray-700" value="overdueAsc">
                      Vencimento (0 - 9)
                    </option>
                    <option className="bg-gray-700" value="alphabetical">
                      Ordem Alfabética
                    </option>
                    <option className="bg-gray-700" value="amountDesc">
                      Valor (Descrescente)
                    </option>
                    <option className="bg-gray-700" value="amountAsc">
                      Valor (Crescente)
                    </option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-gray-300">Status:</p>
                  <select
                    className="ml-auto bg-white/10 text-white rounded-md px-4 py-2 text-sm outline-none"
                    onChange={handleStatusChange}
                  >
                    <option className="bg-gray-700" value="both">
                      Todos
                    </option>
                    <option className="bg-gray-700" value="paid">
                      Pago
                    </option>
                    <option className="bg-gray-700" value="notpaid">
                      Não Pago
                    </option>
                    <option className="bg-gray-700" value="overdue">
                      Vencido
                    </option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-gray-300">Pesquisar:</p>
                  <input
                    type="text"
                    placeholder="Digite o nome..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="bg-white/10 text-white rounded-md px-4 py-2 text-sm outline-none"
                  />
                </div>

              </TabsList>
            </Tabs>
          )}
        </div>

        <div className="max-h-630px overflow-y-auto">
          <table className="w-full min-w-630px max-w-1160px">
            <thead>
              <tr className="text-sm text-gray-400 border-b border-white/10">
                <th className="text-left py-4 font-normal">#</th>
                <th className="text-left py-4 font-normal">Nome</th>
                <th className="text-left py-4 font-normal">Valor</th>
                <th className="text-left py-4 font-normal">Vencimento</th>
                <th className="text-left py-4 font-normal">Status</th>
                <th className="text-left py-4 font-normal">Items</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((invoice, index) => (
                <LineList
                  key={invoice.id}
                  index={index}
                  id={invoice.id}
                  name={invoice.name}
                  value={invoice.totalAmount}
                  dueDate={invoice.dueDate}
                  items={invoice.items}
                  status={invoice.status}
                  editIcon={editIcon}
                />
              ))}
            </tbody>
          </table>

          {itsOpenModal ? <ModalItems editIcon={false} invoice={invoiceContext} /> : null}
        </div>

      </div>
    </div>
  );
};

interface LineListProps {
  index: number;
  id?: string;
  name?: string;
  value?: number;
  dueDate?: string;
  items?: InvoiceItem[];
  status?: string;
  editIcon: boolean;
}

const LineList: React.FC<LineListProps> = ({index, id, name, value, dueDate, items, status, editIcon}: LineListProps) => {

  const modalItemsInvoiceContext = useContext(OpenModalItemsContext);
  const { itsOpenModal, setItsOpenModal, setInvoiceContext } = modalItemsInvoiceContext;

  const modalAssuranceContext = useContext(OpenModalAssuranceContext);
  const { itsOpenModalAssurance, setItsOpenModalAssurance, setCurrentInvoice } = modalAssuranceContext;

  const getCurrentInvoice = () => {
    const currentInvoice: Invoice = new Invoice ();
    currentInvoice.id = id;
    currentInvoice.name = name;
    currentInvoice.totalAmount = value;
    currentInvoice.dueDate = dueDate;
    currentInvoice.items = items;
    currentInvoice.status = status;

    return currentInvoice;
  }
  
  const alterModalItemsInvoiceView = () => {
    const result = getCurrentInvoice();

    setInvoiceContext(result);

    setItsOpenModal(!itsOpenModal);
  }

  const alterModalAssuranceView = () => {
    const result = getCurrentInvoice();

    setCurrentInvoice(result);

    setItsOpenModalAssurance(!itsOpenModalAssurance);
  }

  return (
  
    <tr className="border-b border-white/10 group px-1">

      <td className="py-4 text-gray-400">{(index ?? 0) + 1}</td>
      <td className="py-4 text-white flex items-center gap-2">{name}
      {editIcon ? <button onClick={alterModalAssuranceView} className="invisible group-hover:visible"><Pencil size={15} className="hover:text-gray-500" /></button> : null}  
      </td>
      <td className="py-4 text-yellow-400">R$ {(value ?? 0).toFixed(2)}</td>
      <td className="py-4 text-gray-300">{dueDate}</td>

      <td className={`py-4 ${
        status === "PAID" ? "text-green-500" :
        status === "NOTPAID" ? "text-orange-500" : "text-red-500"}`}>

        {status === "PAID" ? "PAGO" : 
        status === "NOTPAID" ? "NÃO PAGO" :
        status === "OVERDUE" ? "VENCIDO" : ""}

      </td>

      {items && items.length > 0 ? 

      <td className="py-4 text-white ">
        <button className="border-b border-transparent hover:border-b hover:border-white" onClick={alterModalItemsInvoiceView} >Ver Items</button>
      </td>

      : null}

    </tr>
    
  )

}

interface ModalItemsProps {
  invoice?: Invoice | undefined;
  editIcon: boolean;
}

const ModalItems: React.FC<ModalItemsProps> = ({invoice, editIcon}: ModalItemsProps) => {
  const modalContext = useContext(OpenModalItemsContext);
  const { itsOpenModal, setItsOpenModal, invoiceContext } = modalContext;
  
  const alterModalView = () => {
    setItsOpenModal(!itsOpenModal);
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-zinc-900 p-6 rounded-lg shadow-lg">

          <h1 className="text-2xl text-gray-400 italic ">Items de </h1>

          <span className="text-white text-2xl italic font-bold whitespace-nowrap"> 
            {invoiceContext?.name}
          </span>

          <table className="w-full min-w-200px smartPhone:min-w-270px my-5">
            <thead>
              <tr className="text-sm text-gray-400 border-b border-white/10">
                <th className="text-left py-4 font-normal">#</th>
                <th className="text-left py-4 font-normal">Nome</th>
                <th className="text-left py-4 font-normal">Valor</th>
              </tr>
            </thead>
            <tbody>

            {invoiceContext?.items?.map((invoiceItem, index) => (
              <LineList editIcon={editIcon} key={invoiceItem.id} index={index} name={invoiceItem.description} value={invoiceItem.amount} />
            ))}

            </tbody>
          </table>

        <div className="flex justify-end">
          <button onClick={alterModalView} className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-600">Fechar</button>
        </div>
      </div>
    </div>
  )
}





