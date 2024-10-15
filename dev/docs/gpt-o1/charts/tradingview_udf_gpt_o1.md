javascript: building udf required from tradingview chart-library, streaming data from crptocompare for both historical data and realtime data feed


10月03日 10:58 会话ID:(4647941)

好的，下面我将详细介绍如何使用JavaScript构建一个适用于TradingView图表库的用户定义函数（UDF），并通过CryptoCompare获取历史数据和实时数据流。整个过程包括以下几个步骤：

1. **项目设置**
2. **引入TradingView图表库**
3. **集成CryptoCompare API**
4. **实现数据提供者（Datafeed）**
5. **初始化和配置TradingView图表**
6. **示例代码**
7. **注意事项**

### 1. 项目设置

首先，确保你有一个前端开发环境，可以使用纯HTML、JavaScript，也可以使用现代框架如React、Vue等。以下示例将使用纯HTML和JavaScript进行说明。

**步骤：**

1. 创建一个新的项目文件夹，例如 `tradingview-crypto`.
2. 在文件夹内创建 `index.html` 和 `main.js` 文件。
3. 安装必要的依赖，你可能需要使用模块打包工具如Webpack或使用CDN引入库。

### 2. 引入TradingView图表库

TradingView提供了一个强大的图表库，可以通过其官方渠道获取许可和下载。假设你已经获得了TradingView图表库的使用权限。

**步骤：**

1. 下载TradingView图表库并将其资源文件放置在项目中。
2. 在 `index.html` 中引入TradingView图表库的CSS和JS文件。

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>TradingView 图表示例</title>
    <!-- 引入TradingView图表库的CSS -->
    <link rel="stylesheet" href="path/to/tradingview/charting_library.min.css">
    <style>
        #tv_chart_container {
            width: 100%;
            height: 600px;
        }
    </style>
</head>
<body>
    <div id="tv_chart_container"></div>

    <!-- 引入TradingView图表库的JS -->
    <script src="path/to/tradingview/charting_library.min.js"></script>
    <!-- 引入主应用的JS -->
    <script src="main.js"></script>
</body>
</html>
```

### 3. 集成CryptoCompare API

CryptoCompare提供丰富的加密货币数据，包括历史数据和实时数据。你需要获取API密钥并了解其API文档。

**步骤：**

1. 注册并获取CryptoCompare API密钥。
2. 阅读[CryptoCompare API文档](https://min-api.cryptocompare.com/documentation)以了解如何获取历史数据和实时数据。

**API关键点：**

- **历史数据**：使用 `https://min-api.cryptocompare.com/data/v2/histoday` 或其他时间段的端点获取OHLC数据。
- **实时数据**：使用WebSocket或轮询方式获取实时价格更新。

### 4. 实现数据提供者（Datafeed）

TradingView图表库需要一个数据提供者（Datafeed）来获取和处理数据。你需要实现符合其UDF接口的数据提供者。

**关键接口方法：**

- `onReady(callback)`: 初始化数据提供者。
- `resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback)`: 解析交易对符号。
- `getBars(symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback)`: 获取历史K线数据。
- `subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback)`: 订阅实时K线数据。
- `unsubscribeBars(subscriberUID)`: 取消订阅实时数据。

### 5. 初始化和配置TradingView图表

在实现数据提供者后，初始化TradingView图表并传入数据提供者。

### 6. 示例代码

以下是一个简化的示例，展示如何将上述步骤整合在一起。请根据你的实际项目需求进行调整和扩展。

**main.js**

