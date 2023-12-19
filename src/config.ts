import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://riankurnia.pages.dev/", // replace this with your deployed domain
  author: "Rian Kurnia",
  desc: "My personal and minimal blog.",
  title: "Rian Kurnia",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerPage: 5,
};

export const LOCALE = ["en-EN"]; // set to [] to use the environment default

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/riankurniaxyz",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:riankurnia713@gmail.com",
    linkTitle: `Send an email to ${SITE.title}`,
    active: true,
  },
  {
    name: "Facebook",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Facebook`,
    active: false,
  },
  {
    name: "Instagram",
    href: "https://instagram.com/rianrian.tex",
    linkTitle: `${SITE.title} on Instagram`,
    active: true,
  },
  {
    name: "LinkedIn",
    href: "https://linked.com/in/rian-kurnia",
    linkTitle: `${SITE.title} on LinkedIn`,
    active: true,
  },
  {
    name: "Twitter",
    href: "",
    linkTitle: `${SITE.title} on Twitter`,
    active: false,
  },
  {
    name: "Twitch",
    href: "",
    linkTitle: `${SITE.title} on Twitch`,
    active: false,
  },
  {
    name: "YouTube",
    href: "",
    linkTitle: `${SITE.title} on YouTube`,
    active: false,
  },
  {
    name: "WhatsApp",
    href: "",
    linkTitle: `${SITE.title} on WhatsApp`,
    active: false,
  },
  {
    name: "Snapchat",
    href: "",
    linkTitle: `${SITE.title} on Snapchat`,
    active: false,
  },
  {
    name: "Pinterest",
    href: "",
    linkTitle: `${SITE.title} on Pinterest`,
    active: false,
  },
  {
    name: "TikTok",
    href: "",
    linkTitle: `${SITE.title} on TikTok`,
    active: false,
  },
  {
    name: "CodePen",
    href: "",
    linkTitle: `${SITE.title} on CodePen`,
    active: false,
  },
  {
    name: "Discord",
    href: "",
    linkTitle: `${SITE.title} on Discord`,
    active: false,
  },
  {
    name: "GitLab",
    href: "",
    linkTitle: `${SITE.title} on GitLab`,
    active: false,
  },
  {
    name: "Reddit",
    href: "",
    linkTitle: `${SITE.title} on Reddit`,
    active: false,
  },
  {
    name: "Skype",
    href: "",
    linkTitle: `${SITE.title} on Skype`,
    active: false,
  },
  {
    name: "Steam",
    href: "",
    linkTitle: `${SITE.title} on Steam`,
    active: false,
  },
  {
    name: "Telegram",
    href: "",
    linkTitle: `${SITE.title} on Telegram`,
    active: false,
  },
  {
    name: "Mastodon",
    href: "",
    linkTitle: `${SITE.title} on Mastodon`,
    active: false,
  },
];
