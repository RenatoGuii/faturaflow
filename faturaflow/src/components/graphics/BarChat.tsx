
export const InvoiceBarChart: React.FC = () => {
  return (
    <div className="w-full max-w-1450px bg-zinc-900 p-5 rounded">

        <div className="mb-8">
            <div className="text-sm text-zinc-400 mb-1">TOTAL A PAGAR</div>
            <div className="text-2xl sm:text-3xl font-semibold">
            $297,924<span className="text-xl">.80</span>
            </div>
        </div>

        <div className="relative flex h-2 rounded-full overflow-hidden bg-zinc-800 mb-8">
            <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-700 to-red-300 border-r-4 border-zinc-900 shadow-2xl" style={{ width: "20%" }}></div>
            <div className="absolute left-[20%] top-0 h-full bg-gradient-to-r from-blue-700 to-blue-300 border-r-4 border-zinc-900" style={{ width: "33%" }}></div>
            <div className="absolute left-[53%] top-0 h-full bg-gradient-to-r from-amber-700 to-amber-300 border-r-4 border-zinc-900" style={{ width: "5%" }}></div>
            <div className="absolute left-[58%] top-0 h-full bg-gradient-to-r from-green-700 to-green-300 " style={{ width: "42%" }}></div>
        </div>

    
        <div className="grid grid-cols-1 smartPhone:grid-cols-2 sm:grid-cols-4 gap-3">
            <AccountItem name="Multiple" balance="60,535.93" color="bg-red-700" />
            <AccountItem name="Reserve account" balance="99,023.54" color="bg-amber-500" />
            <AccountItem name="Capital wallet" balance="14,142.30" color="bg-emerald-500" />
            <AccountItem name="Default Account" balance="124,223.03" color="bg-blue-700" />
        </div>

        {/* Manage accounts link */}
        <div className="mt-8 text-right">
            <button className="text-sm text-zinc-400 hover:text-white transition-colors">Conferir Faturas</button>
        </div>
    </div>
  )
}

function AccountItem({
  name,
  balance,
  color,
}: {
  name: string
  balance: string
  color: string
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${color}`}></div>
        <div className="text-sm text-zinc-400">{name}</div>
      </div>
      <div className="text-sm font-medium">${balance}</div>
    </div>
  )
}