```javascript
// main.js

// 替换为你的CryptoCompare API密钥
const CRYPTOCOMPARE_API_KEY = 'YOUR_CRYPTOCOMPARE_API_KEY';

// 实现Datafeed
class CryptoCompareDatafeed {
    constructor() {
        this.symbols = {}; // 存储符号信息
        this.subscribers = {}; // 存储实时订阅者
    }

    onReady(callback) {
        setTimeout(() => {
            callback({
                exchanges: [],
                symbols_types: [],
                supported_resolutions: ['1', '5', '15', '30', '60', '240', '1D'],
                supports_marks: false,
                supports_timescale_marks: false,
            });
        }, 0);
    }

    resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
        // 假设symbolName格式为 "BTC/USD"
        const [base, quote] = symbolName.split('/');
        const symbolInfo = {
            name: symbolName,
            ticker: symbolName,
            description: `${base} / ${quote}`,
            type: 'crypto',
            session: '24x7',
            timezone: 'Etc/UTC',
            minmov: 1,
            pricescale: 100,
            has_intraday: true,
            has_no_volume: false,
            supported_resolutions: ['1', '5', '15', '30', '60', '240', '1D'],
            volume_precision: 8,
        };
        this.symbols[symbolName] = symbolInfo;
        onSymbolResolvedCallback(symbolInfo);
    }

    getBars(symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) {
        const { from, to } = periodParams;
        const limit = 2000; // 获取最多2000根K线
        let aggregate = 1;

        // 将resolution转换为分钟
        switch (resolution) {
            case '1':
                aggregate = 1;
                break;
            case '5':
                aggregate = 5;
                break;
            case '15':
                aggregate = 15;
                break;
            case '30':
                aggregate = 30;
                break;
            case '60':
                aggregate = 60;
                break;
            case '240':
                aggregate = 240;
                break;
            case '1D':
                aggregate = 'day';
                break;
            default:
                aggregate = 1;
        }

        const [base, quote] = symbolInfo.name.split('/');

        let url = '';
        if (aggregate === 'day') {
            url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${base}&tsym=${quote}&limit=2000&api_key=${CRYPTOCOMPARE_API_KEY}`;
        } else {
            url = `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${base}&tsym=${quote}&aggregate=${aggregate}&limit=2000&api_key=${CRYPTOCOMPARE_API_KEY}`;
        }

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.Response !== 'Success') {
                    onErrorCallback(data.Message);
                    return;
                }
                const bars = data.Data.Data.map(bar => ({
                    time: bar.time * 1000,
                    low: bar.low,
                    high: bar.high,
                    open: bar.open,
                    close: bar.close,
                    volume: bar.volumefrom,
                }));
                onHistoryCallback(bars, { noData: bars.length === 0 });
            })
            .catch(error => {
                onErrorCallback(error);
            });
    }

    subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) {
        this.subscribers[subscribeUID] = onRealtimeCallback;

        const [base, quote] = symbolInfo.name.split('/');
        const socket = new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${CRYPTOCOMPARE_API_KEY}`);

        socket.onopen = () => {
            const subRequest = {
                action: 'SubAdd',
                subs: [`5~CCCAGG~${base}~${quote}`],
            };
            socket.send(JSON.stringify(subRequest));
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.TYPE === '5' && message.FROMSYMBOL === base && message.TOSYMBOL === quote) {
                const bar = {
                    time: new Date(message.TS * 1000).getTime(),
                    low: message.LOW,
                    high: message.HIGH,
                    open: message.OPEN,
                    close: message.CLOSE,
                    volume: message.TOTALVOLUME,
                };
                onRealtimeCallback(bar);
            }
        };

        socket.onerror = (error) => {
            console.error('WebSocket Error:', error);
        };

        // 存储WebSocket以便取消订阅时关闭连接
        this.subscribers[subscribeUID].socket = socket;
    }

    unsubscribeBars(subscriberUID) {
        const subscriber = this.subscribers[subscriberUID];
        if (subscriber && subscriber.socket) {
            // 发送取消订阅请求
            const unSubRequest = {
                action: 'SubRemove',
                subs: [`5~CCCAGG~${subscriber.symbol.split('/')[0]}~${subscriber.symbol.split('/')[1]}`],
            };
            subscriber.socket.send(JSON.stringify(unSubRequest));
            subscriber.socket.close();
            delete this.subscribers[subscriberUID];
        }
    }

    // 其他必要的方法可以根据需求添加
}

// 初始化TradingView图表
function initializeChart() {
    const datafeed = new CryptoCompareDatafeed();

    const widget = new TradingView.widget({
        symbol: 'BTC/USD',
        datafeed: datafeed,
        interval: '5',
        container_id: 'tv_chart_container',
        library_path: 'path/to/tradingview/', // 替换为实际路径
        locale: 'zh',
        disabled_features: ['use_localstorage_for_settings'],
        enabled_features: ['study_templates'],
        overrides: {},
    });
}

// 调用初始化函数
initializeChart();
```

**说明：**

1. **数据提供者（CryptoCompareDatafeed）**：
    - 实现了必要的接口方法，如 `onReady`、`resolveSymbol`、`getBars`、`subscribeBars` 和 `unsubscribeBars`。
    - `getBars` 方法通过HTTP请求获取历史K线数据。
    - `subscribeBars` 方法通过WebSocket连接接收实时数据，并调用实时回调函数。

2. **初始化TradingView图表**：
    - 创建了一个TradingView图表实例，传入符号、数据提供者和其他配置项。

### 7. 注意事项

1. **API限额**：
    - CryptoCompare的免费API有调用次数限制，请注意合理安排请求频率，避免超出限额。

2. **数据同步**：
    - 实时数据与历史数据的时间戳可能存在差异，确保数据的时间戳一致性。

3. **错误处理**：
    - 在实际应用中，应加入更多的错误处理机制，如网络错误、API错误等。

4. **性能优化**：
    - 对于高频数据，确保WebSocket连接和数据处理的效率，避免阻塞主线程。

5. **安全性**：
    - 不要在前端暴露你的CryptoCompare API密钥。推荐在后端代理请求并提供给前端。

6. **TradingView许可**：
    - 确保你拥有合法的TradingView图表库使用许可，并遵守相关使用条款。

### 完整示例

为了更好地帮助你理解，以下是完整的 `index.html` 和 `main.js` 示例代码。

**index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>TradingView 图表示例</title>
    <!-- 引入TradingView图表库的CSS -->
    <link rel="stylesheet" href="path/to/tradingview/charting_library.min.css">
    <style>
        #tv_chart_container {
            width: 100%;
            height: 600px;
        }
    </style>
