"use client"

import { Invoice, useInvoiceService } from "@/resources";
import Link from "next/link";
import { useEffect, useState } from "react";

export const InvoiceBarChart: React.FC = () => {
  const useService = useInvoiceService();
  const [invoices, setInvoices] = useState<Invoice[]>();

  const totalAmount = invoices?.reduce((sum, invoice) => {
    return sum + (Number(invoice.totalAmount));
  }, 0);
  const integerPart = Math.floor(totalAmount || 0);
  const decimalPart = (totalAmount || 0 - integerPart).toFixed(2).split('.')[1];

  const sortedInvoices = invoices?.sort((a, b) => (b.totalAmount || 0) - (a.totalAmount || 0)) ?? [];

  const invoicePercentages = sortedInvoices?.map((invoice) => ({
    ...invoice,
    percentage: ((invoice.totalAmount || 0) / (totalAmount || 0)) * 100,
  }));

  useEffect(() => {
    const searhNotPaid = async () => {
      const result = await useService.searchAllByStatus("NOTPAID");
      const result2 = await useService.searchAllByStatus("OVERDUE");
      setInvoices(result.concat(result2));
    }

    searhNotPaid();
  }, []);

  return (
    <div className="w-full max-w-1450px bg-zinc-900 p-5 rounded">

      <div className="mb-8">
        <div className="text-sm text-zinc-400 mb-1">TOTAL A PAGAR</div>
        <div className="text-2xl sm:text-3xl font-semibold">
          R${integerPart}<span className="text-xl">.{decimalPart}</span>
        </div>
      </div>

      <div className="relative flex h-2 rounded-full overflow-hidden bg-zinc-800 mb-8">
        {invoicePercentages?.map((invoice, index) => (
          <div
            key={index}
            className={`absolute top-0 h-full ${index === invoicePercentages.length - 1 ? '' : 'border-r-4 border-zinc-900'} ${getBarColor(index)}`}
            style={{
              width: `${invoice.percentage}%`,
              left: `${invoicePercentages.slice(0, index).reduce((acc, curr) => acc + curr.percentage, 0)}%`
            }}
          >
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 smartPhone:grid-cols-2 md:grid-cols-4 gap-3">
        {invoicePercentages?.map((invoice, index) => (
          <AccountItem
            key={index}
            name={invoice.name || ""}
            balance={`R$ ${(invoice.totalAmount || 0).toFixed(2)}`}
            balancePercentages={(Math.ceil(invoice.percentage * 100) / 100).toFixed(2)}
            color={getBarColor(index)} 
          />
        ))}
      </div>

      <div className="mt-8 text-right">
        <Link href="/invoices">
        <button className="text-sm text-zinc-400 hover:text-white transition-colors">Gerenciar Faturas</button>
        </Link>
      </div>
    </div>
  )
}

function AccountItem({
  name,
  balance,
  balancePercentages,
  color,
}: {
  name: string
  balance: string
  balancePercentages: string;
  color: string
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${color}`}></div>
        <div className="text-sm text-zinc-400">{name}</div>
      </div>
      <div className="text-sm font-medium">{balance} ({balancePercentages}%)</div>
    </div>
  )
}

// Função para definir a cor de cada barra dependendo do índice
const getBarColor = (index: number) => {
  const colors = [
    'bg-gradient-to-r from-red-700 to-red-300',
    'bg-gradient-to-r from-blue-700 to-blue-300',
    'bg-gradient-to-r from-amber-700 to-amber-300',
    'bg-gradient-to-r from-green-700 to-green-300',
    'bg-gradient-to-r from-orange-700 to-orange-300',
    'bg-gradient-to-r from-violet-700 to-violet-300',
    'bg-gradient-to-r from-emerald-700 to-emerald-300',
    'bg-gradient-to-r from-neutral-700 to-neutral-300',
    'bg-gradient-to-r from-pink-700 to-pink-300',
    'bg-gradient-to-r from-purple-700 to-purple-300',
    'bg-gradient-to-r from-zink-700 to-zink-300',
    'bg-gradient-to-r from-yellow-700 to-yellow-300',
    'bg-gradient-to-r from-indigo-700 to-indigo-300',
    'bg-gradient-to-r from-teal-700 to-teal-300',
    'bg-gradient-to-r from-cyan-700 to-cyan-300',
    'bg-gradient-to-r from-sky-700 to-sky-300',
    'bg-gradient-to-r from-lime-700 to-lime-300',
    'bg-gradient-to-r from-stone-700 to-stone-300',
    'bg-gradient-to-r from-rose-700 to-rose-300',
    'bg-gradient-to-r from-fuchsia-700 to-fuchsia-300',
    'bg-gradient-to-r from-slate-700 to-slate-300',
  ];
  return colors[index % colors.length]; // A cor será cíclica 
};
