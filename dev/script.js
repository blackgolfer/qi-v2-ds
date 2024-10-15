const chart = LightweightCharts.createChart(document.getElementById('chart'), {
  width: 800,
  height: 500,
  layout: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
  },
  grid: {
      vertLines: {
          visible: true,
      },
      horzLines: {
          visible: true,
      },
  },
  crossHair: {
      mode: LightweightCharts.CrosshairMode.Normal,
  },
});

const lineSeries = chart.addCandlestickSeries({
  upColor: '#4FFF9F',
  downColor: '#FF4976',
  borderUpColor: '#4FFF9F',
  borderDownColor: '#FF4976',
  wickUpColor: '#4FFF9F',
  wickDownColor: '#FF4976',
});

const fetchData = async () => {
  const response = await fetch('https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&limit=100&api_key=YOUR_API_KEY');
  const data = await response.json();
  
  const candlestickData = data.Data.Data.map(item => ({
      time: item.time * 1000, // Convert to milliseconds
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
  }));

  lineSeries.setData(candlestickData);
};

fetchData();