</head>
<body>
    <div id="tv_chart_container"></div>

    <!-- 引入TradingView图表库的JS -->
    <script src="path/to/tradingview/charting_library.min.js"></script>
    <!-- 引入主应用的JS -->
    <script src="main.js"></script>
</body>
</html>
```

**main.js**

```javascript
// main.js

// 替换为你的CryptoCompare API密钥
const CRYPTOCOMPARE_API_KEY = 'YOUR_CRYPTOCOMPARE_API_KEY';

// 实现Datafeed
class CryptoCompareDatafeed {
    constructor() {
        this.symbols = {}; // 存储符号信息
        this.subscribers = {}; // 存储实时订阅者
    }

    onReady(callback) {
        setTimeout(() => {
            callback({
                exchanges: [],
                symbols_types: [],
                supported_resolutions: ['1', '5', '15', '30', '60', '240', '1D'],
                supports_marks: false,
                supports_timescale_marks: false,
            });
        }, 0);
    }

    resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
        // 假设symbolName格式为 "BTC/USD"
        const [base, quote] = symbolName.split('/');
        const symbolInfo = {
            name: symbolName,
            ticker: symbolName,
            description: `${base} / ${quote}`,
            type: 'crypto',
            session: '24x7',
            timezone: 'Etc/UTC',
            minmov: 1,
            pricescale: 100,
            has_intraday: true,
            has_no_volume: false,
            supported_resolutions: ['1', '5', '15', '30', '60', '240', '1D'],
            volume_precision: 8,
        };
        this.symbols[symbolName] = symbolInfo;
        onSymbolResolvedCallback(symbolInfo);
    }

    getBars(symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) {
        const { from, to } = periodParams;
        let aggregate = 1;

        // 将resolution转换为分钟或天
        if (resolution === '1D') {
            aggregate = 'day';
        } else {
            aggregate = parseInt(resolution, 10);
        }

        const [base, quote] = symbolInfo.name.split('/');

        let url = '';
        if (aggregate === 'day') {
            url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${base}&tsym=${quote}&limit=2000&api_key=${CRYPTOCOMPARE_API_KEY}`;
        } else {
            url = `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${base}&tsym=${quote}&aggregate=${aggregate}&limit=2000&api_key=${CRYPTOCOMPARE_API_KEY}`;
        }

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.Response !== 'Success') {
                    onErrorCallback(data.Message);
                    return;
                }
                const bars = data.Data.Data.map(bar => ({
                    time: bar.time * 1000,
                    low: bar.low,
                    high: bar.high,
                    open: bar.open,
                    close: bar.close,
                    volume: bar.volumefrom,
                }));
                onHistoryCallback(bars, { noData: bars.length === 0 });
            })
            .catch(error => {
                onErrorCallback(error);
            });
    }

    subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) {
        this.subscribers[subscribeUID] = onRealtimeCallback;

        const [base, quote] = symbolInfo.name.split('/');
        const socket = new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${CRYPTOCOMPARE_API_KEY}`);

        socket.onopen = () => {
            const subRequest = {
                action: 'SubAdd',
                subs: [`5~CCCAGG~${base}~${quote}`],
            };
            socket.send(JSON.stringify(subRequest));
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.TYPE === '5' && message.FROMSYMBOL === base && message.TOSYMBOL === quote) {
                const bar = {
                    time: new Date(message.TS * 1000).getTime(),
                    low: message.LOW,
                    high: message.HIGH,
                    open: message.OPEN,
                    close: message.CLOSE,
                    volume: message.TOTALVOLUME,
                };
                onRealtimeCallback(bar);
            }
        };

        socket.onerror = (error) => {
            console.error('WebSocket Error:', error);
        };

        // 存储WebSocket以便取消订阅时关闭连接
        this.subscribers[subscribeUID].socket = socket;
    }

    unsubscribeBars(subscriberUID) {
        const subscriber = this.subscribers[subscriberUID];
        if (subscriber && subscriber.socket) {
            // 发送取消订阅请求
            const unSubRequest = {
                action: 'SubRemove',
                subs: [`5~CCCAGG~${subscriber.symbol.split('/')[0]}~${subscriber.symbol.split('/')[1]}`],
            };
            subscriber.socket.send(JSON.stringify(unSubRequest));
            subscriber.socket.close();
            delete this.subscribers[subscriberUID];
        }
    }

    // 其他必要的方法可以根据需求添加
}

