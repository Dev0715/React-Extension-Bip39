// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");
// const cors = require("cors")({ origin: true });

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

const resultMessage = (writeResult, content) => {
  return `<!doctype html>
    <head>
      <title>Tx Approval Staus</title>
    </head>
    <body>
      ${content} at ${writeResult.writeTime.toDate().toDateString()}
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
  res.status(200).send(resultMessage(writeResult, "Tx approved"));
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
  res.status(200).send(resultMessage(writeResult, "Tx rejected"));
  // });
});
