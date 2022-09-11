import styles from "styles/scss/stars.module.scss";
export const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="star-rating">
      {[...Array(5)].map((star, index) => {
        index += 1;
        return (
          <button
            type="button"
            key={index}
            style={{ cursor: "unset" }}
            className={index <= rating ? styles.on : styles.off}
          >
            <span className={styles.star}>&#9733;</span>
          </button>
        );
      })}
      <span className={styles.text}> {rating} </span>
    </div>
  );
};
