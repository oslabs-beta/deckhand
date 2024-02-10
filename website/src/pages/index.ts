import clsx from 'clsx';
// @ts-expect-error TS(2307): Cannot find module '@docusaurus/Link' or its corre... Remove this comment to see the full error message
import Link from '@docusaurus/Link';
// @ts-expect-error TS(2307): Cannot find module '@docusaurus/useDocusaurusConte... Remove this comment to see the full error message
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
// @ts-expect-error TS(2307): Cannot find module '@theme/Layout' or its correspo... Remove this comment to see the full error message
import Layout from '@theme/Layout';
// @ts-expect-error TS(2307): Cannot find module '@site/src/components/HomepageF... Remove this comment to see the full error message
import HomepageFeatures from '@site/src/components/HomepageFeatures';
// @ts-expect-error TS(2307): Cannot find module '@site/static/img/preview2.png'... Remove this comment to see the full error message
import preview from '@site/static/img/preview2.png';

// @ts-expect-error TS(2307): Cannot find module '@theme/Heading' or its corresp... Remove this comment to see the full error message
import Heading from '@theme/Heading';
// @ts-expect-error TS(2307): Cannot find module './index.module.css' or its cor... Remove this comment to see the full error message
import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    // @ts-expect-error TS(2304): Cannot find name 'div'.
    <div className="container">
      // @ts-expect-error TS(2304): Cannot find name 'div'.
      <div className={`${styles.innerHeader} ${styles.flex}`}>
        // @ts-expect-error TS(2304): Cannot find name 'div'.
        <div className={`${styles.logoAndTagline} ${styles.fadeIn}`}>
          // @ts-expect-error TS(2304): Cannot find name 'div'.
          <div className={styles.flex}>
            // @ts-expect-error TS(2304): Cannot find name 'svg'.
            <svg
              // @ts-expect-error TS(2304): Cannot find name 'className'.
              className={styles.logoSVG}
              // @ts-expect-error TS(2304): Cannot find name 'x'.
              x="0px"
              // @ts-expect-error TS(2304): Cannot find name 'y'.
              y="0px"
              // @ts-expect-error TS(2304): Cannot find name 'viewBox'.
              viewBox="0 0 500 500"
            >
              // @ts-expect-error TS(2304): Cannot find name 'circle'.
              <circle
                // @ts-expect-error TS(2304): Cannot find name 'cx'.
                cx="250"
                // @ts-expect-error TS(2304): Cannot find name 'cy'.
                cy="250"
                // @ts-expect-error TS(2304): Cannot find name 'r'.
                r="200"
                // @ts-expect-error TS(2304): Cannot find name 'fill'.
                fill="none"
                // @ts-expect-error TS(2304): Cannot find name 'stroke'.
                stroke="#fff"
                // @ts-expect-error TS(2304): Cannot find name 'strokeWidth'.
                strokeWidth="40"
              />

              // @ts-expect-error TS(2304): Cannot find name 'circle'.
              <circle
                // @ts-expect-error TS(2304): Cannot find name 'cx'.
                cx="250"
                // @ts-expect-error TS(2304): Cannot find name 'cy'.
                cy="250"
                // @ts-expect-error TS(2304): Cannot find name 'r'.
                r="60"
                // @ts-expect-error TS(2304): Cannot find name 'fill'.
                fill="#fff"
                // @ts-expect-error TS(2304): Cannot find name 'stroke'.
                stroke="none"
                // @ts-expect-error TS(2304): Cannot find name 'strokeWidth'.
                strokeWidth="40"
              />

              // @ts-expect-error TS(2304): Cannot find name 'line'.
              <line
                // @ts-expect-error TS(2304): Cannot find name 'x1'.
                x1="250"
                // @ts-expect-error TS(2304): Cannot find name 'y1'.
                y1="0"
                // @ts-expect-error TS(2304): Cannot find name 'x2'.
                x2="250"
                // @ts-expect-error TS(2304): Cannot find name 'y2'.
                y2="500"
                // @ts-expect-error TS(2304): Cannot find name 'stroke'.
                stroke="#fff"
                // @ts-expect-error TS(2304): Cannot find name 'strokeWidth'.
                strokeWidth="40"
              />
              // @ts-expect-error TS(2304): Cannot find name 'line'.
              <line
                // @ts-expect-error TS(2304): Cannot find name 'x1'.
                x1="0"
                // @ts-expect-error TS(2304): Cannot find name 'y1'.
                y1="250"
                // @ts-expect-error TS(2304): Cannot find name 'x2'.
                x2="500"
                // @ts-expect-error TS(2304): Cannot find name 'y2'.
                y2="250"
                // @ts-expect-error TS(2304): Cannot find name 'stroke'.
                stroke="#fff"
                // @ts-expect-error TS(2304): Cannot find name 'strokeWidth'.
                strokeWidth="20"
              />
              // @ts-expect-error TS(2304): Cannot find name 'line'.
              <line
                // @ts-expect-error TS(2304): Cannot find name 'x1'.
                x1="35.36"
                // @ts-expect-error TS(2304): Cannot find name 'y1'.
                y1="35.36"
                // @ts-expect-error TS(2304): Cannot find name 'x2'.
                x2="464.64"
                // @ts-expect-error TS(2304): Cannot find name 'y2'.
                y2="464.64"
                // @ts-expect-error TS(2304): Cannot find name 'stroke'.
                stroke="#fff"
                // @ts-expect-error TS(2304): Cannot find name 'strokeWidth'.
                strokeWidth="20"
              />
              // @ts-expect-error TS(2304): Cannot find name 'line'.
              <line
                // @ts-expect-error TS(2304): Cannot find name 'x1'.
                x1="464.64"
                // @ts-expect-error TS(2304): Cannot find name 'y1'.
                y1="35.36"
                // @ts-expect-error TS(2304): Cannot find name 'x2'.
                x2="35.36"
                // @ts-expect-error TS(2304): Cannot find name 'y2'.
                y2="464.64"
                // @ts-expect-error TS(2304): Cannot find name 'stroke'.
                stroke="#fff"
                // @ts-expect-error TS(2304): Cannot find name 'strokeWidth'.
                strokeWidth="20"
              />
            </svg>
            // @ts-expect-error TS(2304): Cannot find name 'div'.
            <div className={styles.logoText}>Deckhand</div>
          </div>
          // @ts-expect-error TS(2304): Cannot find name 'div'.
          <div className={styles.tagline}>
            // @ts-expect-error TS(2304): Cannot find name 'No'.
            No-code, drag and drop Kubernetes deployment.
          </div>
          // @ts-expect-error TS(2304): Cannot find name 'br'.
          <br />
          // @ts-expect-error TS(2304): Cannot find name 'div'.
          <div>
            <Link
              // @ts-expect-error TS(2304): Cannot find name 'className'.
              className="button button--primary button--lg"
              // @ts-expect-error TS(2304): Cannot find name 'to'.
              to="http://app.deckhand.dev"
              // @ts-expect-error TS(2304): Cannot find name 'style'.
              style={{ border: 0, margin: 5, backgroundColor: 'var(--main-btn-bg)', color: 'var(--main-btn-text)' }}>
              // @ts-expect-error TS(2304): Cannot find name 'Launch'.
              Launch App
            </Link>
            {/* <Link
              className="button button--secondary button--lg"
              to="https://github.com/oslabs-beta/deckhand/"
              style={{ border: 0, margin: 5, backgroundColor: 'var(--secondary-btn-bg)', color: 'var(--secondary-btn-text)' }}>
              <span style={{ color: '#999' }}>★</span> Github
            </Link> */}
            <Link
              // @ts-expect-error TS(2304): Cannot find name 'className'.
              className="button button--secondary button--lg"
              // @ts-expect-error TS(2304): Cannot find name 'to'.
              to="/docs/intro"
              // @ts-expect-error TS(2304): Cannot find name 'style'.
              style={{ border: 0, margin: 5, backgroundColor: 'var(--secondary-btn-bg)', color: 'var(--secondary-btn-text)' }}>
              // @ts-expect-error TS(2304): Cannot find name 'Docs'.
              📚 Docs
            </Link>
          </div>
        </div>
        // @ts-expect-error TS(2304): Cannot find name 'div'.
        <div className={`${styles.preview} ${styles.fadeInRight}`}><img src={preview} /></div>
      </div>
    </div>
  );
}

