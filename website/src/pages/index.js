import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import preview from "@site/static/img/preview2.png";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import Yaml from "@site/src/components/Yaml";
import ScrollingLogos from "@site/src/components/ScrollingLogos";
import Features from "@site/src/components/Features";
import FooterTransition from "@site/src/components/FooterTransition";
import { motion, MotionConfig } from "framer-motion";
import { useState, useEffect } from 'react';
import styles from "./index.module.css";

function HomepageHeader() {
  const [isMobile, setIsMobile] = useState(() => {
    if (ExecutionEnvironment.canUseDOM) {
      return window.innerWidth <= 768;
    }
    return false; // Default to false in SSR
  });

  useEffect(() => {
    if (ExecutionEnvironment.canUseDOM) {
      const checkIfMobile = () => window.innerWidth <= 768;
      setIsMobile(checkIfMobile());

      const handleResize = () => {
        setIsMobile(checkIfMobile());
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <div className={styles.headerAndWaves}>
      <div className={styles.header}>
        <motion.div
          className={styles.leftHeader}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 4, delay: 0.25 }}
        >
          <motion.div
            className={styles.fullLogo}
            initial={{ scale: 1.25 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <motion.div
              animate={{
                rotate: [0, 15, -15, 0],
              }}
              transition={{
                duration: 5,
                ease: "easeInOut",
                times: [0, .3, .6, 1],
                repeat: Infinity,
                repeatDelay: 2
              }}>
              <svg
                className={styles.logoIcon}
                x="0px"
                y="0px"
                viewBox="0 0 500 500"
              >
                <circle cx="250" cy="250" r="160" fill="none" stroke="white" strokeWidth="32" />
                <circle cx="250" cy="250" r="48" fill="white" />
                <line x1="250" y1="40" x2="250" y2="460" stroke="white" strokeWidth="32" />
                <line x1="40" y1="250" x2="460" y2="250" stroke="white" strokeWidth="16" />
                <line x1="65.36" y1="65.36" x2="434.64" y2="434.64" stroke="white" strokeWidth="16" />
                <line x1="434.64" y1="65.36" x2="65.36" y2="434.64" stroke="white" strokeWidth="16" />
              </svg>
            </motion.div>
            <div className={styles.logoText}>Deckhand</div>
          </motion.div>
          <div className={styles.tagline}>
            <p>No-code, drag and drop Kubernetes.<br />Quickly scale any app to <b>millions of users</b>.</p>
          </div>
          <motion.div
            initial={isMobile ? { y: -5 } : { y: 10 }}
            animate={{ y: 0 }}
            transition={{ duration: 1 }}
            style={{
              display: 'flex',
              gap: 10,
            }}
          >
            <Link
              className="button button--primary button--lg"
              to="http://app.deckhand.dev"
              style={{
                border: 0,
                borderRadius: 30,
                backgroundColor: "var(--main-btn-bg)",
                color: "var(--main-btn-text)",
              }}
            >
              Get Started ➤
            </Link>
            <Link
              className="button button--secondary button--lg"
              to="/docs/intro"
              style={{
                border: 0,
                borderRadius: 30,
                backgroundColor: "var(--secondary-btn-bg)",
                color: "var(--secondary-btn-text)",
              }}
            >
              📚 Docs
            </Link>
          </motion.div>
        </motion.div>
        <motion.div
          className={styles.rightHeader}
          initial={isMobile ? { opacity: 0, y: -10 } : { opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1, delay: 0.25 }}
        >
          <img src={preview} alt="Deckhand canvas preview" />
        </motion.div>
      </div>
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
    </div >
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <MotionConfig reducedMotion='user'>
      <Layout
        // title={`${siteConfig.title}`}
        description="Deckhand is a drag and drop Kubernetes tool for deploying production-grade software with no code. Scale any application to millions of users in minutes."
      >
        <main>
          <HomepageHeader />
          <HomepageFeatures />
          <Yaml />
          <ScrollingLogos />
          <Features />
          <FooterTransition />
        </main>
      </Layout>
    </MotionConfig>
  );
}
