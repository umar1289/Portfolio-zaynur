/**
 * Site-wide constants.
 */
export const siteConfig = {
  orgName: "«Zaynur Diyor Fayz» ishlab chiqarish kooperativi",
  shortName: "Zaynur Diyor Fayz",

  telegramUsername: "toychibaevz",
  get telegramUrl() {
    return this.telegramUsername ? `https://t.me/${this.telegramUsername}` : "https://t.me/";
  },

  phone: "+998911055306",
  phoneDisplay: "+998 91 105 53 06",

  address: {
    region: "Farg'ona viloyati, Farg'ona tumani,",
    city: "Vodil shaharchasi",
  },

  workHours: "Dushanba–Shanba · 08:00–18:00",
};
