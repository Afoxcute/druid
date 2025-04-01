export interface Language {
  code: string;
  name: string;
  nativeName: string;
  direction: "ltr" | "rtl";
}

export const languages: Record<string, Language> = {
  en: {
    code: "en",
    name: "English",
    nativeName: "English",
    direction: "ltr",
  },
  ha: {
    code: "ha",
    name: "Hausa",
    nativeName: "Hausa",
    direction: "ltr",
  },
  yo: {
    code: "yo",
    name: "Yoruba",
    nativeName: "Yorùbá",
    direction: "ltr",
  },
  ig: {
    code: "ig",
    name: "Igbo",
    nativeName: "Igbo",
    direction: "ltr",
  },
};

export const defaultLanguage = languages.en;

export const translations = {
  en: {
    common: {
      send: "Send",
      receive: "Receive",
      amount: "Amount",
      recipient: "Recipient",
      country: "Country",
      phoneNumber: "Phone Number",
      continue: "Continue",
      back: "Back",
      confirm: "Confirm",
      cancel: "Cancel",
      edit: "Edit",
      save: "Save",
      loading: "Loading...",
      success: "Success",
      error: "Error",
    },
    send: {
      title: "Send Money",
      recipientName: "Recipient Name",
      enterAmount: "Enter amount",
      confirmTransfer: "Confirm Transfer",
      transferSuccess: "Transfer Successful!",
      transferDetails: "Transfer Details",
    },
    receive: {
      title: "Receive Money",
      shareAddress: "Share Address",
      copyAddress: "Copy Address",
      generateQR: "Generate QR Code",
    },
  },
  ha: {
    common: {
      send: "Aika",
      receive: "Karba",
      amount: "Adadin",
      recipient: "Mai karba",
      country: "Ƙasa",
      phoneNumber: "Lambar waya",
      continue: "Ci gaba",
      back: "Baya",
      confirm: "Tabbatar",
      cancel: "Soke",
      edit: "Gyara",
      save: "Ajiye",
      loading: "Ana ɗauka...",
      success: "Nasara",
      error: "Kuskure",
    },
    send: {
      title: "Aika Kuɗi",
      recipientName: "Sunan mai karba",
      enterAmount: "Shigar da adadin",
      confirmTransfer: "Tabbatar da canja wuri",
      transferSuccess: "Canja wurin ya yi nasara!",
      transferDetails: "Bayanan canja wuri",
    },
    receive: {
      title: "Karba Kuɗi",
      shareAddress: "Raba adireshi",
      copyAddress: "Kwafi adireshi",
      generateQR: "Samar da lambar QR",
    },
  },
  yo: {
    common: {
      send: "Firanṣẹ́",
      receive: "Gba",
      amount: "Iye",
      recipient: "Olùgbà",
      country: "Orílẹ̀-èdè",
      phoneNumber: "Nọmba fóònù",
      continue: "Tẹ̀ síwájú",
      back: "Pàdà",
      confirm: "Jẹ́rìí",
      cancel: "Fagilé",
      edit: "Ṣàtúnṣe",
      save: "Fipamọ́",
      loading: "N jẹ́...",
      success: "Àṣeyọrí",
      error: "Àṣìṣe",
    },
    send: {
      title: "Firanṣẹ́ Owó",
      recipientName: "Orúkọ Olùgbà",
      enterAmount: "Tẹ iye",
      confirmTransfer: "Jẹ́rìí Ìyípadà",
      transferSuccess: "Ìyípadà ti jẹ́ àṣeyọrí!",
      transferDetails: "Àwọn Àkọsílẹ̀ Ìyípadà",
    },
    receive: {
      title: "Gba Owó",
      shareAddress: "Pín Adírẹ́sì",
      copyAddress: "Kọ́pí Adírẹ́sì",
      generateQR: "Dídá Kódù QR",
    },
  },
  ig: {
    common: {
      send: "Ziga",
      receive: "Nata",
      amount: "Ego",
      recipient: "Onye nnata",
      country: "Mba",
      phoneNumber: "Nọmba ekwentị",
      continue: "Gaa n'ihu",
      back: "Laghachi",
      confirm: "Kwenye",
      cancel: "Kaghị",
      edit: "Dezie",
      save: "Chekwaa",
      loading: "Ana echere...",
      success: "Ihe ịga nke ọma",
      error: "Mmehie",
    },
    send: {
      title: "Ziga ego",
      recipientName: "Aha onye nnata",
      enterAmount: "Tinye ego",
      confirmTransfer: "Kwenye nnyefe",
      transferSuccess: "Nnyefe gara nke ọma!",
      transferDetails: "Nkọwa nnyefe",
    },
    receive: {
      title: "Nata ego",
      shareAddress: "Kesaa adreesị",
      copyAddress: "Detuo adreesị",
      generateQR: "Mepụta koodu QR",
    },
  },
}; 