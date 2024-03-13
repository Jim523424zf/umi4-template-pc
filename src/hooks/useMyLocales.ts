import { commonErrorHandler } from "@/utils/error";
import { lang } from "@/utils/lang";
import { useIntl } from "@umijs/max";
import { useEffect, useState } from "react";

export const useMyLocales = (): MyLocales => {
  const intl = useIntl();
  const [curLang, setCurLang] = useState(lang.getLocale());
  useEffect(() => setCurLang(lang.getLocale()), [intl.locale]);

  function formatMessageById(id: string) {
    if (!id) {
      return "";
    }
    return intl.formatMessage({ id });
  }

  const { errorNotify } = commonErrorHandler(formatMessageById);

  return {
    curLang,
    formatMessageById,
    errorNotify,
  };
};
