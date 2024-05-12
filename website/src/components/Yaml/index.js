import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import { motion } from 'framer-motion';
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
  const variantFadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  const variantShrink = {
    hidden: { opacity: 0, scale: 1.25 },
    visible: { opacity: 1, scale: 1 }
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

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1  // Delay between each child's animation
      }
    },
  };

  const items = [
    "🔒 AES 256-bit encryption",
    "🕸 Multi-cluster configurations",
    "🌐 Deploy VPCs in N. America, Europe, Asia Pac., S. America",
  ];

  return (
    <div className="container">
      <div className={styles.yamlContainer}>
        <motion.div
          className={styles.imageContainer}
          initial="hidden"
          whileInView="visible"
          variants={isMobile ? variantsScaleIn : variantsLeft}
          transition={isMobile ? { duration: 0.25 } : { duration: 0.5 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <img src="/img/yaml.png" alt="YAML Code" />
        </motion.div>
        <motion.div
          className={styles.textContainer}
          initial="hidden"
          whileInView="visible"
          variants={isMobile ? variantsBottom : variantsRight}
          transition={isMobile ? { duration: 0.25 } : { duration: 0.5 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <h1 style={{ marginBottom: 0 }}>Industry Best Practices</h1>
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={variantShrink}
            transition={isMobile ? { delay: 0.5, duration: 0.5 } : { delay: 0.5, duration: 0.5 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <h2 style={{ color: '#999' }}>Built by engineers for engineers.</h2>
          </motion.div>
          <p>Never manually configure a YAML file again. Behind the scenes, Deckhand abstracts away the complexity of scaling and load balancing microservices for millions of users, so you can focus on what you do best <span>&#8212;</span> creating your app.</p>
          <motion.ul variants={listVariants}>
            {items.map((item, index) => (
              <motion.li key={index} variants={variantsBottom}>
                {item}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </div>
  );
}
