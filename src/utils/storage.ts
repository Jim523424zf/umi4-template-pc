import localforage from "localforage";

export const getLocalState = (key: string, storage = localStorage) => {
  const localState = storage.getItem(key);
  if (!localState) {
    return null;
  }
  try {
    return JSON.parse(localState);
  } catch {
    return null;
  }
};
export const setLocalState = (key: string, value: any, storage = localStorage) => {
  try {
    storage.setItem("authState", JSON.stringify(value));
  } catch {
    storage.removeItem("authState");
  }
};

export function deleteCookie(name: string) {
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const cookieName = cookie.split("=")[0].trim();
    if (cookieName === name) {
      document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
  }
}

export function createLocalforageInstance(options: LocalForageOptions) {
  return localforage.createInstance(options);
}
