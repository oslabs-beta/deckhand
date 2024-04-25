import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import { motion } from 'framer-motion';

const FeatureList = [
  {
    title: 'Simple to Use',
    Svg: require('@site/static/img/docker.svg').default,
    description: (
      <>
        Visual drag and drop interface lets you virtually craft your system design,
        so you can focus on what matters and automate the rest.
      </>
    ),
  },
  {
    title: 'Connect Any Software',
    Svg: require('@site/static/img/github.svg').default,
    description: (
      <>
        Instantly search for and connect any commercial or open source software,
        including your private Github repositories, and deploy it with a click.
      </>
    ),
  },
  {
    title: 'No Vendor Lock-In',
    Svg: require('@site/static/img/aws.svg').default,
    description: (
      <>
        We'll deploy directly to your linked cloud provider, so you can involve Deckhand
        as much or as little as you'd like, and take back the wheel at any time.
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div
      className={clsx('col col--4')}
    >
      <motion.div
        className="text--center"
        initial="hidden"
        whileInView="visible"
        variants={{
          hidden: { opacity: 0, scale: 0 },
          visible: { opacity: 1, scale: 1 }
        }}
        transition={{ duration: 0.25 }}
        viewport={{ once: true, amount: 0.5 }}>
        <Svg className={styles.featureSvg} role="img" />
      </motion.div>
      <motion.div
        className="text--center padding-horiz--md"
        initial="hidden"
        whileInView="visible"
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 }
        }}
        transition={{ duration: 0.25 }}
        viewport={{ once: true, amount: 0.5 }}>
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </motion.div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
