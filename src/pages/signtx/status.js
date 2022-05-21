import { useState } from "react";
import { CheckIcon, CycleIcon, LoadingGif, PlusIcon } from "../../context/svgs";
import styles from "./status.module.css";

const WAITING = 1;
const RUNNING = 2;
const CHECKED = 3;

const Status = () => {
  const [steps, setSteps] = useState([
    {
      title: "Signing Complete",
      status: CHECKED,
    },
    {
      title: "Tx is approved",
      status: CHECKED,
    },
    {
      title: "Broadcast Tx",
      status: RUNNING,
    },
    {
      title: "Tx gets confirmed",
      status: WAITING,
    },
  ]);

  const onClick = () => {};

  return (
    <div className={styles.wrapper} onClick={onClick}>
      {steps.map((step) => (
        <div className={styles.step_wrapper} key={step.title}>
          <div className={styles.status_symbol}>
            {step.status === CHECKED ? (
              <CheckIcon />
            ) : step.status === RUNNING ? (
              // <CycleIcon />
              <LoadingGif />
            ) : (
              <PlusIcon />
              
            )}
          </div>
          <div className={styles.step_title}>{step.title}</div>
        </div>
      ))}
    </div>
  );
};

export default Status;
