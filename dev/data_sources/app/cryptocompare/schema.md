## btc_prices hypertable schema
The btc_prices hypertable contains data about Bitcoin prices in 17 different fiat currencies since 2010:
<div style="overflow:auto"><table>
<thead>
<tr>
<th style="text-align:center">btc_prices hypertable schema</th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:center">Field</td>
<td>Description</td>
</tr>
<tr>
<td style="text-align:center">time</td>
<td>The day-specific timestamp of the price records, with time given as the default 00:00:00+00</td>
</tr>
<tr>
<td style="text-align:center">opening_price</td>
<td>The first price at which the coin was exchanged that day</td>
</tr>
<tr>
<td style="text-align:center">highest_price</td>
<td>The highest price at which the coin was exchanged that day</td>
</tr>
<tr>
<td style="text-align:center">lowest_price</td>
<td>The lowest price at which the coin was exchanged that day</td>
</tr>
<tr>
<td style="text-align:center">closing_price</td>
<td>The last price at which the coin was exchanged that day</td>
</tr>
<tr>
<td style="text-align:center">volume_btc</td>
<td>The volume exchanged in the cryptocurrency value that day, in BTC.</td>
</tr>
<tr>
<td style="text-align:center">volume_currency</td>
<td>The volume exchanged in its converted value for that day, quoted in the corresponding fiat currency.</td>
</tr>
<tr>
<td style="text-align:center">currency_code</td>
<td>Corresponds to the fiat currency used for non-btc prices/volumes.</td>
</tr>
</tbody>
</table></div>

## eth_prices hypertable schema
Similar to btc_prices, the eth_prices hypertable contains data about Ethereum prices in 17 different fiat currencies since 2015:
<div style="overflow:auto"><table>
<thead>
<tr>
<th style="text-align:center">eth_prices hypertable schema</th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:center">Field</td>
<td>Description</td>
</tr>
<tr>
<td style="text-align:center">time</td>
<td>The day-specific timestamp of the price records, with time given as the default 00:00:00+00</td>
</tr>
<tr>
<td style="text-align:center">opening_price</td>
<td>The first price at which the coin was exchanged that day</td>
</tr>
<tr>
<td style="text-align:center">highest_price</td>
<td>The highest price at which the coin was exchanged that day</td>
</tr>
<tr>
<td style="text-align:center">lowest_price</td>
<td>The lowest price at which the coin was exchanged that day</td>
</tr>
<tr>
<td style="text-align:center">closing_price</td>
<td>The last price at which the coin was exchanged that day</td>
</tr>
<tr>
<td style="text-align:center">volume_eth</td>
<td>The volume exchanged in the cryptocurrency value that day, in ETH.</td>
</tr>
<tr>
<td style="text-align:center">volume_currency</td>
<td>The volume exchanged in its converted value for that day, quoted in the corresponding fiat currency.</td>
</tr>
<tr>
<td style="text-align:center">currency_code</td>
<td>Corresponds to the fiat currency used for non-ETH prices/volumes.</td>
</tr>
</tbody>
</table></div>

## crypto_prices hypertable schema
The crypto_prices hypertable contains data about 4198 cryptocurrencies, including bitcoin and the corresponding crypto/BTC exchange rate, since 2012 or so:
<div style="overflow:auto"><table>
<thead>
<tr>
<th style="text-align:center">crypto_prices hypertable schema</th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:center">Field</td>
<td>Description</td>
</tr>
<tr>
<td style="text-align:center">time</td>
<td>The day-specific timestamp of the price records, with time given as the default 00:00:00+00</td>
</tr>
<tr>
<td style="text-align:center">opening_price</td>
<td>The first price at which the coin was exchanged that day</td>
</tr>
<tr>
<td style="text-align:center">highest_price</td>
<td>The highest price at which the coin was exchanged that day</td>
</tr>
<tr>
<td style="text-align:center">lowest_price</td>
<td>The lowest price at which the coin was exchanged that day</td>
</tr>
<tr>
<td style="text-align:center">closing_price</td>
<td>The last price at which the coin was exchanged that day</td>
</tr>
<tr>
<td style="text-align:center">volume_eth</td>
<td>The volume exchanged in the cryptocurrency value that day, in ETH.</td>
</tr>
<tr>
<td style="text-align:center">volume_currency</td>
<td>The volume exchanged in its converted value for that day, quoted in the corresponding fiat currency.</td>
</tr>
<tr>
<td style="text-align:center">currency_code</td>
<td>Corresponds to the fiat currency used for non-ETH prices/volumes.</td>
</tr>
</tbody>
</table></div>

## currency_info table schema
The currency_info hypertable, which maps the currency’s code to its name:
<div style="overflow:auto"><table>
<thead>
<tr>
<th style="text-align:center">currency_info table schema</th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:center">Field</td>
<td>Description</td>
</tr>
<tr>
<td style="text-align:center">currency_code</td>
<td>2-7 character abbreviation for currency. Used in other hypertables</td>
</tr>
<tr>
<td style="text-align:center">currency</td>
<td>English name of currency</td>
</tr>
</tbody>
</table></div>