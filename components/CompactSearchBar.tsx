"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import FavoriteButton from "./FavoriteButton";

interface SearchResult {
  id: string;
  symbol: string;
  name: string;
  type: "stock" | "index" | "crypto";
  exchange?: string;
}

/**
 * Barra de Pesquisa Compacta para Navigation
 * Versão pequena e estilosa para o topo
 */
export default function CompactSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Base completa de TODOS os ativos disponíveis - EXPANDIDA
  const allAssets: SearchResult[] = useMemo(() => [
    // ========== AÇÕES BRASILEIRAS (B3) - EXPANDIDO ==========
    { id: "BMFBOVESPA:VALE3", symbol: "VALE3", name: "Vale S.A.", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:PETR4", symbol: "PETR4", name: "Petrobras", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:PETR3", symbol: "PETR3", name: "Petrobras PN", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:ITUB4", symbol: "ITUB4", name: "Itaú Unibanco", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:ITUB3", symbol: "ITUB3", name: "Itaú Unibanco PN", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:BBDC4", symbol: "BBDC4", name: "Bradesco", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:BBDC3", symbol: "BBDC3", name: "Bradesco PN", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:ABEV3", symbol: "ABEV3", name: "Ambev S.A.", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:WEGE3", symbol: "WEGE3", name: "WEG S.A.", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:MGLU3", symbol: "MGLU3", name: "Magazine Luiza", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:RENT3", symbol: "RENT3", name: "Localiza", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:PRIO3", symbol: "PRIO3", name: "PetroRio", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:BPAC11", symbol: "BPAC11", name: "BTG Pactual", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:ELET3", symbol: "ELET3", name: "Centrais Elétricas Brasileiras", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:ELET6", symbol: "ELET6", name: "Centrais Elétricas Brasileiras PN", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:BBAS3", symbol: "BBAS3", name: "Banco do Brasil", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:SUZB3", symbol: "SUZB3", name: "Suzano S.A.", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:RADL3", symbol: "RADL3", name: "Raia Drogasil", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:CMIG4", symbol: "CMIG4", name: "Cemig", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:CSAN3", symbol: "CSAN3", name: "Cosan", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:EGIE3", symbol: "EGIE3", name: "Engie Brasil", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:KLBN11", symbol: "KLBN11", name: "Klabin", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:RAIL3", symbol: "RAIL3", name: "Rumo", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:USIM5", symbol: "USIM5", name: "Usinas Siderúrgicas", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:SANB11", symbol: "SANB11", name: "Santander Brasil", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:BRAP4", symbol: "BRAP4", name: "Bradespar", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:CYRE3", symbol: "CYRE3", name: "Cyrela", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:EMBR3", symbol: "EMBR3", name: "Embraer S.A.", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:ENBR3", symbol: "ENBR3", name: "EDP Brasil", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:EQTL3", symbol: "EQTL3", name: "Equatorial Energia", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:FLRY3", symbol: "FLRY3", name: "Fleury S.A.", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:GGBR4", symbol: "GGBR4", name: "Gerdau", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:HAPV3", symbol: "HAPV3", name: "Hapvida", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:HYPE3", symbol: "HYPE3", name: "Hypera Pharma", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:IRBR3", symbol: "IRBR3", name: "IRB Brasil", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:ITSA4", symbol: "ITSA4", name: "Itaúsa", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:JBSS3", symbol: "JBSS3", name: "JBS S.A.", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:LIGT3", symbol: "LIGT3", name: "Light S.A.", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:LREN3", symbol: "LREN3", name: "Lojas Renner", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:MULT3", symbol: "MULT3", name: "Multiplan", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:NTCO3", symbol: "NTCO3", name: "Natura & Co", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:PETZ3", symbol: "PETZ3", name: "Pet Center Comércio", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:RDOR3", symbol: "RDOR3", name: "Rede D'Or", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:SBSP3", symbol: "SBSP3", name: "Sabesp", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:TAEE11", symbol: "TAEE11", name: "Taesa", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:TIMS3", symbol: "TIMS3", name: "TIM S.A.", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:TOTS3", symbol: "TOTS3", name: "Totvs S.A.", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:UGPA3", symbol: "UGPA3", name: "Ultrapar", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:VIVT3", symbol: "VIVT3", name: "Telefônica Brasil", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:YDUQ3", symbol: "YDUQ3", name: "Yduqs Participações", type: "stock", exchange: "B3" },
    
    // ========== AÇÕES AMERICANAS (NASDAQ) - EXPANDIDO ==========
    { id: "NASDAQ:AAPL", symbol: "AAPL", name: "Apple Inc.", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:MSFT", symbol: "MSFT", name: "Microsoft Corporation", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:GOOGL", symbol: "GOOGL", name: "Alphabet Inc. (Google)", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:GOOG", symbol: "GOOG", name: "Alphabet Inc. Class C", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:AMZN", symbol: "AMZN", name: "Amazon.com Inc.", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:TSLA", symbol: "TSLA", name: "Tesla Inc.", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:NVDA", symbol: "NVDA", name: "NVIDIA Corporation", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:META", symbol: "META", name: "Meta Platforms Inc.", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:NFLX", symbol: "NFLX", name: "Netflix Inc.", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:AMD", symbol: "AMD", name: "Advanced Micro Devices", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:INTC", symbol: "INTC", name: "Intel Corporation", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:ADBE", symbol: "ADBE", name: "Adobe Inc.", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:PYPL", symbol: "PYPL", name: "PayPal Holdings", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:CMCSA", symbol: "CMCSA", name: "Comcast Corporation", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:COST", symbol: "COST", name: "Costco Wholesale", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:PEP", symbol: "PEP", name: "PepsiCo Inc.", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:AVGO", symbol: "AVGO", name: "Broadcom Inc.", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:QCOM", symbol: "QCOM", name: "Qualcomm Inc.", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:TXN", symbol: "TXN", name: "Texas Instruments", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:CHTR", symbol: "CHTR", name: "Charter Communications", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:MU", symbol: "MU", name: "Micron Technology", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:AMGN", symbol: "AMGN", name: "Amgen Inc.", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:ISRG", symbol: "ISRG", name: "Intuitive Surgical", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:SBUX", symbol: "SBUX", name: "Starbucks Corporation", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:TEAM", symbol: "TEAM", name: "Atlassian Corporation", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:ZM", symbol: "ZM", name: "Zoom Video Communications", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:SNPS", symbol: "SNPS", name: "Synopsys Inc.", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:CDNS", symbol: "CDNS", name: "Cadence Design Systems", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:CRWD", symbol: "CRWD", name: "CrowdStrike Holdings", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:ZS", symbol: "ZS", name: "Zscaler Inc.", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:OKTA", symbol: "OKTA", name: "Okta Inc.", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:DDOG", symbol: "DDOG", name: "Datadog Inc.", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:NET", symbol: "NET", name: "Cloudflare Inc.", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:FTNT", symbol: "FTNT", name: "Fortinet Inc.", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:PANW", symbol: "PANW", name: "Palo Alto Networks", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:PLTR", symbol: "PLTR", name: "Palantir Technologies", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:SOFI", symbol: "SOFI", name: "SoFi Technologies", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:HOOD", symbol: "HOOD", name: "Robinhood Markets", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:COIN", symbol: "COIN", name: "Coinbase Global", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:RIVN", symbol: "RIVN", name: "Rivian Automotive", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:LCID", symbol: "LCID", name: "Lucid Group", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:NIO", symbol: "NIO", name: "NIO Inc.", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:XPENG", symbol: "XPEV", name: "XPeng Inc.", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:LI", symbol: "LI", name: "Li Auto Inc.", type: "stock", exchange: "NASDAQ" },
    
    // ========== AÇÕES AMERICANAS (NYSE) - EXPANDIDO ==========
    { id: "NYSE:JPM", symbol: "JPM", name: "JPMorgan Chase & Co.", type: "stock", exchange: "NYSE" },
    { id: "NYSE:V", symbol: "V", name: "Visa Inc.", type: "stock", exchange: "NYSE" },
    { id: "NYSE:WMT", symbol: "WMT", name: "Walmart Inc.", type: "stock", exchange: "NYSE" },
    { id: "NYSE:JNJ", symbol: "JNJ", name: "Johnson & Johnson", type: "stock", exchange: "NYSE" },
    { id: "NYSE:PG", symbol: "PG", name: "Procter & Gamble", type: "stock", exchange: "NYSE" },
    { id: "NYSE:MA", symbol: "MA", name: "Mastercard Inc.", type: "stock", exchange: "NYSE" },
    { id: "NYSE:UNH", symbol: "UNH", name: "UnitedHealth Group", type: "stock", exchange: "NYSE" },
    { id: "NYSE:HD", symbol: "HD", name: "Home Depot", type: "stock", exchange: "NYSE" },
    { id: "NYSE:CVX", symbol: "CVX", name: "Chevron Corporation", type: "stock", exchange: "NYSE" },
    { id: "NYSE:MRK", symbol: "MRK", name: "Merck & Co.", type: "stock", exchange: "NYSE" },
    { id: "NYSE:ABBV", symbol: "ABBV", name: "AbbVie Inc.", type: "stock", exchange: "NYSE" },
    { id: "NYSE:KO", symbol: "KO", name: "Coca-Cola Company", type: "stock", exchange: "NYSE" },
    { id: "NYSE:PFE", symbol: "PFE", name: "Pfizer Inc.", type: "stock", exchange: "NYSE" },
    { id: "NYSE:TMO", symbol: "TMO", name: "Thermo Fisher Scientific", type: "stock", exchange: "NYSE" },
    { id: "NYSE:ABT", symbol: "ABT", name: "Abbott Laboratories", type: "stock", exchange: "NYSE" },
    { id: "NYSE:ACN", symbol: "ACN", name: "Accenture", type: "stock", exchange: "NYSE" },
    { id: "NYSE:LLY", symbol: "LLY", name: "Eli Lilly and Company", type: "stock", exchange: "NYSE" },
    { id: "NYSE:DHR", symbol: "DHR", name: "Danaher Corporation", type: "stock", exchange: "NYSE" },
    { id: "NYSE:VZ", symbol: "VZ", name: "Verizon Communications", type: "stock", exchange: "NYSE" },
    { id: "NYSE:ADP", symbol: "ADP", name: "Automatic Data Processing", type: "stock", exchange: "NYSE" },
    { id: "NYSE:BAC", symbol: "BAC", name: "Bank of America", type: "stock", exchange: "NYSE" },
    { id: "NYSE:WFC", symbol: "WFC", name: "Wells Fargo & Company", type: "stock", exchange: "NYSE" },
    { id: "NYSE:C", symbol: "C", name: "Citigroup Inc.", type: "stock", exchange: "NYSE" },
    { id: "NYSE:GS", symbol: "GS", name: "Goldman Sachs Group", type: "stock", exchange: "NYSE" },
    { id: "NYSE:MS", symbol: "MS", name: "Morgan Stanley", type: "stock", exchange: "NYSE" },
    { id: "NYSE:AXP", symbol: "AXP", name: "American Express", type: "stock", exchange: "NYSE" },
    { id: "NYSE:BA", symbol: "BA", name: "The Boeing Company", type: "stock", exchange: "NYSE" },
    { id: "NYSE:CAT", symbol: "CAT", name: "Caterpillar Inc.", type: "stock", exchange: "NYSE" },
    { id: "NYSE:CSCO", symbol: "CSCO", name: "Cisco Systems", type: "stock", exchange: "NYSE" },
    { id: "NYSE:CVS", symbol: "CVS", name: "CVS Health Corporation", type: "stock", exchange: "NYSE" },
    { id: "NYSE:DIS", symbol: "DIS", name: "The Walt Disney Company", type: "stock", exchange: "NYSE" },
    { id: "NYSE:DOW", symbol: "DOW", name: "Dow Inc.", type: "stock", exchange: "NYSE" },
    { id: "NYSE:GE", symbol: "GE", name: "General Electric", type: "stock", exchange: "NYSE" },
    { id: "NYSE:HON", symbol: "HON", name: "Honeywell International", type: "stock", exchange: "NYSE" },
    { id: "NYSE:IBM", symbol: "IBM", name: "International Business Machines", type: "stock", exchange: "NYSE" },
    { id: "NYSE:INTC", symbol: "INTC", name: "Intel Corporation", type: "stock", exchange: "NYSE" },
    { id: "NYSE:MCD", symbol: "MCD", name: "McDonald's Corporation", type: "stock", exchange: "NYSE" },
    { id: "NYSE:MMM", symbol: "MMM", name: "3M Company", type: "stock", exchange: "NYSE" },
    { id: "NYSE:MO", symbol: "MO", name: "Altria Group", type: "stock", exchange: "NYSE" },
    { id: "NYSE:NKE", symbol: "NKE", name: "Nike Inc.", type: "stock", exchange: "NYSE" },
    { id: "NYSE:ORCL", symbol: "ORCL", name: "Oracle Corporation", type: "stock", exchange: "NYSE" },
    { id: "NYSE:PM", symbol: "PM", name: "Philip Morris International", type: "stock", exchange: "NYSE" },
    { id: "NYSE:RTX", symbol: "RTX", name: "RTX Corporation", type: "stock", exchange: "NYSE" },
    { id: "NYSE:T", symbol: "T", name: "AT&T Inc.", type: "stock", exchange: "NYSE" },
    { id: "NYSE:UPS", symbol: "UPS", name: "United Parcel Service", type: "stock", exchange: "NYSE" },
    { id: "NYSE:XOM", symbol: "XOM", name: "Exxon Mobil Corporation", type: "stock", exchange: "NYSE" },
    
    // ========== ÍNDICES - EXPANDIDO ==========
    { id: "BMFBOVESPA:IBOVESPA", symbol: "IBOV", name: "Ibovespa", type: "index", exchange: "B3" },
    { id: "INDEX:SPX", symbol: "SPX", name: "S&P 500", type: "index", exchange: "NYSE" },
    { id: "INDEX:IXIC", symbol: "IXIC", name: "NASDAQ Composite", type: "index", exchange: "NASDAQ" },
    { id: "INDEX:DJI", symbol: "DJI", name: "Dow Jones Industrial Average", type: "index", exchange: "NYSE" },
    { id: "INDEX:NDX", symbol: "NDX", name: "NASDAQ 100", type: "index", exchange: "NASDAQ" },
    { id: "INDEX:RUT", symbol: "RUT", name: "Russell 2000", type: "index", exchange: "NYSE" },
    { id: "INDEX:VIX", symbol: "VIX", name: "CBOE Volatility Index", type: "index", exchange: "CBOE" },
    { id: "INDEX:FTSE", symbol: "FTSE", name: "FTSE 100 Index", type: "index", exchange: "LSE" },
    { id: "INDEX:NKY", symbol: "NKY", name: "Nikkei 225", type: "index", exchange: "TSE" },
    { id: "INDEX:DAX", symbol: "DAX", name: "DAX Performance Index", type: "index", exchange: "XETRA" },
    { id: "INDEX:CAC", symbol: "CAC", name: "CAC 40", type: "index", exchange: "EURONEXT" },
    { id: "INDEX:HSI", symbol: "HSI", name: "Hang Seng Index", type: "index", exchange: "HKEX" },
    { id: "INDEX:AS51", symbol: "AS51", name: "S&P/ASX 200", type: "index", exchange: "ASX" },
    { id: "INDEX:IBEX", symbol: "IBEX", name: "IBEX 35", type: "index", exchange: "BME" },
    { id: "INDEX:SSMI", symbol: "SSMI", name: "Swiss Market Index", type: "index", exchange: "SIX" },
    { id: "INDEX:TSX", symbol: "TSX", name: "S&P/TSX Composite", type: "index", exchange: "TSX" },
    
    // ========== CRIPTOMOEDAS - EXPANDIDO ==========
    { id: "BINANCE:BTCUSDT", symbol: "BTC", name: "Bitcoin", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:ETHUSDT", symbol: "ETH", name: "Ethereum", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:BNBUSDT", symbol: "BNB", name: "BNB", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:SOLUSDT", symbol: "SOL", name: "Solana", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:ADAUSDT", symbol: "ADA", name: "Cardano", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:XRPUSDT", symbol: "XRP", name: "Ripple", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:DOTUSDT", symbol: "DOT", name: "Polkadot", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:DOGEUSDT", symbol: "DOGE", name: "Dogecoin", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:MATICUSDT", symbol: "MATIC", name: "Polygon", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:AVAXUSDT", symbol: "AVAX", name: "Avalanche", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:LINKUSDT", symbol: "LINK", name: "Chainlink", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:LTCUSDT", symbol: "LTC", name: "Litecoin", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:UNIUSDT", symbol: "UNI", name: "Uniswap", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:ATOMUSDT", symbol: "ATOM", name: "Cosmos", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:ETCUSDT", symbol: "ETC", name: "Ethereum Classic", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:XLMUSDT", symbol: "XLM", name: "Stellar", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:ALGOUSDT", symbol: "ALGO", name: "Algorand", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:VETUSDT", symbol: "VET", name: "VeChain", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:ICPUSDT", symbol: "ICP", name: "Internet Computer", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:FILUSDT", symbol: "FIL", name: "Filecoin", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:TRXUSDT", symbol: "TRX", name: "TRON", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:EOSUSDT", symbol: "EOS", name: "EOS", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:AAVEUSDT", symbol: "AAVE", name: "Aave", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:AXSUSDT", symbol: "AXS", name: "Axie Infinity", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:THETAUSDT", symbol: "THETA", name: "Theta Network", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:SANDUSDT", symbol: "SAND", name: "The Sandbox", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:MANAUSDT", symbol: "MANA", name: "Decentraland", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:NEARUSDT", symbol: "NEAR", name: "NEAR Protocol", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:APTUSDT", symbol: "APT", name: "Aptos", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:ARBUSDT", symbol: "ARB", name: "Arbitrum", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:OPUSDT", symbol: "OP", name: "Optimism", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:SUIUSDT", symbol: "SUI", name: "Sui", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:INJUSDT", symbol: "INJ", name: "Injective", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:SEIUSDT", symbol: "SEI", name: "Sei Network", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:TIAUSDT", symbol: "TIA", name: "Celestia", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:STXUSDT", symbol: "STX", name: "Stacks", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:IMXUSDT", symbol: "IMX", name: "Immutable X", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:GRTUSDT", symbol: "GRT", name: "The Graph", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:RENDERUSDT", symbol: "RENDER", name: "Render Token", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:FETUSDT", symbol: "FET", name: "Fetch.ai", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:AGIXUSDT", symbol: "AGIX", name: "SingularityNET", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:OCEANUSDT", symbol: "OCEAN", name: "Ocean Protocol", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:TONUSDT", symbol: "TON", name: "Toncoin", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:SHIBUSDT", symbol: "SHIB", name: "Shiba Inu", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:CRVUSDT", symbol: "CRV", name: "Curve DAO", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:MKRUSDT", symbol: "MKR", name: "Maker", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:SNXUSDT", symbol: "SNX", name: "Synthetix", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:COMPUSDT", symbol: "COMP", name: "Compound", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:YFIUSDT", symbol: "YFI", name: "Yearn.finance", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:1INCHUSDT", symbol: "1INCH", name: "1inch Network", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:SUSHIUSDT", symbol: "SUSHI", name: "SushiSwap", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:CAKEUSDT", symbol: "CAKE", name: "PancakeSwap", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:FTMUSDT", symbol: "FTM", name: "Fantom", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:HBARUSDT", symbol: "HBAR", name: "Hedera", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:QNTUSDT", symbol: "QNT", name: "Quant", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:ZECUSDT", symbol: "ZEC", name: "Zcash", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:DASHUSDT", symbol: "DASH", name: "Dash", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:ZILUSDT", symbol: "ZIL", name: "Zilliqa", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:ENJUSDT", symbol: "ENJ", name: "Enjin Coin", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:CHZUSDT", symbol: "CHZ", name: "Chiliz", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:FLOWUSDT", symbol: "FLOW", name: "Flow", type: "crypto", exchange: "Binance" },
  ], []);

  useEffect(() => {
    if (query.length > 0) {
      const filtered = allAssets.filter(
        (asset) =>
          asset.symbol.toLowerCase().includes(query.toLowerCase()) ||
          asset.name.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered.slice(0, 10));
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query, allAssets]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "stock": return "AÇÃO";
      case "index": return "ÍNDICE";
      case "crypto": return "CRIPTO";
      default: return "";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "stock":
        return "bg-dark-info/20 text-dark-info border-dark-info/30";
      case "index":
        return "bg-dark-purple/20 text-dark-purple border-dark-purple/30";
      case "crypto":
        return "bg-dark-warning/20 text-dark-warning border-dark-warning/30";
      default:
        return "";
    }
  };

  const handleAssetClick = (asset: SearchResult) => {
    // Fecha o dropdown
    setQuery("");
    setIsOpen(false);
    
    // Navega para a página de cotações
    // Podemos adicionar um parâmetro de query para destacar o ativo específico
    router.push(`/cotacoes?symbol=${encodeURIComponent(asset.id)}`);
  };

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
          <svg
            className="w-3.5 h-3.5 text-dark-accent"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          placeholder="Buscar..."
          className="w-48 pl-9 pr-7 py-1.5 bg-dark-card/80 backdrop-blur-md border border-dark-border/80 
                   text-dark-text-primary text-xs font-light rounded-2xl
                   focus:border-dark-accent focus:outline-none focus:ring-2 focus:ring-dark-accent/30
                   placeholder:text-dark-text-secondary
                   transition-all duration-300 shadow-lg shadow-dark-accent/5
                   hover:bg-dark-card hover:border-dark-border"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute inset-y-0 right-0 pr-2.5 flex items-center"
          >
            <svg
              className="w-3.5 h-3.5 text-dark-text-muted hover:text-dark-text-primary transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Resultados */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-80 bg-dark-card border-2 border-dark-border shadow-2xl z-[90] max-h-80 overflow-y-auto rounded-3xl">
          {results.map((asset) => (
            <div
              key={asset.id}
              onClick={() => handleAssetClick(asset)}
              className="p-4 border-b border-dark-border/50 last:border-b-0 hover:bg-dark-card-hover hover:border-dark-accent/50 cursor-pointer transition-all duration-300 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2.5 py-1 text-[10px] font-light rounded border ${getTypeColor(asset.type)}`}>
                      {getTypeLabel(asset.type)}
                    </span>
                    <span className="text-base font-light text-dark-text-primary truncate group-hover:text-dark-accent transition-colors">
                      {asset.symbol}
                    </span>
                  </div>
                  <p className="text-sm text-dark-text-muted font-light truncate group-hover:text-dark-text-primary transition-colors">{asset.name}</p>
                  {asset.exchange && (
                    <p className="text-xs text-dark-text-secondary font-light mt-1">{asset.exchange}</p>
                  )}
                </div>
                <div onClick={(e) => e.stopPropagation()} className="ml-3">
                  <FavoriteButton
                    asset={{
                      id: asset.id,
                      symbol: asset.symbol,
                      name: asset.name,
                      type: asset.type,
                    }}
                    size="sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

