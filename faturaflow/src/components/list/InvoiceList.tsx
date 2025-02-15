import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface InvoiceListProps {
  filters: boolean;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({filters}: InvoiceListProps) => {
  return (
    <div className="p-6 bg-gradient-to-br bg-zinc-900 overflow-x-auto">
      <div className="mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            FATURAS QUE IRÃO VENCER ESSE MÊS
          </h2>

        {filters && (
                    <Tabs defaultValue="gainers" className="w-full">
                    <TabsList className="bg-transparent border-0 p-0 gap-2">
                      <TabsTrigger
                        value="gainers"
                        className="bg-white/10 text-white data-[state=active]:bg-white/20 rounded-full px-6"
                      >
                        Gainers
                      </TabsTrigger>
                      <TabsTrigger
                        value="losers"
                        className="bg-white/10 text-white data-[state=active]:bg-white/20 rounded-full px-6"
                      >
                        Losers
                      </TabsTrigger>
                      <TabsTrigger
                        value="24hvol"
                        className="bg-white/10 text-white data-[state=active]:bg-white/20 rounded-full px-6"
                      >
                        24h Vol
                      </TabsTrigger>
                      <select className="ml-auto bg-white/10 text-white rounded-full px-4 py-2 text-sm outline-none">
                        <option value="all">All Market</option>
                      </select>
                    </TabsList>
                  </Tabs>
        )}

        </div>

        <div>
          <table className="w-full min-w-651px max-w-1160px">
            <thead>
              <tr className="text-sm text-gray-400 border-b border-white/10">
                <th className="text-left py-4 font-normal">#</th>
                <th className="text-left py-4 font-normal">Name</th>
                <th className="text-left py-4 font-normal">Price</th>
                <th className="text-left py-4 font-normal">24h Change</th>
                <th className="text-left py-4 font-normal">7d Change</th>
                <th className="text-left py-4 font-normal">Market Cap</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/10">
                <td className="py-4 text-white">1</td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#F7931A] rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">₿</span>
                    </div>
                    <div>
                      <div className="text-white">Bitcoin</div>
                      <div className="text-sm text-gray-400">BTC</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-white">$63,284.03</td>
                <td className="py-4 text-red-500">-19.43%</td>
                <td className="py-4 text-green-500">+46.12%</td>
                <td className="py-4 text-white">$2,384,438.43</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-4 text-white">2</td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#627EEA] rounded-full flex items-center justify-center">
                      <span className="text-white text-lg">Ξ</span>
                    </div>
                    <div>
                      <div className="text-white">Ethereum</div>
                      <div className="text-sm text-gray-400">ETH</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-white">$4,743.47</td>
                <td className="py-4 text-red-500">-10.32%</td>
                <td className="py-4 text-green-500">+14.39%</td>
                <td className="py-4 text-white">$8,482.43</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-4 text-white">3</td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#0066CC] rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">D</span>
                    </div>
                    <div>
                      <div className="text-white">Digibyte</div>
                      <div className="text-sm text-gray-400">DGB</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-white">$6,843.43</td>
                <td className="py-4 text-green-500">+23.12%</td>
                <td className="py-4 text-red-500">-6.12%</td>
                <td className="py-4 text-white">$83,328.12</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-4 text-white">4</td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#00A8C5] rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">P</span>
                    </div>
                    <div>
                      <div className="text-white">Polcoin</div>
                      <div className="text-sm text-gray-400">POT</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-white">$4,232.41</td>
                <td className="py-4 text-green-500">+3.28%</td>
                <td className="py-4 text-green-500">+12.74%</td>
                <td className="py-4 text-white">$9,542.22</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-4 text-white">5</td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#26A17B] rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">T</span>
                    </div>
                    <div>
                      <div className="text-white">Tether</div>
                      <div className="text-sm text-gray-400">USDT</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-white">$5,531.32</td>
                <td className="py-4 text-red-500">-2.42%</td>
                <td className="py-4 text-red-500">-2.32%</td>
                <td className="py-4 text-white">$5,439.35</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

