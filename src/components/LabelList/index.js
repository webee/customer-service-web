import styles from "./index.less";

export default ({ items, style, itemStyle, labelStyle, valueStyle }) => (
  <div className={styles.main} style={style}>
    {items.map(
      (item, i) =>
        item ? (
          <div key={i} className={styles.item} style={itemStyle}>
            <div className={styles.label} style={labelStyle}>
              {item.label}
            </div>
            <div className={styles.value} style={valueStyle}>
              {item.value}
            </div>
          </div>
        ) : (
          undefined
        )
    )}
  </div>
);
