'use client'

import { useAppContext } from '@/context/AppContext'

function calculateSpread(longPrice: number, shortPrice: number): number {
    return shortPrice - longPrice
}

function calculateSpreadPercentage(longPrice: number, shortPrice: number): number {
    const spread = calculateSpread(longPrice, shortPrice)
    const averagePrice = (longPrice + shortPrice) / 2
    return (spread / averagePrice) * 100
}

function calculateTradeCost(tradeSize: number, longFee: number, shortFee: number): number {
    return tradeSize * (longFee + shortFee)
}

function calculatePotentialProfit(tradeSize: number, spread: number, tradeCost: number, averagePrice: number): number {
    return (tradeSize / averagePrice * spread) - tradeCost
}

const DEFAULT_FEE = 0.00035 // 3.5 bps

export default function ArbitrageInfo() {
    const { selectedCoin, markets, fillPrices, tradeSize, longLeg, shortLeg } = useAppContext()

    if (!selectedCoin || !markets.binance || !markets.hyperliquid) {
        return <div>Select a coin to view arbitrage info</div>
    }

    const longPrice = fillPrices['long'] || 0
    const shortPrice = fillPrices['short'] || 0

    const spread = calculateSpread(longPrice, shortPrice)
    const spreadPercentage = calculateSpreadPercentage(longPrice, shortPrice)

    const longFee = DEFAULT_FEE // markets[longLeg][selectedCoin.split('/')[0]]?.taker || DEFAULT_FEE
    const shortFee = DEFAULT_FEE // markets[shortLeg][selectedCoin.split('/')[0]]?.taker || DEFAULT_FEE

    const tradeCost = calculateTradeCost(tradeSize, longFee, shortFee)
    const potentialProfit = calculatePotentialProfit(tradeSize, spread, tradeCost, (longPrice+shortPrice)/2)

    return (
        <div className="space-y-2">
            <div>
                <span className="font-semibold">Price Spread:</span> ${spread.toFixed(4)}
            </div>
            <div>
                <span className="font-semibold">Spread Percentage:</span> {spreadPercentage.toFixed(4)}%
            </div>
            <div>
                <span className="font-semibold">Long Price:</span> ${longPrice.toFixed(4)}
            </div>
            <div>
                <span className="font-semibold">Short Price:</span> ${shortPrice.toFixed(4)}
            </div>
            <div>
                <span className="font-semibold">Long Fee:</span> {(longFee * 100).toFixed(4)}%
            </div>
            <div>
                <span className="font-semibold">Short Fee:</span> {(shortFee * 100).toFixed(4)}%
            </div>
            <div>
                <span className="font-semibold">Trade Cost:</span> ${tradeCost.toFixed(4)}
            </div>
            <div>
                <span className="font-semibold">Potential Profit:</span> <span className={potentialProfit >= 0 ? "text-green-500" : "text-red-500"}>${potentialProfit.toFixed(4)}</span>
            </div>
        </div>
    )
}