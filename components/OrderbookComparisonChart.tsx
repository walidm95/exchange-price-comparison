'use client'

import { useEffect, useState, useRef } from 'react'
import { useAppContext } from '@/context/AppContext'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface PriceData {
    timestamp: number;
    longFillPrice: number;
    shortFillPrice: number;
}

interface Orderbook {
    bids: [number, number][];
    asks: [number, number][];
}

export default function OrderbookComparisonChart() {
    const { selectedCoin, tradeSize, longLeg, shortLeg, hyperliquid, binance, markets, marketsLoaded, setFillPrices } = useAppContext();
    const [priceData, setPriceData] = useState<PriceData[] | null>(null);
    const [currentOrderbook, setCurrentOrderbook] = useState<{ hyperliquid: Orderbook | null, binance: Orderbook | null }>({ hyperliquid: null, binance: null });
    const hyperliquidWs = useRef<WebSocket | null>(null);
    const binanceWs = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!hyperliquid || !binance || !marketsLoaded) return;

        const hyperliquidSymbol = markets['hyperliquid'][selectedCoin.split('/')[0]]?.symbol;
        const binanceSymbol = markets['binance'][selectedCoin.split('/')[0]]?.symbol;

        if (!hyperliquidSymbol || !binanceSymbol) return;

        // Reset price data when coin changes
        setPriceData(null);
        setCurrentOrderbook({ hyperliquid: null, binance: null });

        // Set up WebSocket connections
        const setupWebSockets = () => {
            // Hyperliquid WebSocket
            hyperliquid.watchOrderBook(hyperliquidSymbol).then(orderbook => {
                if (markets['hyperliquid'][selectedCoin.split('/')[0]]?.symbol === hyperliquidSymbol) {
                    updateChartData(orderbook as Orderbook, null);
                }
            });
    
            // Binance WebSocket
            binance.watchOrderBook(binanceSymbol).then(orderbook => {
                if (markets['binance'][selectedCoin.split('/')[0]]?.symbol === binanceSymbol) {
                    updateChartData(null, orderbook as Orderbook);
                }
            });
        };

        setupWebSockets();

        return () => {
            if (hyperliquidWs.current) {
                hyperliquidWs.current.close();
            }
            if (binanceWs.current) {
                binanceWs.current.close();
            }
        };
    }, [selectedCoin, hyperliquid, binance, markets, marketsLoaded]);

    useEffect(() => {
        const interval = setInterval(() => {
            const longFillPrice = calculateFillPrice(longLeg as 'hyperliquid' | 'binance', 'long');
            const shortFillPrice = calculateFillPrice(shortLeg as 'hyperliquid' | 'binance', 'short');
            
            setPriceData(prevData => {
                if (!prevData || prevData.length === 0) {
                    // If it's the first data point or prevData is null, create 100 identical points
                    const initialData = Array(100).fill({
                        timestamp: Date.now(),
                        longFillPrice,
                        shortFillPrice
                    });
                    return initialData;
                } else {
                    // Otherwise, add the new data point and keep the last 100
                    return [
                        ...prevData.slice(-99),
                        {
                            timestamp: Date.now(),
                            longFillPrice,
                            shortFillPrice
                        }
                    ];
                }
            });

            // Used for arbitrage info
            setFillPrices({'long': longFillPrice || 0, 'short': shortFillPrice || 0});
        }, 100);

        return () => clearInterval(interval);
    }, [longLeg, shortLeg, tradeSize, currentOrderbook]);

    const updateChartData = (hyperliquidOrderbook: Orderbook | null, binanceOrderbook: Orderbook | null) => {
        setCurrentOrderbook(prev => ({
            hyperliquid: hyperliquidOrderbook || prev.hyperliquid,
            binance: binanceOrderbook || prev.binance
        }));
    };

    const calculateFillPrice = (leg: 'hyperliquid' | 'binance', side: 'long' | 'short') => {
        const orderbook = currentOrderbook[leg];
        if (!orderbook) return null;

        let remainingDollars = tradeSize;
        let totalCoins = 0;

        const orders = side === 'long' ? orderbook.asks : orderbook.bids;

        for (const [price, size] of orders) {
            if (remainingDollars <= 0) break;
            const fillDollars = Math.min(remainingDollars, size * price);
            const fillCoins = fillDollars / price;
            totalCoins += fillCoins;
            remainingDollars -= fillDollars;
        }

        return tradeSize / totalCoins;
    };

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString()} />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip labelFormatter={(value) => new Date(value).toLocaleString()} />
                <Legend />
                <Line type="basisOpen" dataKey="longFillPrice" stroke="#008000" dot={false} name={`${longLeg[0].toUpperCase() + longLeg.slice(1).toLowerCase()} (Long)`} />
                <Line type="basisOpen" dataKey="shortFillPrice" stroke="#ff0000" dot={false} name={`${shortLeg[0].toUpperCase() + shortLeg.slice(1).toLowerCase()} (Short)`} />
            </LineChart>
        </ResponsiveContainer>
    )
}