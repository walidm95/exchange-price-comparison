'use client'

import React, { createContext, useContext, ReactNode } from 'react';
import ccxt, { Exchange, Market } from 'ccxt';
import { useEffect, useState } from 'react';

interface AppContextType {
    selectedCoin: string;
    setSelectedCoin: (coin: string) => void;
    tradeSize: number;
    setTradeSize: (size: number) => void;
    longLeg: string;
    setLongLeg: (exchange: string) => void;
    shortLeg: string;
    setShortLeg: (exchange: string) => void;
    hyperliquid: Exchange | null;
    binance: Exchange | null;
    markets: { [exchange: string]: { [symbol: string]: Market } };
    marketsLoaded: boolean;
    fillPrices: {
        long: number;
        short: number;
    };
    setFillPrices: (prices: { long: number; short: number }) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedCoin, setSelectedCoin] = useState('BTC');
    const [tradeSize, setTradeSize] = useState(10000);
    const [longLeg, setLongLeg] = useState('hyperliquid');
    const [shortLeg, setShortLeg] = useState('binance');
    const [hyperliquid, setHyperliquid] = useState<Exchange | null>(null);
    const [binance, setBinance] = useState<Exchange | null>(null);
    const [markets, setMarkets] = useState<{ [exchange: string]: { [symbol: string]: Market } }>({});
    const [marketsLoaded, setMarketsLoaded] = useState(false);
    const [fillPrices, setFillPrices] = useState({'long': 0, 'short': 0});

    useEffect(() => {
        const initializeExchanges = async () => {
            const hl = new ccxt.pro.hyperliquid();
            const bn = new ccxt.pro.binanceusdm();
            setHyperliquid(hl);
            setBinance(bn);

            const hyperliquidMarkets = await hl.fetchMarkets();
            const binanceMarkets = await bn.fetchMarkets();
            
            setMarkets({
                'hyperliquid': Object.fromEntries(hyperliquidMarkets.map(market => [market?.base, market])),
                'binance': Object.fromEntries(binanceMarkets.filter(market => (market?.quote === 'USDT') && (!market.future)).map(market => [market?.base, market])),
            });

            setMarketsLoaded(true);
        };

        initializeExchanges();
    }, []);

    const contextValue = {
        selectedCoin, setSelectedCoin,
        tradeSize, setTradeSize,
        longLeg, setLongLeg,
        shortLeg, setShortLeg,
        hyperliquid,
        binance,
        markets,
        marketsLoaded,
        fillPrices, setFillPrices
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};