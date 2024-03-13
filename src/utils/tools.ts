import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { isArray, isEmpty } from "lodash-es";
dayjs.extend(utc);

/**
 * 处理请求地址，如果是相对地址，拼接上当前域名
 * @param uri
 * @returns
 */
export const getHostUri = (uri?: string) => {
  if (!uri || uri.indexOf("http") === 0) {
    return uri;
  }
  return `${location.protocol}//${location.host}${uri}`;
};

export const objectToSelectList = (obj: object) => {
  if (Object.keys(obj)?.length > 0) {
    const list = Object.entries(obj);
    const resList = list.map((item) => {
      return {
        label: item[0],
        value: item[1],
      };
    });
    return resList;
  } else {
    return [];
  }
};

export const listToSelectList = (list: any[], key: string) => {
  if (list?.length) {
    const res = list.map((item) => {
      return {
        label: item[key],
        value: item[key],
      };
    });
    return res;
  } else {
    return [];
  }
};

export const listToSelectListId = (list: any[], key: string) => {
  if (list?.length) {
    const res = list.map((item) => {
      return {
        label: item[key],
        value: item?.id,
      };
    });
    return res;
  } else {
    return [];
  }
};

export const listStringToSelectList = (list: string[]) => {
  if (list?.length) {
    const res = list.map((item) => {
      return {
        label: item,
        value: item,
      };
    });
    return res;
  } else {
    return [];
  }
};

// 比较时间大小
export const compareDate = (date1: string | number | Date, date2: string | number | Date) => {
  const oDate1 = new Date(date1);
  const oDate2 = new Date(date2);
  if (oDate1.getTime() > oDate2.getTime()) {
    return true; //第一个大
  } else {
    return false; //第二个大
  }
};

export const getDayjs = (date: string | number | dayjs.Dayjs | Date | null | undefined, defaultValue?: dayjs.Dayjs) => {
  return !isEmpty(date) ? dayjs(date) : defaultValue;
};

/** UTC时间转本地时间 */
export const timeUtcToLocal = (date: string, format?: string) => {
  const formatData = format ?? "YYYY-MM-DD HH:mm:ss";
  // 特殊处理 后端输出的 带T不带Z的时间
  if (date && date.indexOf("T") > -1 && date.indexOf("Z") === -1) {
    return dayjs.utc(date).local().format(formatData);
  }
  // 你能正常识别带时区的时间
  if (date) {
    return dayjs(date).format(formatData);
  }
  return "--";
};
/** 本地时间转UTC时间 */
export const timeLocalToUtc = (date?: string | number | dayjs.Dayjs | Date | null | undefined) => {
  if (date) {
    return dayjs(date).toISOString();
  }
  return "";
};
/** antd时间范围组件的处理 */
export const antdDateRangeLocalToUtc = (dateRange?: [string, string]) => {
  if (!dateRange) {
    return dateRange;
  }
  return [timeLocalToUtc(dateRange[0]), timeLocalToUtc(getDayjs(dateRange[1])?.add(1, "day"))];
};
export const parseIntSafely = (value: string, defaultValue?: number) => {
  const pValue = parseInt(value);
  return !isNaN(pValue) ? pValue : defaultValue || 0;
};

export const tableRandomKey = <T>(data?: Array<T>): Array<T & { key: string }> => {
  return (
    data?.map((item) => {
      return { ...item, key: getRandomKey() };
    }) || []
  );
};
export const getRandomKey = () => (Math.random() * 1000000).toFixed(0);
export const namePathToKey = (name?: NamePath) => {
  if (isArray(name)) {
    return name.join("_");
  }
  return name;
};

export function isJSON(str: any) {
  if (typeof str === "string") {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }
}

/**
 * 功能：当数组内的项为对象时，可用此方法去重
 * @param arr   需要去重的目标数组
 * @param name  需要指定的对象内的某一个属性
 * @returns     返回去重后的数组
 */
export const uniqueArray = (arr: any, name: any) => {
  return arr.reduce((acc: any, cur: any) => {
    const duplicate = acc.find((item: any) => item[name]?.trim() === cur[name]?.trim());
    if (!duplicate) {
      return acc.concat([cur]);
    }
    return acc;
  }, []);
};

export const focusFormError = () => {
  const fileClassFilter = ".ant-form-item-has-error .ant-btn";
  const selectClassFilter =
    ".ant-form-item-has-error ant-select-selection-item,.ant-form-item-has-error ant-select-selection-search-input";
  const inputClassFilter = ".ant-form-item-has-error .ant-input";
  const otherClassFilter = ".ant-form-item-has-error input";
  setTimeout(() => {
    const selectors = [fileClassFilter, selectClassFilter, inputClassFilter, otherClassFilter].join(",");
    const elements = document.querySelectorAll(selectors);
    for (let i = 0; i < elements?.length; i++) {
      const element = elements[i];
      const computedStyle = window.getComputedStyle(element);
      if (computedStyle.getPropertyValue("display") === "none") {
        continue;
      }
      element.focus();
      break;
    }
  }, 32);
};

export const waitUntil = (condition: () => boolean, timeout = 1000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      if (condition()) {
        clearInterval(timer);
        resolve(true);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(timer);
        reject(new Error("waitUntil timeout"));
      }
    }, 32);
  });
};
// 替换图片
export function getPreviewImageUrl(imgUrl: string) {
  const extension = imgUrl.split(".").pop();
  const withoutExtension = imgUrl.slice(0, -extension.length - 1);
  return `${withoutExtension}-preview.${extension}`;
}

/**
 * 是否滚动到底部
 * @returns
 */
export function isScrolledToBottom(offset: number) {
  // 获取页面的高度
  const windowHeight = window.innerHeight;

  // 获取当前滚动位置
  const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

  // 获取页面的总高度
  const documentHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.clientHeight,
    document.documentElement.clientHeight,
  );
  // 计算距离底部的剩余距离
  const distanceToBottom = documentHeight - (windowHeight + scrollY);

  // 判断是否距离底部小于等于指定的偏移量
  return distanceToBottom <= offset;
}
