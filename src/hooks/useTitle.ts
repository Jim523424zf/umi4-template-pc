import { useIntl } from "@umijs/max";
import { useTitle } from "ahooks";
import { Options } from "ahooks/lib/useTitle";

export const useLocateTitle = (locateTitle: string, options?: Options) => {
  const intl = useIntl();
  const title = intl.formatMessage({
    id: locateTitle,
  });
  useTitle(title, options);
};
