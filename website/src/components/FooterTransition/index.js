import styles from './styles.module.css';

export default function FooterTransition() {

  return (
    <svg
      className={styles.waves}
      viewBox="0 24 150 28"
      preserveAspectRatio="none"
      shapeRendering="auto"
    >
      <defs>
        <path
          id="gentle-wave"
          d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
        />
      </defs>
      <g className={styles.parallax}>
        <use xlinkHref="#gentle-wave" x="48" y="0" fill="#303846" />
      </g>
    </svg>

  );
}
