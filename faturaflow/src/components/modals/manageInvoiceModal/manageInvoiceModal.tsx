"use client";

import { OpenModalAssuranceContext, OpenModalManageInvoiceContext } from "@/contexts";
import { useInvoiceService } from "@/resources";
import { format, startOfDay } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Button } from "../../ui/button";
import { CalendarIcon, ChevronUp, ChevronDown, Trash } from "lucide-react";
import { Calendar } from "../../ui/calendar";
import { Switch } from "../../ui/switch";
import { useFormik } from "formik";
import { FormProps, formScheme, formValidationScheme } from "./formScheme";
import { AssuranceModal, FieldError, LoadingModal, useNotification } from "@/components";
import { ToastContainer } from "react-toastify";

export const ManageInvoiceModal: React.FC = () => {
  const useService = useInvoiceService();
  const notification = useNotification();

  const modalContext = useContext(OpenModalManageInvoiceContext);
  const { itsOpenModalManage, invoice, isEdit, setItsOpenModalManage, setInvoice, setIsEdit } = modalContext;

  const modalAssuranceContext = useContext(OpenModalAssuranceContext);
  const {itsOpenModalAssurance, setItsOpenModalAssurance, setIsDeleteInvoice} = modalAssuranceContext;

  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [paidEnable, setPaidEnable] = useState(false);
  const [invoiceItems, setInvoiceItems] = useState<Array<{ description: string; amount: number }>>([]);
  const [itemName, setItemName] = useState("");
  const [itemValue, setItemValue] = useState("");
  const [isListVisible, setIsListVisible] = useState(true);

  const enableInvoiceItems = () => {
    if (enabled) {
      setInvoiceItems([]);
      
      if (isEdit) {
        formik.setValues({
          nameInvoice: invoice?.name || "",
          dateInvoice: convertDateString(invoice?.dueDate || "00/00/0000"),
          totalAmountInvoice: 0,
        })
      } else (
        formik.setValues({
          nameInvoice: formik.values.nameInvoice || "",
          dateInvoice: formik.values.dateInvoice,
          totalAmountInvoice: 0,
        })
      )

      setEnabled(!enabled);
    } else {
      setEnabled(!enabled);
    }
  }

  const enablePaidButton = () => {
    setPaidEnable(!paidEnable);
  }

  const toggleListVisibility = () => {
    setIsListVisible(!isListVisible);
  };

  const alterModalView = () => {
    setIsEdit(false);
    setInvoice(undefined);
    setItsOpenModalManage(!itsOpenModalManage);
  };

  const handleAddItem = () => {
    if (!itemName.trim() || !itemValue) return;
    setInvoiceItems((prev) => [...prev, { description: itemName, amount: Number(itemValue) }]);
    setItemName("");
    setItemValue("");
  };

  const handleRemoveItem = (indexToRemove: number) => {
    setInvoiceItems((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const convertDateString = (dateString: string) => {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (values: FormProps, { resetForm }: any) => {
    try {
      setLoading(true);

      const formData = new FormData();
  
      formData.append("name", values.nameInvoice);
      formData.append("dueDate", values.dateInvoice ? format(values.dateInvoice, "dd/MM/yyyy") : "");

      if (paidEnable) {
        formData.append("status", "PAID");
      } else {
        formData.append("status", "NOTPAID");
      }

      let totalAmount = enabled ? calculateTotalAmount() : values.totalAmountInvoice;
      formData.append("totalAmount", String(totalAmount));
      
      if (enabled && invoiceItems.length > 0) {
        invoiceItems.forEach((item, index) => {
          formData.append(`items[${index}].description`, item.description);
          formData.append(`items[${index}].amount`, String(item.amount));
        });
      }
      
      formData.forEach((value, key) => {
        console.log(key, value);
      });
      
      if (isEdit) {
        await useService.editInvoice(invoice?.id || "", formData);
      } else {
        await useService.saveInvoice(formData);
      }
      
      resetForm();
      setInvoiceItems([]);
      setItemName("");
      setItemValue("");

      setItsOpenModalManage(false);
      
      notification.notify("Sua Fatura foi registrada com sucesso!", "success");
      window.location.reload();

      setLoading(false);
    } catch (error) {
      notification.notify("Não foi possível registrar esta fatura!", "error");
      console.error(error);
      setLoading(false);
    }
  };
  
  const formik = useFormik<FormProps>({
    initialValues: formScheme,
    onSubmit: handleSubmit,
    validationSchema: formValidationScheme,
  });

  const calculateTotalAmount = () => {
    return invoiceItems.reduce((acc, item) => acc + item.amount, 0);
  };
  
  useEffect(() => {

    if (isEdit) {

      formik.setValues({
        nameInvoice: invoice?.name || "",
        dateInvoice: convertDateString(invoice?.dueDate || "00/00/0000"),
        totalAmountInvoice: invoice?.totalAmount || 0,
      })

      let items = invoice?.items;

      if (Array.isArray(items) && items.length > 0) {
        let arrayAux = [];

        for(const item of items) {
          let itemAux = {
            description: item.description || "",
            amount: item.amount || 0,
          }

          arrayAux.push(itemAux);
        }

        setInvoiceItems(arrayAux);
        setEnabled(true);
        setIsListVisible(false);
      }
    }

  }, []);

  useEffect(() => {
    if (enabled) {
      const total = calculateTotalAmount();
      formik.setFieldValue("totalAmountInvoice", total);
    }
  }, [invoiceItems, enabled]); 

  useEffect(() => {
    if (invoice?.status === "PAID") {
      setPaidEnable(true);
    } else {
      setPaidEnable(false);
    }
  }, [])
  
  const openDeleteAssurance = () => {
    setItsOpenModalAssurance(true);
    setIsDeleteInvoice(true);
    setItsOpenModalManage(false);
  }

  return (
    <div className="overflow-y-auto fixed inset-0 flex min-h-screen bg-zinc-950 bg-opacity-50 items-center justify-center p-4 text-white z-50">
      
      {loading ? <LoadingModal /> : null}

      <div className="space-y-6 bg-zinc-950 p-5">

        {itsOpenModalAssurance ? <AssuranceModal /> : null}

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h1 className="text-center text-4xl font-normal">{isEdit ? "Edite sua Fatura" : "Adicione sua Fatura"}</h1>
            {isEdit ?
            <button onClick={openDeleteAssurance} className="bg-red-600 p-1 rounded-md hover:bg-white hover:text-red-600 duration-100">
              <Trash />
            </button>
            : null}
          </div>
          <p className="text-sm text-gray-300">
            {isEdit ? "Edite as informações da sua Fatura" : "Preencha as informações da sua próxima fatura"}
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="grid grid-cols-2 space-y-4">

          {isEdit ? 
          <div className="col-span-2">
            <div className="flex items-center justify-between rounded-lg bg-purple p-3 text-white">
              <div>
                <h3>Fatura paga?</h3>
              </div>
              <Switch
                checked={paidEnable}
                onCheckedChange={enablePaidButton}
                className="data-[state=checked]:bg-gray-400"
              />
            </div>
          </div> : null}

          <div className="space-y-2 col-span-2">
            <label>Nome da Fatura:</label>
            <input
              type="text"
              name="nameInvoice"
              value={formik.values.nameInvoice}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Ex: Açougue - Setembro"
              className="w-full rounded bg-purple px-4 py-3 text-white placeholder-gray-400 
                         focus:outline-none focus:ring-1 focus:ring-[#a29bfe]"
            />
            {formik.touched.nameInvoice ? (
              <FieldError error={formik.errors.nameInvoice} />
            ) : null}
          </div>


          <div className="flex items-center gap-3 justify-between col-span-2">
            <div className="col-span-1 space-y-2 flex flex-col">
              <label>Data de Vencimento: </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`p-3 bg-purple border-none text-left ${
                      !formik.values.dateInvoice && "text-muted-foreground"
                    }`}
                  >
                    <CalendarIcon />
                    {formik.values.dateInvoice ? (
                        format(formik.values.dateInvoice, "dd/MM/yyyy")
                    ) : (
                        <span>Escolha uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    className="bg-purple text-white"
                    mode="single"
                    selected={
                      formik.values.dateInvoice
                        ? new Date(formik.values.dateInvoice)
                        : undefined
                    }
                    onSelect={(date) => formik.setFieldValue("dateInvoice", date)}
                    disabled={(date) => date < startOfDay(new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="invisible">xxxx</label>
              <div className="gap-5 flex items-center justify-between rounded-lg bg-purple p-3 text-white">
                <div>
                  <h3>Fatura com Items</h3>
                </div>
                <Switch
                  checked={enabled}
                  onCheckedChange={enableInvoiceItems}
                  className="data-[state=checked]:bg-gray-400"
                />
              </div>
            </div>
          </div>

          {formik.touched.dateInvoice ? (
            <FieldError error={formik.errors.dateInvoice} />
          ) : null}

        <div className="space-y-2 col-span-2">
        <label>Valor total da Fatura:</label>
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
            R$
            </span>
            <input
            name="totalAmountInvoice"
            disabled={enabled} 
            type="number"
            value={formik.values.totalAmountInvoice}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            onKeyDown={(e) => {
                if (["e", "E", "+", "-"].includes(e.key)) {
                e.preventDefault();
                }
            }}
            placeholder="Ex: 57.50"
            className={`w-full rounded ${
                enabled ? "bg-zinc-900" : ""
            } bg-purple pl-10 px-4 py-3 text-white placeholder-gray-400 
                        focus:outline-none focus:ring-1 focus:ring-[#a29bfe]`}
            />
        </div>
        {formik.touched.totalAmountInvoice && (
            <FieldError error={formik.errors.totalAmountInvoice} />
        )}
        </div>

        {enabled && (
        <div className="col-span-2 space-y-4 w-380px">
            <div className="bg-purple p-3 rounded">

                <div className="flex justify-between items-center">

                    <h3 className="text-lg mb-2">Itens da Fatura</h3>

                    <button type="button" onClick={toggleListVisibility} className="text-white">
                        {isListVisible ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    
                </div>

                {isListVisible && (
                    <>
                    <div className="flex items-end gap-2 mb-3">

                        <div className="flex flex-col w-2/4">
                            <label>Nome</label>
                            <input
                                className="rounded bg-zinc-900 px-2 py-1 text-white focus:outline-none"
                                type="text"
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col w-1/4">
                            <label>Valor</label>
                            <input
                                className="rounded bg-zinc-900 px-2 py-1 text-white focus:outline-none"
                                type="number"
                                value={itemValue}
                                onChange={(e) => setItemValue(e.target.value)}
                                onKeyDown={(e) => {
                                if (["e", "E", "+", "-"].includes(e.key)) {
                                    e.preventDefault();
                                }
                                }}
                            />
                        </div>
                        
                        <Button className="bg-green-700 hover:bg-green-600 w-1/4" type="button" variant="default" onClick={handleAddItem}>
                            +
                        </Button>
                        
                    </div>

                    {invoiceItems.length > 0 && (
                        <div className="space-y-2">
                        {invoiceItems.map((item, index) => (
                            <div
                            key={index}
                            className="flex justify-between items-center bg-zinc-900 p-2 rounded"
                            >
                            <span>
                                {item.description} - R${" "}
                                {Number(item.amount).toFixed(2)}
                            </span>
                            <Button
                                className="bg-red-600"
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRemoveItem(index)}
                            >
                                Remover
                            </Button>
                            </div>
                        ))}
                        </div>
                    )}
                    </>
                )}
            </div>
        </div>
        )}

        <div className="col-span-2 flex justify-between gap-5">
        <button
            type="submit"
            className="border border-transparent w-full hover:border-white 
                        hover:bg-zinc-950 rounded bg-green-700 py-2 text-white transition-colors"
        >
            {isEdit ? "Salvar alterações" : "Adicionar Fatura"}
        </button>

        <button
            onClick={alterModalView}
            type="button"
            className="border border-transparent w-full hover:border-white 
                        hover:bg-zinc-950 rounded bg-red-700 py-2 text-white transition-colors"
        >
            Cancelar
        </button>
        </div>
        </form>
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
