import styles from "./index.module.css";

const Btn = ({ title, onClick }) => {
  return (
    <div className={styles.btn}>
      <div className={styles.btn_text} onClick={onClick}>
        {title}
      </div>
    </div>
  );
};

export default Btn;
