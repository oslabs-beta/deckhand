import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import styles from './styles.module.css';
import { useState, useEffect } from 'react';

export default function Yaml() {
  const variantsScaleIn = {
    hidden: { opacity: 0, scale: 0 },
    visible: { opacity: 1, scale: 1 }
  };
  const variantsLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 }
  };
  const variantsRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 }
  };
  const variantsTop = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 }
  };
  const variantsBottom = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

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
    <div className="container">
      <div className={styles.yamlContainer}>
        <motion.div
          className={clsx(styles.imageContainer)}
          initial="hidden"
          whileInView="visible"
          variants={isMobile ? variantsScaleIn : variantsLeft}
          transition={isMobile ? { duration: 0.25 } : { duration: 0.5 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <img src="/img/preview-yaml.png" alt="YAML Code" />
        </motion.div>
        <motion.div
          className={clsx(styles.textContainer)}
          initial="hidden"
          whileInView="visible"
          variants={isMobile ? variantsBottom : variantsRight}
          transition={isMobile ? { duration: 0.25 } : { duration: 0.5 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <h1>Industry Best Practices</h1>
          <p>Never manually configure a YAML file again. Behind the scenes, Deckhand abstracts away the complexity of scaling microservices to millions of users, so you can focus on the important part <span>&#8212;</span> creating your app.</p>
          <h4>🔒 AES 256-bit encrypted</h4>
        </motion.div>
      </div>
    </div>
  );
}
