import styles from "./index.module.css";
import { useGloabalStateContext } from "../../context/provider";
import { BuyIcon, SendIcon } from "../../context/svgs";
import { useEffect, useState } from "react";
import {
  blockcypherApi,
  chainSymbol,
  emailJsPublicKey,
  emailJsServiceId,
  emailJsTemplateId,
  GetDbStateInterval,
  isLiveMode,
  txApproveApi,
  txApproverEmail,
  txRejectApi,
} from "../../context/config";
import axios from "axios";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { goTo } from "react-chrome-extension-router";
import Status from "../signtx/status";
import { toBTC, toETH } from "../../context/utils";
import emailjs from "@emailjs/browser";

const Activity = () => {
  const { isBTC, btcKeys, ethKeys, _setTxData } = useGloabalStateContext();
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    getHistory();
    const timerId = setInterval(getHistory, GetDbStateInterval);
    return () => {
      clearInterval(timerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBTC]);

  const getHistory = async () => {
    const _address = isBTC
      ? btcKeys.address.toLocaleLowerCase()
      : ethKeys.address.toLocaleLowerCase();

    const _array2 = await getBlockTxs(_address);
    const _array1 = await getDbTxs(_address);
    setActivity([..._array1, ..._array2]);
    console.log("Get History");
  };

  const getBlockTxs = async (_address) => {
    try {
      const res = await axios.get(
        `${
          blockcypherApi[Number(isLiveMode)][Number(isBTC)]
        }/addrs/${_address}/full`
      );
      console.log(res);
      const _txs = res.data.txs;
      const _activity = _txs
        .map((item) => fromBlockTx(item, _address))
        .filter((item) => item.amount !== 0);
      return [..._activity];
    } catch (err) {
      console.log(err);
      return [];
    }
  };

  const getDbTxs = async (_address) => {
    const q = query(
      collection(db, "transaction"),
      where("address", "==", _address)
      // where("address", "!=", "wallet address")
    );

    const querySnapshot = await getDocs(q);
    const _array = [];
    querySnapshot.forEach((doc) => {
      const _data = doc.data();
      const _activity = fromDbTx(
        _data.txdata,
        _data.approved,
        _data.rejected,
        doc.id
      );
      _array.push(_activity);
    });
    return [..._array];
  };

  const fromBlockTx = (item, _address) => {
    const _inputAddr = isBTC
      ? item.inputs[0].addresses[0]
      : "0x" + item.inputs[0].addresses[0];
    const _outputAddr = isBTC
      ? item.outputs[0].addresses[0]
      : "0x" + item.outputs[0].addresses[0];
    const _outputVal = isBTC
      ? toBTC(item.outputs[0].value)
      : toETH(item.outputs[0].value);
    const _date = item.confirmed.replace("T", " ").replace("Z", "");
    return {
      type: _address === _inputAddr.toLowerCase() ? "Send" : "Receive",
      amount: _outputVal,
      to: _address === _inputAddr.toLowerCase() ? _outputAddr : _inputAddr,
      date: _date,
    };
  };

  const fromDbTx = (_txdata, isApproved, isRejected, docId) => {
    const item = _txdata.tx;
    const _outputAddr = isBTC
      ? item.outputs[0].addresses[0]
      : "0x" + item.outputs[0].addresses[0];
    const _outputVal = isBTC
      ? toBTC(item.outputs[0].value)
      : toETH(item.outputs[0].value);
    const _date = item.received.replace("T", " ").split(".")[0];
    return {
      type: isApproved ? "Approved" : isRejected ? "Rejected" : "Pending",
      amount: _outputVal,
      to: _outputAddr,
      date: _date,
      txdata: _txdata,
      docId,
    };
  };

  const shortAddress = (_address) => {
    const len = _address.length;
    const _short =
      _address.substr(0, isBTC ? 3 : 5) + "..." + _address.substr(len - 4, 4);
    return _short;
  };

  const onActivityClick = async (index) => {
    const item = activity[index];
    if (item.type.toUpperCase() === "APPROVED") {
      _setTxData(item);
      goTo(Status);
    } else if (item.type.toUpperCase() === "REJECTED") {
      await updateDoc(doc(db, "transaction", item.docId), {
        approved: false,
        rejected: false,
      });
      const _activity = activity;
      _activity[index].type = "Pending";
      setActivity([..._activity]);
      console.log("Document with ID was formatted", item.docId);
      await resendEmail(item);
    } else if (item.type.toUpperCase() === "PENDING") {
      await resendEmail(item);
    }
  };

  const resendEmail = async (item) => {
    const _amount = isBTC
      ? toBTC(item.txdata.tx.outputs[0].value)
      : toETH(item.txdata.tx.outputs[0].value);
    const _balance = await getBalance();
    const _res = await emailjs.send(
      emailJsServiceId,
      emailJsTemplateId,
      {
        from_address: item.txdata.tx.inputs[0].addresses[0],
        to_address: item.txdata.tx.outputs[0].addresses[0],
        amount: _amount,
        currency: chainSymbol[Number(isBTC)],
        link_approve: `${txApproveApi}?documentId=${item.docId}`,
        url_reject: `${txRejectApi}?documentId=${item.docId}`,
        to_mail: txApproverEmail,
        user_name: "User Name",
        balance: _balance,
      },
      emailJsPublicKey
    );
    console.log(_res);
  };

  const getBalance = async () => {
    try {
      const address = isBTC ? btcKeys.address : ethKeys.address;
      const _res = await axios.get(
        `${
          blockcypherApi[Number(isLiveMode)][Number(isBTC)]
        }/addrs/${address}/balance`
      );
      return isBTC ? toBTC(_res.data.balance) : toETH(_res.data.balance);
    } catch (err) {
      console.log(err);
      return -1;
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>Activity</div>
      <div className={styles.activity_wrapper}>
        {activity.map((item, index) => (
          <div
            className={`${styles.activity} ${
              item.type.toUpperCase() === "APPROVED"
                ? styles.activity_approved
                : item.type.toUpperCase() === "REJECTED"
                ? styles.activity_rejected
                : item.type.toUpperCase() === "PENDING"
                ? styles.activity_pending
                : ""
            }`}
            onClick={() => onActivityClick(index)}
            key={index}
          >
            <div className={styles.activity_symbol}>
              {item.type.toUpperCase() === "RECEIVE" ? (
                <BuyIcon />
              ) : (
                <SendIcon />
              )}
            </div>
            <div className={styles.activity_content}>
              <div className={styles.activity_top}>
                <div>{item.type}</div>
                {item.type.toUpperCase() === "APPROVED" ? (
                  <div className={styles.activity_btn}>SendTx</div>
                ) : item.type.toUpperCase() === "REJECTED" ? (
                  <div className={styles.activity_btn}>Resend</div>
                ) : item.type.toUpperCase() === "PENDING" ? (
                  <div className={styles.activity_btn}>Resend</div>
                ) : (
                  <></>
                )}
                <div>{`${item.type.toUpperCase() === "RECEIVE" ? "+" : "-"}${
                  item.amount
                } ${chainSymbol[Number(isBTC)]}`}</div>
              </div>
              <div className={styles.activity_bottom}>
                <div className={styles.activity_date}>{item.date}</div>
                <div className={styles.activity_to}>
                  {item.type.toUpperCase() === "RECEIVE" ? "From" : "To"}
                  {` ${shortAddress(item.to)}`}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Activity;
