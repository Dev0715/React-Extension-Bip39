// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");
// const cors = require("cors")({ origin: true });

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

const approveMessage = (writeResult) => {
  return `<!doctype html>
    <head>
      <title>Tx Approval Staus</title>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    </head>
    <body>
      <div style="width: 100%; display: flex; flex-direction: column; align-items: center; gap: 32px; margin-top: 120px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60">
          <g id="icon_confirm" transform="translate(-141 -315)">
            <path id="パス_47" data-name="パス 47" d="M30,0A30,30,0,1,1,0,30,30,30,0,0,1,30,0Z" transform="translate(141 315)" fill="#81d056"/>
            <path id="Icon_feather-check" data-name="Icon feather-check" d="M14.764,27.662a1.893,1.893,0,0,1-1.3-.509L5.789,19.909a1.67,1.67,0,0,1,0-2.458,1.92,1.92,0,0,1,2.6,0l6.371,6.014L30.342,8.759a1.92,1.92,0,0,1,2.6,0,1.67,1.67,0,0,1,0,2.458L16.066,27.153A1.893,1.893,0,0,1,14.764,27.662Z" transform="translate(151.632 328.809)" fill="#fff"/>
          </g>
        </svg>
        トランザクションが承認されました。
      </div>
    </body>
  </html>`;
};

const rejectMessage = (writeResult) => {
  return `<!doctype html>
    <head>
      <title>Tx Approval Staus</title>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    </head>
    <body>
      <div style="width: 100%; display: flex; flex-direction: column; align-items: center; gap: 32px; margin-top: 120px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60">
          <path id="icon_circle_cancel" d="M33,3A30,30,0,1,0,63,33,29.973,29.973,0,0,0,33,3ZM48,43.77,43.77,48,33,37.23,22.23,48,18,43.77,28.77,33,18,22.23,22.23,18,33,28.77,43.77,18,48,22.23,37.23,33Z" transform="translate(-3 -3)" fill="#e3348c"/>
        </svg>
        トランザクションが否認されました。
      </div>
    </body>
  </html>`;
};

// Take the documentId parameter passed to this HTTP endpoint and update `approved` as true
// In the firestore under the path /transaction/:documentId/approved
exports.approveTransaction = functions.https.onRequest(async (req, res) => {
  // cors(res, req, async () => {
  // res.header("Content-Type", "application/json");
  // const documentId = req.body.documentId;
  const documentId = req.query.documentId;
  const writeResult = await admin
    .firestore()
    .collection("transaction")
    .doc(documentId)
    .update({
      approved: true,
    });
  // Send back a message that we've successfully written the document
  // res.json({
  //   success: true,
  //   result: `Transaction approved at ${writeResult.writeTime
  //     .toDate()
  //     .toDateString()}.`,
  // });
  res.status(200).send(approveMessage(writeResult));
  // });
});

// Take the documentId parameter passed to this HTTP endpoint and update `rejected` as true
// In the firestore under the path /transaction/:documentId/rejected
exports.rejectTransaction = functions.https.onRequest(async (req, res) => {
  // cors(res, req, async () => {
  // res.header("Content-Type", "application/json");
  // const documentId = req.body.documentId;
  const documentId = req.query.documentId;
  const writeResult = await admin
    .firestore()
    .collection("transaction")
    .doc(documentId)
    .update({
      rejected: true,
    });
  // Send back a message that we've successfully written the document
  // res.json({
  //   success: true,
  //   result: `Transaction rejected at ${writeResult.writeTime
  //     .toDate()
  //     .toDateString()}.`,
  // });
  res.status(200).send(rejectMessage(writeResult));
  // });
});
