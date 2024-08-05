export interface schemaType {
    field: string,
    label: string,
    bottomHelpMessage?: string,
    component?: string,
    componentProps?: any,
    value?: any,
    required?: boolean
}

export interface guobaSupportType {
    pluginInfo: any,
    configInfo: {
        schemas: schemaType[],
        getConfigData: Function,
        setConfigData: Function
    }
}