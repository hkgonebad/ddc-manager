export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "DDC Manager",
  description: "A Project mangement tool for DDC",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Dashboard",
      href: "/dashboard",
    },
    {
      title: "Reports",
      href: "/playground",
    },
    {
      title: "Contact",
      href: "/contact",
    },
  ],
  links: {
    twitter: "https://twitter.com/hkgonebad",
    github: "https://github.com/hkgonebad",
    login: "/auth",
    signup: "/onboarding",
  },
}
