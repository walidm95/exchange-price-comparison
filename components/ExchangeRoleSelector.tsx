import { useAppContext } from '@/context/AppContext'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function ExchangeRoleSelector() {
  const { longLeg, setLongLeg, shortLeg, setShortLeg } = useAppContext();

  return (
    <div className="flex space-x-4">
      <div className="flex-1">
        <Label htmlFor="long-leg" className="mb-2 block">Long Leg</Label>
        <Select value={longLeg} onValueChange={setLongLeg}>
          <SelectTrigger id="long-leg" className="w-full">
            <SelectValue placeholder="Select long leg" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hyperliquid">Hyperliquid</SelectItem>
            <SelectItem value="binance">Binance</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1">
        <Label htmlFor="short-leg" className="mb-2 block">Short Leg</Label>
        <Select value={shortLeg} onValueChange={setShortLeg}>
          <SelectTrigger id="short-leg" className="w-full">
            <SelectValue placeholder="Select short leg" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hyperliquid">Hyperliquid</SelectItem>
            <SelectItem value="binance">Binance</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}