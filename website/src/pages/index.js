import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import preview from "@site/static/img/preview2.png";

import Heading from "@theme/Heading";
import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <div className="container">
      <div className={`${styles.innerHeader} ${styles.flex}`}>
        <div className={`${styles.logoAndTagline} ${styles.fadeIn}`}>
          <div className={styles.flex}>
            <svg
              className={styles.logoSVG}
              x="0px"
              y="0px"
              viewBox="0 0 500 500"
            >
              <circle
                cx="250"
                cy="250"
                r="200"
                fill="none"
                stroke="#fff"
                strokeWidth="40"
              />

              <circle
                cx="250"
                cy="250"
                r="60"
                fill="#fff"
                stroke="none"
                strokeWidth="40"
              />

              <line
                x1="250"
                y1="0"
                x2="250"
                y2="500"
                stroke="#fff"
                strokeWidth="40"
              />
              <line
                x1="0"
                y1="250"
                x2="500"
                y2="250"
                stroke="#fff"
                strokeWidth="20"
              />
              <line
                x1="35.36"
                y1="35.36"
                x2="464.64"
                y2="464.64"
                stroke="#fff"
                strokeWidth="20"
              />
              <line
                x1="464.64"
                y1="35.36"
                x2="35.36"
                y2="464.64"
                stroke="#fff"
                strokeWidth="20"
              />
            </svg>
            <div className={styles.logoText}>Deckhand</div>
          </div>
          <div className={styles.tagline}>
            No-code, drag and drop Kubernetes deployment.
          </div>
          <br />
          <div>
            <Link
              className="button button--primary button--lg"
              to="http://app.deckhand.dev"
              style={{
                border: 0,
                margin: 5,
                backgroundColor: "var(--main-btn-bg)",
                color: "var(--main-btn-text)",
              }}
            >
              Launch App
            </Link>
            {/* <Link
              className="button button--secondary button--lg"
              to="https://github.com/oslabs-beta/deckhand/"
              style={{ border: 0, margin: 5, backgroundColor: 'var(--secondary-btn-bg)', color: 'var(--secondary-btn-text)' }}>
              <span style={{ color: '#999' }}>★</span> Github
            </Link> */}
            <Link
              className="button button--secondary button--lg"
              to="/docs/intro"
              style={{
                border: 0,
                margin: 5,
                backgroundColor: "var(--secondary-btn-bg)",
                color: "var(--secondary-btn-text)",
              }}
            >
              📚 Docs
            </Link>
          </div>
        </div>
        <div className={`${styles.preview} ${styles.fadeInRight}`}>
          <img src={preview} alt="Deckhand canvas preview" />
        </div>
      </div>
    </div>
  );
}

function Waves() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <div>
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
          <use xlinkHref="#gentle-wave" x="48" y="0" fill="var(--wave1)" />
          <use xlinkHref="#gentle-wave" x="48" y="3" fill="var(--wave2)" />
          <use xlinkHref="#gentle-wave" x="48" y="5" fill="var(--wave3)" />
          <use xlinkHref="#gentle-wave" x="48" y="7" fill="var(--wave4)" />
        </g>
      </svg>
    </div>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      // title={`${siteConfig.title}`}
      description="Fully automated, drag and drop Kubernetes"
    >
      <div className={styles.header}>
        <HomepageHeader />
        <Waves />
      </div>
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
