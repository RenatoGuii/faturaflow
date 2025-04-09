"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Invoice, useInvoiceService } from "@/resources"

const chartConfig = {
  views: {
    label: "Valor da(s) Fatura(s)",
  },
  invoices: {
    label: "invoices",
    color: "#b91c1c",
  },
} satisfies ChartConfig

interface MappedInvoice {
  date: string | undefined;
  invoices: number | undefined;
  count: number; 
}

export const InvoiceLineChart: React.FC = () => {
  const [data, setData] = useState<Invoice[]>([]);
  const [chartData, setChartData] = useState<MappedInvoice[]>();
  const useService = useInvoiceService();

  const formatMonthYear = (dateString: string) => {
    const [day, month, year] = dateString.split(" ")[0].split("/");
    return `${month}/${year}`;
  }

  useEffect(() => {
    const search = async () => {
      const result = await useService.searchAll();
      setData(result);
    }
    search();
  }, []);

  useEffect(() => {
    if (data.length === 0) return;
  
    const aggregated = data.reduce((acc, invoice) => {
      const monthYear = invoice.createdAt ? formatMonthYear(invoice.createdAt) : "";
      const amount = invoice.totalAmount || 0;
  
      if (acc[monthYear]) {
        acc[monthYear].total += amount; 
        acc[monthYear].count += 1; 
      } else {
        acc[monthYear] = { total: amount, count: 1 }; 
      }
      return acc;
    }, {} as { [key: string]: { total: number; count: number } });
  
    const mappedData = Object.keys(aggregated).map((monthYear) => ({
      date: monthYear,
      invoices: aggregated[monthYear].total,
      count: aggregated[monthYear].count, 
    }));
  
    mappedData.sort((a, b) => {
      const [monthA, yearA] = a.date.split("/");
      const [monthB, yearB] = b.date.split("/");
      return new Date(Number(yearA), Number(monthA) - 1).getTime() - new Date(Number(yearB), Number(monthB) - 1).getTime();
    });
  
    setChartData(mappedData);
  }, [data]);

  return (
    <Card className="bg-zinc-900 min-w-651px fill-white">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle className="text-white font-normal">
            Total Acumulado de Faturas Criadas
          </CardTitle>
          <CardDescription className="text-gray-400">
            Veja a evolução do Valor Total das Faturas ao Longo do Tempo
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pl-2 py-8 sm:py-6 pr-12">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >

            <CartesianGrid vertical={false} stroke="#ffffff" />

            <YAxis />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const [month, year] = value.split("/");
                return new Date(Number(year), Number(month) - 1).toLocaleDateString("pt-BR", {
                  month: "numeric",
                  year: "numeric",
                });
              }}
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    const [month, year] = value.split("/");
                    return new Date(Number(year), Number(month) - 1).toLocaleDateString("pt-BR", {
                      month: "short",
                      year: "numeric",
                    });
                  }}
                  formatter={(value, name, props) => {
                    const count = props.payload.count; 
                    return (
                      <div className="text-center py-1 bg-gray-300 w-full">
                        <p>Fatura(s): {count}</p> 
                        <p>R$ {Number(value).toFixed(2)}</p>
                      </div>
                    );
                  }}
                />
              }
            />

            <Bar dataKey="invoices" fill={`var(--color-invoices)`} />

          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}