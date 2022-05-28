export const chainName = ["Ethereum", "Bitcoin"];
export const chainSymbol = ["ETH", "BTC"];

// export const blockcypherApiKey = "8a8f6dd3cebf4c7ea853fd55330a3a89";
export const blockcypherApiKey = "4af3a702b1e54374880e7b0865925220";
export const mailchimpApiKey = "0Bn3vlM_lN6IkFojXX400Q";

export const isLiveMode = false;
export const blockcypherApi = [
  // Test Mode
  [
    "https://api.blockcypher.com/v1/beth/test", // Eth Api
    // "https://api.blockcypher.com/v1/bcy/test", // Btc Api
    "https://api.blockcypher.com/v1/btc/test3"
  ],
  // Live Mode
  [
    "https://api.blockcypher.com/v1/eth/main", // Eth Api
    "https://api.blockcypher.com/v1/btc/main", // Btc Api
  ],
];

export const GetBalanceInterval = 10000; // ms
