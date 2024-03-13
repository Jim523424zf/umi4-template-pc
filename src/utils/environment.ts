import { useEffect, useState } from "react";

export enum BrowserType {
  WXWORK = "企业微信",
  TEAMS = "Microsoft Teams",
  CHROME = "Google Chrome",
  SAFARI = "Safari",
  OTHER = "普通浏览器",
}

/**
 * 根据userAgent获取当前环境。
 * @returns 当前环境的字符串表示。
 */
export function getCurrentBrowserType(): BrowserType {
  const userAgent: string = navigator.userAgent.toLowerCase();

  if (/wxwork/.test(userAgent)) {
    // Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.119 Safari/537.36 Language/zh wxwork/4.1.15 (MicroMessenger/6.2) WindowsWechat  MailPlugin_Electron WeMail embeddisk
    return BrowserType.WXWORK;
  } else if (/teams/.test(userAgent) || window.self !== window.parent) {
    return BrowserType.TEAMS;
  } else if (/chrome|edge/.test(userAgent)) {
    return BrowserType.CHROME;
  } else if (/safari/.test(userAgent)) {
    return BrowserType.SAFARI;
  } else {
    return BrowserType.OTHER;
  }
}

export function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const onResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return size;
}

export const MOBILE_MAX_WIDTH = 600;
export function useMobileScreen() {
  const { width } = useWindowSize();
  const mobileScale = width / MOBILE_MAX_WIDTH;
  // const mobileScaleStyle =
  //   mobileScale >= 1
  //     ? {}
  //     : {
  //         width: `${MOBILE_MAX_WIDTH}px`,
  //         transform: `scale(${mobileScale})`,
  //         transformOrigin: "0 0",
  //         // zoom: mobileScale,
  //       };

  return {
    isMobileScreen: isMobile() || width <= MOBILE_MAX_WIDTH,
    mobileScale,
    mobileScaleStyle: {},
  };
}

export function isMobile() {
  const userAgent = navigator.userAgent.toLowerCase();
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}

export function isIOS() {
  const userAgent = navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
}

export function isFirefox() {
  return typeof navigator !== "undefined" && /firefox/i.test(navigator.userAgent);
}

/**
 * Detects Macintosh
 */
export function isMacOS(): boolean {
  if (typeof window !== "undefined") {
    const userAgent = window.navigator.userAgent.toLocaleLowerCase();
    const macintosh = /iphone|ipad|ipod|macintosh/.test(userAgent);
    return !!macintosh;
  }
  return false;
}
