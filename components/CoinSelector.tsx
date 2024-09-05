import { useAppContext } from '@/context/AppContext'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CoinSelectorProps {
    currencies: string[]
}

export default function CoinSelector({ currencies }: CoinSelectorProps) {
    const { selectedCoin, setSelectedCoin } = useAppContext();

    return (
        <Select value={selectedCoin} onValueChange={setSelectedCoin}>
            <SelectTrigger className="w-full">
                <SelectValue>{selectedCoin}</SelectValue>
            </SelectTrigger>
            <SelectContent>
                {currencies.sort().map(currency => (
                    <SelectItem key={currency} value={currency}>
                        {currency}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}