type LoginInfo = {
  loginType: string;
  isAAD: boolean;
  isB2C: boolean;
  account: string;
  password: string;
};

type MyAccountInfo = {
  userGid: string;
  userId: string;
  account: string;
  realName: string;
  userType: "AAD" | "B2C";
  system: null;
  email: string;
  countryArea: string;
  empNo: string;
  vendorId: string;
  avatar: string | null;
  globeRoleName: string | null;
  clientType: number;
  exp: number;
  tokenString: string | null;
  roleList: MyAccountRoleInfo[];
  authCodes: string | null;
  auhtList: MyAccountAuthInfoList[];
  authCodeList: string[];
};
type MyAccountRoleInfo = {
  id: string;
  roleName: string;
  deleFlag: number;
  created: string;
  createdBy: string;
  modified: string;
  modifiedBy: string;
  adminFlag: number;
};
type MyAccountAuthInfoList = {
  id: string;
  authCode: string;
  authName: string;
  parentId: string;
  path: string;
  index: number;
  icon: string | null;
  subTree: MyAccountAuthInfoList[] | null;
};

type CommonPageRequestParams<T> = {
  pageSize?: number;
  current?: number;
  orderField?: string;
  orderType?: string;
  searchKey?: string;
} & NonNullable<MapToKeyValuePair<T>>;
