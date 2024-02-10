import clsx from 'clsx';
// @ts-expect-error TS(2307) FIXME: Cannot find module '@theme/Heading' or its corresp... Remove this comment to see the full error message
import Heading from '@theme/Heading';
// @ts-expect-error TS(2307) FIXME: Cannot find module './styles.module.css' or its co... Remove this comment to see the full error message
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Simple to Use',
    Svg: require('@site/static/img/docker.svg').default,
    description: (
      <>
        // @ts-expect-error TS(2304) FIXME: Cannot find name 'Visual'.
        Visual drag and drop interface lets you virtually craft your system design,
        // @ts-expect-error TS(18004) FIXME: No value exists in scope for the shorthand propert... Remove this comment to see the full error message
        so you can focus on what matters and automate the rest.
      </>
    ),
  },
  {
    // @ts-expect-error TS(2695) FIXME: Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    title: 'Connect Any Software',
    // @ts-expect-error TS(2304) FIXME: Cannot find name 'Svg'.
    Svg: require('@site/static/img/github.svg').default,
    // @ts-expect-error TS(2304) FIXME: Cannot find name 'description'.
    description: (
      <>
        // @ts-expect-error TS(2304) FIXME: Cannot find name 'Instantly'.
        Instantly search for and connect any commercial or open source software,
        // @ts-expect-error TS(1101) FIXME: 'with' statements are not allowed in strict mode.
        including your private Github repositories, and deploy it with a click.
      </>
    ),
  },
  {
    // @ts-expect-error TS(2695) FIXME: Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    title: 'No Vendor Lock-In',
    // @ts-expect-error TS(2304) FIXME: Cannot find name 'Svg'.
    Svg: require('@site/static/img/aws.svg').default,
    // @ts-expect-error TS(2304) FIXME: Cannot find name 'description'.
    description: (
      <>
        // @ts-expect-error TS(2304) FIXME: Cannot find name 'We'.
        We'll deploy directly to your linked cloud provider, so you can involve Deckhand
        // @ts-expect-error TS(2304) FIXME: Cannot find name 'as'.
        as much or as little as you'd like, and take back the wheel at any time.
      </>
    ),
  },
];

function Feature({
  Svg,
  title,
  description
}: any) {
  return (
    // @ts-expect-error TS(2304) FIXME: Cannot find name 'div'.
    <div className={clsx('col col--4')}>
      // @ts-expect-error TS(2304) FIXME: Cannot find name 'div'.
      <div className="text--center">
        // @ts-expect-error TS(2749) FIXME: 'Svg' refers to a value, but is being used as a ty... Remove this comment to see the full error message
        <Svg className={styles.featureSvg} role="img" />
      </div>
      // @ts-expect-error TS(2304) FIXME: Cannot find name 'div'.
      <div className="text--center padding-horiz--md">
        // @ts-expect-error TS(2304) FIXME: Cannot find name 'as'.
        <Heading as="h3">{title}</Heading>
        // @ts-expect-error TS(2304) FIXME: Cannot find name 'p'.
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    // @ts-expect-error TS(2304) FIXME: Cannot find name 'section'.
    <section className={styles.features}>
      // @ts-expect-error TS(2304) FIXME: Cannot find name 'div'.
      <div className="container">
        // @ts-expect-error TS(2304) FIXME: Cannot find name 'div'.
        <div className="row">
          {FeatureList.map((props: any, idx: any) => (
            // @ts-expect-error TS(2749) FIXME: 'Feature' refers to a value, but is being used as ... Remove this comment to see the full error message
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
