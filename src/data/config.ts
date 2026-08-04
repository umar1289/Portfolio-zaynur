/**
 * Site-wide constants. Real contact details are still placeholders from the
 * original design export — update `telegramUsername` and `phone` before launch.
 */
export const siteConfig = {
  orgName: "«Zaynur Diyor Fayz» ishlab chiqarish kooperativi",
  shortName: "Zaynur Diyor Fayz",

  // TODO: real Telegram username kerak, masalan "zdf_uniform"
  telegramUsername: "",
  get telegramUrl() {
    return this.telegramUsername ? `https://t.me/${this.telegramUsername}` : "https://t.me/";
  },

  // TODO: real WhatsApp raqami kerak, xalqaro formatda (kod bilan, +siz)
  whatsappNumber: "",
  get whatsappUrl() {
    return this.whatsappNumber ? `https://wa.me/${this.whatsappNumber}` : "";
  },

  // TODO: real telefon raqami
  phone: "+998900000000",
  phoneDisplay: "+998 90 000 00 00",

  address: {
    region: "Farg'ona viloyati, Farg'ona tumani,",
    city: "Vodil shaharchasi",
  },

  workHours: "Dushanba–Shanba · 08:00–18:00",
};
