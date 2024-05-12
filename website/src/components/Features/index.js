import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import { motion } from 'framer-motion';
import styles from './styles.module.css';
import { useState, useEffect } from 'react';

export default function Features() {
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
    "Setting up VPCs, subnets, route tables, security groups, and gateways",
    "Provisioning an EKS cluster and installing all the necessary add-ons",
    "Spinning up EC2 instances as nodes in the cluster",
    "Implementing an EFS for volume storage",
    "Dockerizing Github repos and pushing to ECR",
    "Pulling down Docker Hub images",
    "Autoscanning images for environmental variables and exposed ports",
    "Generating and applying YAML files for deployments, services, configmaps, secrets, persistent volume claims, and ingresses",
    "Obtaining a public url for your app",
    "Automating the entire teardown process with a single click"
  ];

  return (
    <div className="container">
      <div className={styles.featuresContainer}>
        <motion.div
          className={styles.imageContainer}
          initial="hidden"
          whileInView="visible"
          variants={isMobile ? variantsScaleIn : variantsRight}
          transition={isMobile ? { duration: 0.25 } : { duration: 0.5 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <img src="/img/kubernetesart.jpg" alt="YAML Code" />
        </motion.div>
        <motion.div
          className={styles.textContainer}
          initial="hidden"
          whileInView="visible"
          variants={isMobile ? variantsBottom : variantsLeft}
          transition={isMobile ? { duration: 0.25 } : { duration: 0.5 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <h1>Automated Features</h1>
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