function Waves() {
  const { siteConfig } = useDocusaurusContext();
  return (
    // @ts-expect-error TS(2304): Cannot find name 'div'.
    <div>
      // @ts-expect-error TS(2304): Cannot find name 'svg'.
      <svg
        // @ts-expect-error TS(2304): Cannot find name 'className'.
        className={styles.waves}
        // @ts-expect-error TS(2304): Cannot find name 'viewBox'.
        viewBox="0 24 150 28"
        // @ts-expect-error TS(2304): Cannot find name 'preserveAspectRatio'.
        preserveAspectRatio="none"
        // @ts-expect-error TS(2304): Cannot find name 'shapeRendering'.
        shapeRendering="auto"
      >
        // @ts-expect-error TS(2304): Cannot find name 'defs'.
        <defs>
          // @ts-expect-error TS(2749): 'path' refers to a value, but is being used as a t... Remove this comment to see the full error message
          <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
        </defs>
        // @ts-expect-error TS(2304): Cannot find name 'g'.
        <g className={styles.parallax}>
          // @ts-expect-error TS(2304): Cannot find name 'use'.
          <use xlinkHref="#gentle-wave" x="48" y="0" fill="var(--wave1)" />
          // @ts-expect-error TS(2304): Cannot find name 'use'.
          <use xlinkHref="#gentle-wave" x="48" y="3" fill="var(--wave2)" />
          // @ts-expect-error TS(2304): Cannot find name 'use'.
          <use xlinkHref="#gentle-wave" x="48" y="5" fill="var(--wave3)" />
          // @ts-expect-error TS(2304): Cannot find name 'use'.
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
      // @ts-expect-error TS(2304): Cannot find name 'description'.
      description="Fully automated, drag and drop Kubernetes">
      // @ts-expect-error TS(2304): Cannot find name 'div'.
      <div className={styles.header}>
        // @ts-expect-error TS(2749): 'HomepageHeader' refers to a value, but is being u... Remove this comment to see the full error message
        <HomepageHeader />
        // @ts-expect-error TS(2362): The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
        <Waves />
      </div>
      // @ts-expect-error TS(2304): Cannot find name 'main'.
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
