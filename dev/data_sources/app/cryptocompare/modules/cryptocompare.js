import { loadEnv } from "../../../db/modules/utils.js";
let BASE_URL;
let API_KEY;
let ENV;
let URLS;

export function setApiKey(api_key_env) {
  return loadEnv(api_key_env)
    .then((parsed) => {
      API_KEY = parsed.API_KEY;
    })
    .catch((error) => {
      console.error(error);
      throw new Error(`Error in setApiKey: ${error.message}`);
    });
}

function setUrlEnv(url_env) {
  return loadEnv(url_env)
    .then((parsed) => {
      ENV = parsed;
      BASE_URL = parsed.BASE_URL;
    })
    .catch((error) => {
      console.error(error);
      throw new Error(`Error in setUrlEnv: ${error.message}`);
    });
}

function setUrls() {
  if (ENV) {
    URLS = {
      coin_list: `${ENV.BASE_URL}${ENV.COIN_LIST}`,
      exchange_list: `${ENV.BASE_URL}${ENV.EXCHANGE_LIST}`,
    };
  } else {
    throw new Error(
      "Error in setUrls: you need to call setUrlEnv before using this function"
    );
  }
}

export function setCoinListUrl(url) {
  URLS.coin_list = url;
}

export function getCoinListUrl() {
  return URLS.coin_list;
}

export function init(url_env, api_key_env) {
  /*
  setUrlEnv(url_env);
  setApiKey(api_key_env);
  setUrls();
  */
  return setUrlEnv(url_env)
    .then(() => setUrls())
    .then(() => setApiKey(api_key_env))
    .catch((error) => {
      console.error(error);
      throw new Error(`Error in init: ${error.message}`);
    });
}

function fetchJSON(url_string) {
  if (API_KEY == undefined || URLS == undefined) {
    throw new Error("Error in fetchJSON: package is not initialized");
  }
  const url = new URL(url_string);
  url.searchParams.append("api_key", API_KEY);
  return fetch(url.toString())
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.error(error);
      throw new Error(`CryptoCompare request error: ${error.status}`);
    });
}

export function coinList() {
  return fetchJSON(URLS.coin_list);
}

export function exchangeList() {
  return fetchJSON(URLS.exchange_list);
}