// 初始化TradingView图表
function initializeChart() {
    const datafeed = new CryptoCompareDatafeed();

    const widget = new TradingView.widget({
        symbol: 'BTC/USD',
        datafeed: datafeed,
        interval: '5',
        container_id: 'tv_chart_container',
        library_path: 'path/to/tradingview/', // 替换为实际路径
        locale: 'zh',
        disabled_features: ['use_localstorage_for_settings'],
        enabled_features: ['study_templates'],
        overrides: {},
    });
}

// 调用初始化函数
initializeChart();
```

### 8. 进一步优化

1. **后端代理**：
    - 为了安全性，建议将API请求通过后端代理进行，避免在前端暴露API密钥。

2. **数据缓存**：
    - 实现数据缓存机制，减少对API的重复请求，提升性能。

3. **错误处理和重连机制**：
    - 增强WebSocket的错误处理和断线重连机制，确保实时数据的稳定性。

4. **UI和功能扩展**：
    - 根据需求添加更多的图表功能，如指标、绘图工具等。

### 结语

通过上述步骤，你可以构建一个基于TradingView图表库的加密货币实时交易图表，并通过CryptoCompare API获取所需的数据。根据实际需求，你可以进一步优化和扩展功能，如支持更多交易对、增加技术指标等。如果在集成过程中遇到具体问题，欢迎进一步提问！