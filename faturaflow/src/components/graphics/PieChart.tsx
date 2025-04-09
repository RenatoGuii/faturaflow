"use client"

import { useEffect, useMemo, useState } from "react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Invoice, useInvoiceService } from "@/resources"

const chartConfig = {
  paid: {
    label: "paid",
    color: "#15803d",
  },
  notpaid: {
    label: "notpaid",
    color: "#f97316",
  },
  overdue: {
    label: "overdue",
    color: "#b91c1c",
  },
} satisfies ChartConfig

export const InvoicePieChart: React.FC = () => {
  const useService = useInvoiceService();
  const [invoicesOverdue, setInvoicesOverdue] = useState<Invoice[]>([]);
  const [invoicesNotPaid, setInvoicesNotPaid] = useState<Invoice[]>([]);
  const [invoicesPaid, setInvoicesPaid] = useState<Invoice[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const resultPaid = await useService.searchAllByStatus("PAID");
      const resultNotPaid = await useService.searchAllByStatus("NOTPAID");
      const resultOverdue = await useService.searchAllByStatus("OVERDUE");

      setInvoicesPaid(resultPaid);
      setInvoicesNotPaid(resultNotPaid);
      setInvoicesOverdue(resultOverdue);
    };

    fetchData();
  }, []);

  const chartData = useMemo(() => [
    { status: "Paga(s)", amount: invoicesPaid.length, fill: chartConfig.paid.color },
    { status: "Não Paga(s)", amount: invoicesNotPaid.length, fill: chartConfig.notpaid.color },
    { status: "Vencida(s)", amount: invoicesOverdue.length, fill: chartConfig.overdue.color },
  ], [invoicesPaid, invoicesNotPaid, invoicesOverdue]);

  const totalInvoices = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.amount, 0);
  }, [chartData]);

  return (
    <Card className="flex flex-col bg-transparent border-none w-96">
      <CardHeader>
        <h1 className="text-white font-normal text-lg">
          Distribuição de Faturas
        </h1>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="status"
              innerRadius={60}
              strokeWidth={2}
              stroke="#ffffff"
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-white text-3xl font-bold"
                        >
                          {totalInvoices.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-gray-300"
                        >
                          Faturas
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}