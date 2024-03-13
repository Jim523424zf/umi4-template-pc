import { getLocale, setLocale } from "@umijs/max";

class Lang {
  private defaultLangUConfigMap = {
    ar_EG: {
      lang: "ar_EG",
      label: "العربية",
      icon: "🇪🇬",
      title: "لغة",
    },
    az_AZ: {
      lang: "az_AZ",
      label: "Azərbaycan dili",
      icon: "🇦🇿",
      title: "Dil",
    },
    bg_BG: {
      lang: "bg_BG",
      label: "Български език",
      icon: "🇧🇬",
      title: "език",
    },
    bn_BD: {
      lang: "bn_BD",
      label: "বাংলা",
      icon: "🇧🇩",
      title: "ভাষা",
    },
    ca_ES: {
      lang: "ca_ES",
      label: "Catalá",
      icon: "🇨🇦",
      title: "llengua",
    },
    cs_CZ: {
      lang: "cs_CZ",
      label: "Čeština",
      icon: "🇨🇿",
      title: "Jazyk",
    },
    da_DK: {
      lang: "da_DK",
      label: "Dansk",
      icon: "🇩🇰",
      title: "Sprog",
    },
    de_DE: {
      lang: "de_DE",
      label: "Deutsch",
      icon: "🇩🇪",
      title: "Sprache",
    },
    el_GR: {
      lang: "el_GR",
      label: "Ελληνικά",
      icon: "🇬🇷",
      title: "Γλώσσα",
    },
    en_GB: {
      lang: "en_GB",
      label: "English",
      icon: "🇬🇧",
      title: "Language",
    },
    en_US: {
      lang: "en_US",
      label: "English",
      icon: "🇺🇸",
      title: "Language",
    },
    es_ES: {
      lang: "es_ES",
      label: "Español",
      icon: "🇪🇸",
      title: "Idioma",
    },
    et_EE: {
      lang: "et_EE",
      label: "Eesti",
      icon: "🇪🇪",
      title: "Keel",
    },
    fa_IR: {
      lang: "fa_IR",
      label: "فارسی",
      icon: "🇮🇷",
      title: "زبان",
    },
    fi_FI: {
      lang: "fi_FI",
      label: "Suomi",
      icon: "🇫🇮",
      title: "Kieli",
    },
    fr_BE: {
      lang: "fr_BE",
      label: "Français",
      icon: "🇧🇪",
      title: "Langue",
    },
    fr_FR: {
      lang: "fr_FR",
      label: "Français",
      icon: "🇫🇷",
      title: "Langue",
    },
    ga_IE: {
      lang: "ga_IE",
      label: "Gaeilge",
      icon: "🇮🇪",
      title: "Teanga",
    },
    he_IL: {
      lang: "he_IL",
      label: "עברית",
      icon: "🇮🇱",
      title: "שפה",
    },
    hi_IN: {
      lang: "hi_IN",
      label: "हिन्दी, हिंदी",
      icon: "🇮🇳",
      title: "भाषा: हिन्दी",
    },
    hr_HR: {
      lang: "hr_HR",
      label: "Hrvatski jezik",
      icon: "🇭🇷",
      title: "Jezik",
    },
    hu_HU: {
      lang: "hu_HU",
      label: "Magyar",
      icon: "🇭🇺",
      title: "Nyelv",
    },
    hy_AM: {
      lang: "hu_HU",
      label: "Հայերեն",
      icon: "🇦🇲",
      title: "Լեզու",
    },
    id_ID: {
      lang: "id_ID",
      label: "Bahasa Indonesia",
      icon: "🇮🇩",
      title: "Bahasa",
    },
    it_IT: {
      lang: "it_IT",
      label: "Italiano",
      icon: "🇮🇹",
      title: "Linguaggio",
    },
    is_IS: {
      lang: "is_IS",
      label: "Íslenska",
      icon: "🇮🇸",
      title: "Tungumál",
    },
    ja_JP: {
      lang: "ja_JP",
      label: "日本語",
      icon: "🇯🇵",
      title: "言語",
    },
    ku_IQ: {
      lang: "ku_IQ",
      label: "کوردی",
      icon: "🇮🇶",
      title: "Ziman",
    },
    kn_IN: {
      lang: "kn_IN",
      label: "ಕನ್ನಡ",
      icon: "🇮🇳",
      title: "ಭಾಷೆ",
    },
    ko_KR: {
      lang: "ko_KR",
      label: "한국어",
      icon: "🇰🇷",
      title: "언어",
    },
    lv_LV: {
      lang: "lv_LV",
      label: "Latviešu valoda",
      icon: "🇱🇮",
      title: "Kalba",
    },
    mk_MK: {
      lang: "mk_MK",
      label: "македонски јазик",
      icon: "🇲🇰",
      title: "Јазик",
    },
    mn_MN: {
      lang: "mn_MN",
      label: "Монгол хэл",
      icon: "🇲🇳",
      title: "Хэл",
    },
    ms_MY: {
      lang: "ms_MY",
      label: "بهاس ملايو‎",
      icon: "🇲🇾",
      title: "Bahasa",
    },
    nb_NO: {
      lang: "nb_NO",
      label: "Norsk",
      icon: "🇳🇴",
      title: "Språk",
    },
    ne_NP: {
      lang: "ne_NP",
      label: "नेपाली",
      icon: "🇳🇵",
      title: "भाषा",
    },
    nl_BE: {
      lang: "nl_BE",
      label: "Vlaams",
      icon: "🇧🇪",
      title: "Taal",
    },
    nl_NL: {
      lang: "nl_NL",
      label: "Vlaams",
      icon: "🇳🇱",
      title: "Taal",
    },
    pl_PL: {
      lang: "pl_PL",
      label: "Polski",
      icon: "🇵🇱",
      title: "Język",
    },
    pt_BR: {
      lang: "pt_BR",
      label: "Português",
      icon: "🇧🇷",
      title: "Idiomas",
    },
    pt_PT: {
      lang: "pt_PT",
      label: "Português",
      icon: "🇵🇹",
      title: "Idiomas",
    },
    ro_RO: {
      lang: "ro_RO",
      label: "Română",
      icon: "🇷🇴",
      title: "Limba",
    },
    ru_RU: {
      lang: "ru_RU",
      label: "Русский",
      icon: "🇷🇺",
      title: "язык",
    },
    sk_SK: {
      lang: "sk_SK",
      label: "Slovenčina",
      icon: "🇸🇰",
      title: "Jazyk",
    },
    sr_RS: {
      lang: "sr_RS",
      label: "српски језик",
      icon: "🇸🇷",
      title: "Језик",
    },
    sl_SI: {
      lang: "sl_SI",
      label: "Slovenščina",
      icon: "🇸🇱",
      title: "Jezik",
    },
    sv_SE: {
      lang: "sv_SE",
      label: "Svenska",
      icon: "🇸🇪",
      title: "Språk",
    },
    ta_IN: {
      lang: "ta_IN",
      label: "தமிழ்",
      icon: "🇮🇳",
      title: "மொழி",
    },
    th_TH: {
      lang: "th_TH",
      label: "ไทย",
      icon: "🇹🇭",
      title: "ภาษา",
    },
    tr_TR: {
      lang: "tr_TR",
      label: "Türkçe",
      icon: "🇹🇷",
      title: "Dil",
    },
    uk_UA: {
      lang: "uk_UA",
      label: "Українська",
      icon: "🇺🇰",
      title: "Мова",
    },
    vi_VN: {
      lang: "vi_VN",
      label: "Tiếng Việt",
      icon: "🇻🇳",
      title: "Ngôn ngữ",
    },
    zh_CN: {
      lang: "zh_CN",
      label: "简体中文",
      icon: "🇨🇳",
      title: "语言",
    },
    zh_TW: {
      lang: "zh_TW",
      label: "繁體中文",
      icon: "🇭🇰",
      title: "語言",
    },
  };
  getLangUConfigMap() {
    return this.defaultLangUConfigMap;
  }
  setLocale(lang: string, realReload = false) {
    return setLocale?.(lang, realReload);
  }
  /**
   * 系统默认语言跟语言包不一致的时候 修复一下
   */
  fixLocale() {
    if (location.href.indexOf("lang=en_US") > -1) {
      this.setLocale("en_US", true);
      return;
    }
    if (location.href.indexOf("lang=zh_CN") > -1) {
      this.setLocale("zh_CN", true);
      return;
    }
    if (location.href.indexOf("lang=zh_TW") > -1) {
      this.setLocale("zh_TW", true);
      return;
    }
    const lang = getLocale?.();
    switch (lang) {
      case "en":
        this.setLocale("en_US", true);
        break;
      case "zh-CN":
        this.setLocale("zh_CN", true);
        break;
      case "zh-TW":
        this.setLocale("zh_TW", true);
        break;
      case "zh-HK":
        this.setLocale("zh_TW", true);
        break;
      // case "ja":
      //   this.setLocale("ja_JP", true);
      //   break;
      // case "ko":
      //   this.setLocale("ko_KR", true);
      //   break;
      // case "th":
      //   this.setLocale("th_TH", true);
      // break;
      default:
        if (!["zh_CN", "zh_TW", "en_US"].includes(lang)) {
          this.setLocale?.("en_US");
        }
        break;
    }
  }
  getLocale() {
    const lang = getLocale?.();
    if (!["zh_CN", "zh_TW", "en_US"].includes(lang)) {
      return "en_US";
    }
    return lang;
  }
}

export const lang = new Lang();
