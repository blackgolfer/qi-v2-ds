// Datafeed implementation that you will add later
import Datafeed from './datafeed.js';

// [ChartingLibraryWidgetOptions](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.ChartingLibraryWidgetOptions)
window.tvWidget = new TradingView.widget({
    symbol: 'Bitfinex:BTC/USD',            // Default symbol pair
    interval: '1D',                        // Default interval
    fullscreen: true,                      // Displays the chart in the fullscreen mode
    container: 'tv_chart_container',       // Reference to the attribute of the DOM element
    datafeed: Datafeed,
    library_path: '../lib/charting_library/',
    theme: 'dark',
    enabled_features: ['chart_template_storage','header_saveload'], // https://www.tradingview.com/charting-library-docs/v25/api/interfaces/Charting_Library.ChartingLibraryWidgetOptions#enabled_features
});