import { useState } from "react";
import { CheckIcon, CheckIconGray, LoadingGif } from "../../context/svgs";
import styles from "./status.module.css";

const WAITING = 1;
const RUNNING = 2;
const CHECKED = 3;

const Status = () => {
  // eslint-disable-next-line no-unused-vars
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
      {steps.map((step, index) => (
        <div className={styles.stepContainer} key={step.title}>
          <div className={styles.step_wrapper}>
            <div className={styles.status_symbol}>
              {step.status === CHECKED ? (
                <CheckIcon />
              ) : step.status === RUNNING ? (
                // <CycleIcon />
                <LoadingGif />
              ) : (
                <CheckIconGray />
              )}
            </div>
            <div
              className={styles.step_title}
              style={{
                color:
                  step.status === CHECKED
                    ? "#34b171"
                    : step.status === RUNNING
                    ? "black"
                    : "gray",
              }}
            >
              {step.title}
            </div>
          </div>
          {index < 3 && (
            <div
              className={styles.step_line}
              style={{
                marginBottom:
                  steps[index + 1].status === RUNNING ? "4px" : "0px",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Status;
