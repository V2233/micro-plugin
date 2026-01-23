interface resCodeType {
  code: number;
  message: string;
}

interface userBaseConfigType {
  type: string;
  desc: string;
  value: any;
}

export interface userConfigType {
  avatar: userBaseConfigType;
  username: userBaseConfigType;
  password: userBaseConfigType;
  desc: userBaseConfigType;
  routes: userBaseConfigType;
}

export interface userConfigResponseType extends resCodeType {
  data: userConfigType[];
}

export interface schemaType {
  field: string;
  label: string;
  bottomHelpMessage?: string;
  component?: string;
  componentProps?: any;
  value?: any;
  required?: boolean;
}

export interface guobaPluginInfoType {
  pluginName: string;
  name: string;
  title: string;
  author: string;
  authorLink: string;
  link: string;
  isV2: boolean;
  isV3: boolean;
  isV4?: boolean;
  description: string;
  icon: string;
  iconColor: string;
  iconPath: string;
}

export interface guobaSupportType {
  pluginInfo: guobaPluginInfoType;
  configInfo: {
    schemas: schemaType[];
    getConfigData: Function;
    setConfigData: Function;
  };
}

export interface guobaPluginsInfoResponseType extends resCodeType {
  data: guobaPluginInfoType[];
}

export interface guobaPluginsConfigResponseType extends resCodeType {
  data: schemaType[];
}
