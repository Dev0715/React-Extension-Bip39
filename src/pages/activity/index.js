import styles from "./index.module.css";
import { useGloabalStateContext } from "../../context/provider";
import { useEffect, useState } from "react";
import {
  blockcypherApi,
  blockcypherApiKey,
  blockExplorer,
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
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { goTo } from "react-chrome-extension-router";
import Status from "../signtx/status";
import { toBTC, toETH } from "../../context/utils";
import emailjs from "@emailjs/browser";
import Header from "../../components/header";
import SubHeader from "../../components/subheader";
import Btn from "../../components/button";

const Activity = () => {
  const { isBTC, btcKeys, ethKeys, _setTxDataToSend, _setActivityToConf, _txHash, _setTxHash, _setStep, _userName } =
    useGloabalStateContext();
  const [activity, setActivity] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getHistory();
    const timerId = setInterval(getHistory, GetDbStateInterval);
    return () => {
      clearInterval(timerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBTC, _txHash]);

  const getHistory = async () => {
    const _address = isBTC ? btcKeys.address : ethKeys.address.toLowerCase();

    const _array2 = await getBlockTxs(_address);
    const _array1 = await getDbTxs(_address);
    setActivity([..._array1, ..._array2]);
  };

  const getBlockTxs = async (_address) => {
    try {
      const res = await axios.get(
        `${
          blockcypherApi[Number(isLiveMode)][Number(isBTC)]
        }/addrs/${_address}/full?token=${blockcypherApiKey}`
      );
      const _txs = res.data.txs;
      const _activity = _txs
        .map((item) => fromBlockTx(item, _address))
        .filter((item) => item.amount !== 0);
      return [..._activity];
    } catch (err) {
      if (err.status === 429 || err.code === "ERR_NETWORK") {
        setError("Call Limit! Retry after 5 mins!");
      }
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
    querySnapshot?.forEach((doc) => {
      const _data = doc.data();
      const _activity = fromDbTx(
        _data.txdata,
        _data.broadcasted,
        _data.approved,
        _data.rejected,
        // doc.id 
      );
      _activity.docId = doc.id;
      _activity.finalTxHash = _data.finalTxHash;
      _array.push(_activity);
      if (_data.finalTxHash) {passActivityToConf(_activity, doc.id)};
    });
    return [..._array].reverse();
  };

  const passActivityToConf = (_activity, docId) => {
    if(_activity.type === "Broadcasted") {
      _setActivityToConf(_activity);
    }
  };

  const btcOutputVal = (item, _address) => {
    let outputVal = 0;
    const myOutPuts = item.outputs
      .filter((output, idx) => {
        if(output.addresses[0].toLowerCase() === _address.toLowerCase()){
          outputVal += output.value;
          return output;
      }});
    return outputVal;
  };

  const fromBlockTx = (item, _address) => {
    const _inputAddr = isBTC
      ? item.inputs[0].addresses[0]
      : "0x" + item.inputs[0].addresses[0];
    const outIndex = item.outputs.length > 1 ? 1 : 0;
    const _outputAddr = isBTC
      ? item.outputs[outIndex].addresses[0]
      : "0x" + item.outputs[outIndex].addresses[0];
    const _outputVal = isBTC
      ? toBTC(btcOutputVal(item, _address))
      : toETH(item.outputs[outIndex].value);
    const _date = item.confirmed?.replace("T", " ").replace("Z", "");
    return {
      type:
        _address.toLowerCase() === _inputAddr.toLowerCase()
          ? "Send"
          : "Receive",
      amount: _outputVal,
      to:
        _address.toLowerCase() === _inputAddr.toLowerCase()
          ? _outputAddr
          : _inputAddr,
      date: _date,
      hash: item.hash,
    };
  };

  const fromDbTx = (_txdata, isBroadcasted, isApproved, isRejected) => {
    const item = _txdata.tx ? _txdata.tx : _txdata.txdata.tx;
    const _outputAddr = isBTC
      ? item.outputs[0].addresses[0]
      : "0x" + item.outputs[0].addresses[0];
    const _outputVal = isBTC
      ? toBTC(item.outputs[0].value)
      : toETH(item.outputs[0].value);
    const _date = item.received.replace("T", " ").split(".")[0];
    return {
      type: isBroadcasted 
        ? "Broadcasted"
        : isApproved 
        ? "Approved" 
        : isRejected 
        ? "Rejected" 
        : "Pending",
      amount: _outputVal,
      to: _outputAddr,
      date: _date,
      txdata: _txdata
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
      _setTxDataToSend(item);
      _setTxHash("");
      _setStep(1);
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
    } else if (item.type.toUpperCase() === "SEND") {
      window.open(
        `${blockExplorer[Number(isLiveMode)][Number(isBTC)]}/${
          activity[index].hash
        }`
      );
    }
  };

  const onActivityCancel = async (index) => {
    const item = activity[index];
    await deleteDoc(doc(db, "transaction", item.docId));
    const _activity = activity;
    _activity.splice(index, 1);
    setActivity([..._activity]);
  };

  const resendEmail = async (item) => {
    const _tx = item.txdata.tx ? item.txdata.tx : item.txdata.txdata.tx;
    const _amount = isBTC
      ? toBTC(_tx.outputs[0].value)
      : toETH(_tx.outputs[0].value);
    const _balance = await getBalance();
    const _res = await emailjs.send(
      emailJsServiceId,
      emailJsTemplateId,
      {
        from_address: _tx.inputs[0].addresses[0],
        to_address: _tx.outputs[0].addresses[0],
        user_name: _userName,
        amount: _amount,
        currency: chainSymbol[Number(isBTC)],
        link_approve: `${txApproveApi}?documentId=${item.docId}`,
        url_reject: `${txRejectApi}?documentId=${item.docId}`,
        to_mail: txApproverEmail,
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
      if (err.response.status === 429 || err.code === "ERR_NETWORK") {
        setError("Call Limit! Retry after 5 mins!");
      }
      console.log(err);
      return -1;
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <SubHeader title="ACTIVITY" />
      <div className={styles.wrapper}>
        {error !== "" && <div className={styles.error_429}>{error}</div>}
        {activity.map((item, index) => (
          <div className={styles.activity} key={index}>
            <img
              className={styles.chain_logo}
              src={`/icons/icon_circle_${
                isBTC ? "bitcoin" : "ethereum"
              }_gray.svg`}
              alt=""
            />
            <div className={styles.activity_content}>
              <div className={styles.line_first}>
                <div className={styles.activity_type}>
                  <img
                    src={`/icons/icon_${
                      item.type.toUpperCase() === "RECEIVE" ? "receive" : "send"
                    }_black.svg`}
                    alt=""
                  />
                  {item.type.toUpperCase() === "RECEIVE" ? "Receive" : "Send"}
                </div>
                <div
                  className={styles.activity_amount}
                  style={{
                    color:
                      item.type.toUpperCase() === "RECEIVE"
                        ? "#FC3547"
                        : "#0096F4",
                  }}
                >
                  {`${item.type.toUpperCase() === "RECEIVE" ? "+" : "-"} ${
                    item.amount
                  }`}
                  <div className={styles.chain_symbol}>
                    {chainSymbol[Number(isBTC)]}
                  </div>
                </div>
              </div>

              <div className={styles.line_second}>
                {item.type.toUpperCase() === "BROADCASTED" ? (
                  <div className={styles.activity_state}>
                    <div
                      className={styles.state_symbol}
                      style={{ backgroundColor: "#E3348C" }}
                    ></div>
                    waiting for tx confirmation
                  </div>
                ) : item.type.toUpperCase() === "APPROVED" ? (
                  <div className={styles.activity_state}>
                    <div
                      className={styles.state_symbol}
                      style={{ backgroundColor: "#F4C364" }}
                    ></div>
                    waiting for broadcast
                  </div>
                ) : item.type.toUpperCase() === "REJECTED" ? (
                  <div className={styles.activity_state}>
                    <div
                      className={styles.state_symbol}
                      style={{ backgroundColor: "gray" }}
                    ></div>
                    request rejected
                  </div>
                ) : item.type.toUpperCase() === "PENDING" ? (
                  <div className={styles.activity_state}>
                    <div
                      className={styles.state_symbol}
                      style={{ backgroundColor: "#FC3547" }}
                    ></div>
                    waiting for approval
                  </div>
                ) : item.type.toUpperCase() === "SEND" ? (
                  <div className={styles.activity_state}>
                    <img src="/icons/icon_check.svg" alt="" />
                    confirmed
                  </div>
                ) : (
                  <div></div>
                )}
                {item.type.toUpperCase() === "RECEIVE" ?
                  (<div className={styles.date}>{item.date}</div>) 
                  : <></>
                }
                <div className={styles.activity_to}>
                  <img src="/icons/icon_address.svg" alt="" />
                  <div className={styles.from_to}>
                    {item.type.toUpperCase() === "RECEIVE" ? "From" : "To"}
                  </div>
                  {`${shortAddress(item.to)}`}
                </div>
              </div>
              {item.type.toUpperCase() !== "RECEIVE" && (
                <div className={styles.line_third}>
                    <div className={styles.date}>{item.date}</div>
                    {((item.type.toUpperCase() !== "SEND") &&
                      (item.type.toUpperCase() !== "BROADCASTED")
                     ) && (
                      <div className={styles.activity_btn}>
                        <Btn
                          title="CANCEL"
                          color="#D5D5D5"
                          fontSize="12px"
                          right="/icons/icon_arrow_small.svg"
                          rightOpt="8px"
                          height="22px"
                          onClick={() => onActivityCancel(index)}
                        />
                      </div>
                    )}
                    {item.type.toUpperCase() !== "BROADCASTED" && (
                      <div className={styles.activity_btn}>
                        <Btn
                          title={
                            item.type.toUpperCase() === "APPROVED"
                              ? "SEND TX"
                              : item.type.toUpperCase() === ("PENDING" ||"REJECTED")
                              ? "RESEND"
                              : item.type.toUpperCase() === "SEND"
                              ? "TX DATA"
                              : ""
                          }
                          color={
                            item.type.toUpperCase() === "APPROVED"
                              ? "#FC3547"
                              : item.type.toUpperCase() === ("PENDING" ||"REJECTED")
                              ? "#0096F4"
                              : "#A3A3A3"
                          }
                          fontSize="12px"
                          right="/icons/icon_arrow_small.svg"
                          rightOpt="8px"
                          height="22px"
                          onClick={() => onActivityClick(index)}
                        />
                      </div>
                    )}
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Activity;

/*
BCY ETH TEST ADDRESS
CFqoZmZ3ePwK5wnkhxJjJAQKJ82C7RJdmd
*/
