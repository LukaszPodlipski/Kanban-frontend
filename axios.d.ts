import { AxiosStatic } from 'axios'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $http: AxiosStatic
  }
}

declare module 'axios' {
  export interface AxiosResponse<T = any> extends Promise<T> {}
}
