export type ContactSocialIcon = "globe" | "instagram" | "linkedin" | "email";

export type ContactSocialLink = {
  id: string;
  label: string;
  href: string;
  handle: string;
  icon: ContactSocialIcon;
};

export type ContactCover = {
  imageSrc: string;
  imageAlt: string;
};

export type ContactProfile = {
  imageSrc: string;
  imageAlt: string;
};

export type ContactMap = {
  embedUrl: string;
  locationText: string;
  ariaLabel: string;
};

export type ContactPageData = {
  cover: ContactCover;
  profile: ContactProfile;
  websiteTitle: string;
  websiteDescription: string;
  socialLinks: ContactSocialLink[];
  map: ContactMap;
};
