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
    "https://api.blockcypher.com/v1/btc/test3",
  ],
  // Live Mode
  [
    "https://api.blockcypher.com/v1/eth/main", // Eth Api
    "https://api.blockcypher.com/v1/btc/main", // Btc Api
  ],
];
export const blockcypherSocket = [
  // Test Mode
  [
    "wss://socket.blockcypher.com/v1/beth/test", // Eth Api
    // "wss://socket.blockcypher.com/v1/bcy/test", // Btc Api
    "wss://socket.blockcypher.com/v1/btc/test3",
  ],
  // Live Mode
  [
    "wss://socket.blockcypher.com/v1/eth/main", // Eth Api
    "wss://socket.blockcypher.com/v1/btc/main", // Btc Api
  ],
];

export const GetBalanceInterval = 10000; // ms
export const GetTxStateInterval = 10000;
export const GetDbStateInterval = 10000;

export const emailJsServiceId = "service_60mm14e";
export const emailJsTemplateId = "template_46vxdm1";
export const emailJsPublicKey = "B5Lngmp-J6naxPtuK";
export const txApproveApi =
  "https://us-central1-truly-wallet-5cd8f.cloudfunctions.net/approveTransaction";
export const txRejectApi =
  "https://us-central1-truly-wallet-5cd8f.cloudfunctions.net/rejectTransaction";
export const txApproverEmail = "norikakizawa@bitprism.jp";
