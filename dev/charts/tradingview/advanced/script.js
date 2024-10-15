function initOnReady() {
  var widget = (window.tvWidget = new TradingView.widget({
    library_path:
      "lib/charting_library/",
    // debug: true, // uncomment this line to see Library errors and warnings in the console
    fullscreen: true,
    symbol: "AAPL",
    interval: "1D",
    container: "tv_chart_container",
    datafeed: new Datafeeds.UDFCompatibleDatafeed(
      "http://localhost:8888"
    ),
    locale: "en",
    disabled_features: [],
    enabled_features: [],
    custom_indicators_getter: function (PineJS) {
      return Promise.resolve([
        {
          name: "Custom Moving Average",
            metainfo: {
              _metainfoVersion: 52,
              id: "Custom Moving Average@tv-basicstudies-1",
              description: "Custom Moving Average",
              shortDescription: "Custom MA",                            
              format: { type: "inherit" },
              linkedToSeries: true,
              is_price_study: true,
              plots: [
                { id: "plot_0", type: "line" },
                { id: "smoothedMA", type: "line" },
              ],
              defaults: {
                styles: {
                  plot_0: {
                    linestyle: 0,
                    linewidth: 1,
                    plottype: 0,
                    trackPrice: false,
                    transparency: 0,
                    visible: true,
                    color: "#2196F3",
                  },
                  smoothedMA: {
                    linestyle: 0,
                    linewidth: 1,
                    plottype: 0,
                    trackPrice: false,
                    transparency: 0,
                    visible: true,
                    color: "#9621F3",
                  },
                },
                inputs: {
                  length: 9,
                  source: "close",
                  offset: 0,
                  smoothingLine: "SMA",
                  smoothingLength: 9,
                },
              },
              styles: {
                plot_0: { title: "Plot", histogramBase: 0, joinPoints: true },
                smoothedMA: {
                  title: "Smoothed MA",
                  histogramBase: 0,
                  joinPoints: false,
                },
              },
              inputs: [
                {
                  id: "length",
                  name: "Length",
                  defval: 9,
                  type: "integer",
                  min: 1,
                  max: 10000,
                },
                {
                  id: "source",
                  name: "Source",
                  defval: "close",
                  type: "source",
                  options: [
                    "open",
                    "high",
                    "low",
                    "close",
                    "hl2",
                    "hlc3",
                    "ohlc4",
                  ],
                },
                {
                  id: "offset",
                  name: "Offset",
                  defval: 0,
                  type: "integer",
                  min: -10000,
                  max: 10000,
                },
                {
                  id: "smoothingLine",
                  name: "Smoothing Line",
                  defval: "SMA",
                  type: "text",
                  options: ["SMA", "EMA", "WMA"],
                },
                {
                  id: "smoothingLength",
                  name: "Smoothing Length",
                  defval: 9,
                  type: "integer",
                  min: 1,
                  max: 10000,
                },
              ],
            },
          constructor: function () {
            this.init = function (context, input) {
              this._context = context;
            };

            this.main = function (ctx, inputCallback) {
              this._context = ctx;
              this._input = inputCallback;

              var source = PineJS.Std[this._input(1)](this._context);
              // by default this is using the 'close' value
              // which is the same as:
              // var source = PineJS.Std.close(this._context);
              
              var length = this._input(0);
              var offset = this._input(2);
              var smoothingLine = this._input(3);
              var smoothingLength = this._input(4);

              // Let the library know how many extra bars (beyond the required
              // bars to render the chart) to download (if your indicator needs
              // extra historical data)
              this._context.setMinimumAdditionalDepth(length + smoothingLength);

              var series = this._context.new_var(source);
              var sma = PineJS.Std.sma(series, length, this._context);
              var sma_series = this._context.new_var(sma);

              var smoothedMA;
              if (smoothingLine === "EMA") {
                smoothedMA = PineJS.Std.ema(
                  sma_series,
                  smoothingLength,
                  this._context
                );
              } else if (smoothingLine === "WMA") {
                smoothedMA = PineJS.Std.wma(
                  sma_series,
                  smoothingLength,
                  this._context
                );
              } else {  // if (smoothingLine === "SMA") {
                smoothedMA = PineJS.Std.sma(
                  sma_series,
                  smoothingLength,
                  this._context
                );
              }

              return [
                { value: sma, offset: offset },
                { value: smoothedMA, offset: offset },
              ];
              
              // This would also work if you didn't want to use an offset
              // return [sma, smoothedMA];
            };
          },
        },
      ]);
    },
  }));
  widget.onChartReady(() => {
    widget.chart().createStudy('Custom Moving Average', false, false, undefined, { }, );
  });
}

window.addEventListener("DOMContentLoaded", initOnReady, false);