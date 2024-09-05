'use client'

import { AppProvider, useAppContext } from '@/context/AppContext'
import CoinSelector from '@/components/CoinSelector'
import TradeSizeInput from '@/components/TradeSizeInput'
import ExchangeRoleSelector from '@/components/ExchangeRoleSelector'
import OrderbookComparisonChart from '@/components/OrderbookComparisonChart'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ArbitrageInfo from '@/components/ArbitrageInfo'

function HomeContent() {
  const { markets, marketsLoaded } = useAppContext();

  if (!marketsLoaded) {
    return <div>Loading markets...</div>;
  }

  const commonCurrencies = Object.keys(markets.hyperliquid || {}).filter(
    symbol => markets.binance && Object.prototype.hasOwnProperty.call(markets.binance, symbol)
  );

  return (
    <main className="flex h-screen p-4 space-x-4">
      <div className="w-1/5 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Select Coin</CardTitle>
          </CardHeader>
          <CardContent>
            <CoinSelector currencies={commonCurrencies} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Trade Size (per leg)</CardTitle>
          </CardHeader>
          <CardContent>
            <TradeSizeInput />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Exchange Role</CardTitle>
          </CardHeader>
          <CardContent>
            <ExchangeRoleSelector />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Arbitrage Info</CardTitle>
          </CardHeader>
          <CardContent>
            <ArbitrageInfo />
          </CardContent>
        </Card>
      </div>
      <div className="w-4/5">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Orderbook Comparison</CardTitle>
          </CardHeader>
          <CardContent className="h-[calc(100%-4rem)]">
            <OrderbookComparisonChart />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

export default function Home(): JSX.Element {
  return (
    <AppProvider>
      <HomeContent />
    </AppProvider>
  )
}