// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

// @ts-expect-error TS(2307): Cannot find module 'prism-react-renderer' or its c... Remove this comment to see the full error message
import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Deckhand',
  tagline: 'Fully automated, drag and drop Kubernetes deployment',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://deckhand.dev',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'deckhand', // Usually your GitHub org/user name.
  projectName: 'deckhand', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/oslabs-beta/deckhand/website',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/oslabs-beta/deckhand/website',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        gtag: {
          trackingID: 'G-JZZL2J5SK3',
          anonymizeIP: true,
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/deckhand-social-card.png',
      navbar: {
        title: 'Deckhand',
        logo: {
          alt: 'Deckhand Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'dropdown', // 'docSidebar'
            sidebarId: 'mySidebar',
            label: 'Docs',
            position: 'left',
            items: [
              {
                type: 'doc',
                label: 'Introduction',
                docId: 'intro',
              },
              {
                type: 'doc',
                label: 'Getting Started',
                docId: 'getting-started',
              },
              {
                type: 'doc',
                label: 'Integrations',
                docId: '/category/integrations',
              },
              {
                type: 'doc',
                label: 'Elements',
                docId: '/category/elements',
              },
              {
                type: 'doc',
                label: 'Troubleshooting',
                docId: '/category/troubleshooting',
              },
            ],
          },
          { to: '/blog', label: 'Blog', position: 'left' },
          {
            href: 'https://github.com/oslabs-beta/deckhand/',
            label: 'GitHub',
            position: 'left',
          },
          {
            href: 'https://app.deckhand.dev',
            label: 'Log In',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Product',
            items: [
              {
                label: 'Documentation',
                to: '/docs/intro',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/oslabs-beta/deckhand/',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Contribute',
                to: '/contributing',
              },
            ],
          },
          {
            title: 'Company',
            items: [
              {
                label: 'About',
                href: '/about',
              },
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'LinkedIn',
                href: 'https://www.linkedin.com/company/deckhand-open-source',
              },
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} Deckhand | MIT License | Open Source`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
