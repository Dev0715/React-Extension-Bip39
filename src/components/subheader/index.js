import { goBack, goTo } from "react-chrome-extension-router";
import Home from "../../pages/home";
import styles from "./index.module.css";

const SubHeader = ({ title }) => {
  const onBack =
    title === "ACTIVITY"
      ? () => {
          goTo(Home);
        }
      : () => {
          goBack();
        };

  return (
    <div className={styles.container}>
      <div className={styles.icon_wrapper} onClick={onBack}>
        <img
          src="/icons/icon_gray_arrow.svg"
          alt=""
        />
      </div>
      <div className={styles.title}>{title}</div>
    </div>
  );
};

export default SubHeader;
