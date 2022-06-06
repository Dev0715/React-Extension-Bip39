// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

// Take the documentId parameter passed to this HTTP endpoint and update `approved` as true
// In the firestore under the path /transaction/:documentId/approved
exports.approveTransaction = functions.https.onRequest(async (req, res) => {
  // Grab the documentId parameter.
  const documentId = req.query.documentId;
  // Update approved key into Firestore using the Firebase Admin SDK.
  const writeResult = await admin
    .firestore()
    .collection("transaction")
    .doc(documentId)
    .update({
      approved: true,
    });
  // Send back a message that we've successfully written the document
  res.json({
    success: true,
    result: `Transaction approved at ${writeResult.writeTime
      .toDate()
      .toDateString()}.`,
  });
});

// Take the documentId parameter passed to this HTTP endpoint and update `rejected` as true
// In the firestore under the path /transaction/:documentId/rejected
exports.rejectTransaction = functions.https.onRequest(async (req, res) => {
  // Grab the documentId parameter.
  const documentId = req.query.documentId;
  // Update rejected key into Firestore using the Firebase Admin SDK.
  const writeResult = await admin
    .firestore()
    .collection("transaction")
    .doc(documentId)
    .update({
      rejected: true,
    });
  // Send back a message that we've successfully written the document
  res.json({
    success: true,
    result: `Transaction rejected at ${writeResult.writeTime
      .toDate()
      .toDateString()}.`,
  });
});
