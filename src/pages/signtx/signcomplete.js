import styles from "./signcomplete.module.css";
import { goBack, goTo } from "react-chrome-extension-router";
import { useEffect } from "react";
import { useGloabalStateContext } from "../../context/provider";
import {
  chainSymbol,
  emailJsPublicKey,
  emailJsServiceId,
  emailJsTemplateId,
  txApproveApi,
  txApproverEmail,
  txRejectApi,
} from "../../context/config";

import { collection, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import emailjs from "@emailjs/browser";
import Header from "../../components/header";
import SubHeader from "../../components/subheader";
import SendHeader from "../../components/sendheader";
import Btn from "../../components/button";
import Activity from "../activity";

let useFlag = false;
let canceled = false;
let docRefId;

const SignComplete = () => {
  const { _txDataToSend, _address, _amount, _userName, _setUserName, isBTC, btcKeys, ethKeys } =
    useGloabalStateContext();

  useEffect(() => {
    useFlag = !useFlag;
    if (!useFlag) return;
    console.log("SignComplete", useFlag);

    canceled = false;
    signTx();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signTx = async () => {
    if (localStorage.getItem("name") && _userName === "") {
      _setUserName(localStorage.getItem("name"));
    };
    try {
      const from_address = isBTC ? btcKeys.address : ethKeys.address.toLowerCase();
      const docRef = await addDoc(collection(db, "transaction"), {
        address: from_address,
        broadcasted: false,
        approved: false,
        rejected: false,
        txdata: _txDataToSend,
      });
      docRefId = docRef.id;
      console.log("Document written with ID: ", docRef.id);

      const _balance = isBTC ? btcKeys.balance : ethKeys.balance;
      await emailjs.send(
        emailJsServiceId,
        emailJsTemplateId,
        {
          from_address,
          to_address: _address,
          user_name: _userName,
          amount: _amount,
          currency: chainSymbol[Number(isBTC)],
          link_approve: `${txApproveApi}?documentId=${docRef.id}`,
          url_reject: `${txRejectApi}?documentId=${docRef.id}`,
          to_mail: txApproverEmail,
          balance: _balance,
        },
        emailJsPublicKey
      );

      if(canceled) {
        await deleteDoc(doc(db, "transaction", docRef.id));
        console.log("Document with ID was deleted", docRef.id);
        goBack();
       } else {
        goTo(Activity);
       }
    } catch (err) {
      console.error(err);
      if(docRefId) {
        await deleteDoc(doc(db, "transaction", docRefId));
        console.log("Document with ID was deleted", docRefId);
      }
      goBack();
    }
  };

  const onCancel = () => {
    canceled = true;
  }

  return (
    <div className={styles.container}>
      <Header />
      <SubHeader title="SEND" />
      <SendHeader toAddress={_address} amount={_amount} step={0} error={false} />
      <div className={styles.wrapper}>
        <div className={styles.btn_wrapper}>
          <div className={styles.btn}>
            <Btn
              title="CANCEL"
              left="/icons/icon_cancel.svg"
              alt=""
              height="42px"
              color="#A1ADB4"
              fontSize="15px"
              onClick={onCancel}
            />
          </div>
          <div className={styles.btn}>
            <Btn
              title="RESEND MAIL"
              left="/icons/icon_mail.svg"
              alt=""
              height="42px"
              color="#0096F4"
              fontSize="15px"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignComplete;
