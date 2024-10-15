# Tradingview advanced Chart

Reference:
- [Tradingview: how to connect data via datafeed API](https://www.tradingview.com/charting-library-docs/latest/tutorials/implement_datafeed_tutorial/)
- [Tradingview API Reference](https://www.tradingview.com/charting-library-docs/latest/api/)
- [Cryptocompare documentation (rest api and websocket)](https://min-api.cryptocompare.com/documentation)

## Running the app
```bash
npx serve
```

## Custom indicator
To add a custom indicator to the library, specify a function that returns a Promise object and assign this function to the [`custom_indicators_getter`](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.ChartingLibraryWidgetOptions#custom_indicators_getter) property in the [Widget Constructor](https://www.tradingview.com/charting-library-docs/latest/core_concepts/Widget-Constructor). The Promise object should be resolved with an array of [`CustomIndicator`](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.CustomIndicator) instances. In what follows, only one custom indicator will be created, therefore, the array contains one element.

`CustomIndicator` is an interface that we should implement to provide information on the indicator. The interface contains the following required fields:

- `name`: an indicator's internal name that is not visible in the UI. This name should be unique.
- `metainfo`: the field that describes how the indicator looks like.
- `constructor`: the field that contains data calculations.

### Structure
```js
var widget = window.tvWidget = new TradingView.widget({
    // ...
    custom_indicators_getter: function(PineJS) {
        return Promise.resolve([
            // Indicator object
            {
                name: 'Custom Moving Average',
                metainfo: {
                    // ...
                },
                constructor: function() {
                    // ...
                }
            }
        ]);
    },
});
```
### metainfo
### constructor