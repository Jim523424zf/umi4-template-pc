import { myMsal } from "@/services/msal";
import { logUtil } from "@/utils/logUtil";
import { useState } from "react";

export const useLogin = () => {
  const [logging, setLogging] = useState(false);

  const handleAADLogin = () => {
    if (logging) {
      return;
    }
    setLogging(true);
    logUtil.debug("login.internal");
    myMsal.handleLogin("AAD").finally(() => {
      setLogging(false);
    });
  };

  const handleB2CLogin = () => {
    if (logging) {
      return;
    }
    setLogging(true);
    logUtil.debug("login.supplier");
    myMsal.handleLogin("B2C").finally(() => {
      setLogging(false);
    });
  };

  const handleWeComLogin = () => {
    if (logging) {
      return;
    }
    setLogging(true);
    logUtil.debug("login.wecom");
    myMsal.handleLogin("wecom").finally(() => {
      setLogging(false);
    });
  };

  const handleTeamsLogin = () => {
    return;
  };

  return { handleAADLogin, handleB2CLogin, handleWeComLogin, handleTeamsLogin, logging };
};
