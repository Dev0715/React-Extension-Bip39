import styles from "./index.module.css";

const Btn = ({
  left,
  right,
  title,
  onClick,
  color,
  height,
  fontSize,
  rightOpt,
}) => {
  const customStyle = {};
  if (color) customStyle.background = color;
  if (height) customStyle.height = height;

  return (
    <div className={styles.container} onClick={onClick} style={customStyle}>
      <div className={styles.wrapper}>
        {left && <img src={left} alt="" />}
        <div className={styles.text} style={fontSize ? { fontSize } : {}}>
          {title}
        </div>
      </div>
      {right && (
        <img
          className={styles.right_symbol}
          src={right}
          style={rightOpt ? { right: rightOpt } : {}}
          alt=""
        />
      )}
    </div>
  );
};

export default Btn;
