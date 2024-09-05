import { useAppContext } from '@/context/AppContext'
import { Input } from "@/components/ui/input"
import { DollarSign } from "lucide-react"

export default function TradeSizeInput() {
  const { tradeSize, setTradeSize } = useAppContext();

  const formatTradeSize = (value: number) => {
    return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    setTradeSize(Number(value));
  };

  return (
    <div className="space-y-2">
      <div className="relative rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <DollarSign className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <Input
          id="trade-size"
          type="text"
          placeholder="Enter trade size"
          value={formatTradeSize(tradeSize)}
          onChange={handleInputChange}
          className="pl-10 pr-4 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
    </div>
  )
}