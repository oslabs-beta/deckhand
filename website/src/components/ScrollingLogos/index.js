import clsx from 'clsx';
import { motion } from 'framer-motion';
import styles from './styles.module.css';
import awsLogo from "@site/static/img/logos/aws.svg";
import dockerLogo from "@site/static/img/logos/docker.svg";
import githubLogo from "@site/static/img/logos/github.svg";
import grafanaLogo from "@site/static/img/logos/grafana.svg";
import hashicorpLogo from "@site/static/img/logos/hashicorp.svg";
import kafkaLogo from "@site/static/img/logos/kafka.svg";
import kubernetesLogo from "@site/static/img/logos/kubernetes.svg";
import mongodbLogo from "@site/static/img/logos/mongodb.svg";
import postgresqlLogo from "@site/static/img/logos/postgresql.svg";
import prometheusLogo from "@site/static/img/logos/prometheus.svg";
import terraformLogo from "@site/static/img/logos/terraform.svg";
import rabbitmqLogo from "@site/static/img/logos/rabbitmq.svg";
import redisLogo from "@site/static/img/logos/redis.svg";
// import nodejsLogo from "@site/static/img/logos/nodejs.svg";
// import reactLogo from "@site/static/img/logos/react.svg";
// import reduxLogo from "@site/static/img/logos/redux.svg";
// import vueLogo from "@site/static/img/logos/vue.svg";
// import angularLogo from "@site/static/img/logos/angular.svg";
// import javascriptLogo from "@site/static/img/logos/javascript.svg";
// import typescriptLogo from "@site/static/img/logos/typescript.svg";
// import pythonLogo from "@site/static/img/logos/python.svg";
// import cLogo from "@site/static/img/logos/c.svg";

export default function ScrollingLogos() {
  const logos = [
    awsLogo,
    kubernetesLogo,
    dockerLogo,
    githubLogo,
    grafanaLogo,
    terraformLogo,
    hashicorpLogo,
    prometheusLogo,
    rabbitmqLogo,
    redisLogo,
    kafkaLogo,
    postgresqlLogo,
    mongodbLogo,
    // nodejsLogo,
    // reactLogo,
    // reduxLogo,
    // vueLogo,
    // angularLogo,
    // javascriptLogo,
    // typescriptLogo,
    // pythonLogo,
    // cLogo,
  ];

  return (
    <motion.div
      className={styles.scrollContainer}
      initial="hidden"
      whileInView="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      }}
      transition={{ duration: 1 }}
      viewport={{ once: true, amount: 0.5 }}
    >
      <div className={styles.logoHeader}><h1>Highly Compatible...</h1></div>
      <div className={styles.scrollingWrapper}>
        {/* Render each logo multiple times for seamless animation */}
        {Array.from({ length: 3 }).flatMap(_ => logos).map((Component, index) => (
          <div key={index} className={styles.logo}>
            <Component alt={`Logo ${index % logos.length + 1}`} />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
