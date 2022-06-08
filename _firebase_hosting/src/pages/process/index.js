import axios from "axios";
import * as queryString from "query-string";
import { useEffect, useState } from "react";
import styles from "./index.module.css";

const approveApi =
  "https://us-central1-truly-wallet-5cd8f.cloudfunctions.net/approveTransaction";
const rejectApi =
  "https://us-central1-truly-wallet-5cd8f.cloudfunctions.net/rejectTransaction";

const state = {
  NONE: 0,
  PROCESSING: 1,
  UNKNOWN: 2,
  SUCCESS: 3,
  FAILED: 4,
};

let stateStep = 0;

const Process = () => {
  const [resMsg, setResMsg] = useState("Transaction request is processing ...");
  const [status, setStatus] = useState(state.NONE);

  useEffect(() => {
    if (stateStep > 0) return;
    stateStep++;

    const params = queryString.parse(window.location.search);
    if (params.documentId && params.action) {
      const { documentId, action } = params;
      setStatus(state.PROCESSING);

      let actionApi = approveApi;
      if (action === "reject") {
        actionApi = rejectApi;
      }

      axios
        .post(`${actionApi}?documentId=${documentId}`)
        .then((res) => {
          if (res?.success === true) {
            setResMsg(res.result);
            setStatus(state.SUCCESS);
          } else {
            setResMsg("Process Failed");
            setStatus(state.FAILED);
          }
        })
        .catch((err) => {
          setResMsg(err.message);
          setStatus(state.FAILED);
        });
    } else {
      setResMsg("Unknown Request");
      setStatus(state.UNKNOWN);
    }
  }, []);

  if (status === state.NONE) return;

  return (
    <div className={styles.wrapper}>
      {status === state.SUCCESS ? (
        <div className={styles.success}>{resMsg}</div>
      ) : status === state.PROCESSING ? (
        <div className={styles.waiting}>{resMsg}</div>
      ) : (
        <div className={styles.failed}>{resMsg}</div>
      )}
    </div>
  );
};

export default Process;
