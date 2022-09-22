import axios, { AxiosRequestConfig, Method } from "axios";

interface UsePaginationProps {
  url: string;
  method: Method;
  requestOptions?: AxiosRequestConfig<any>;
}

export function usePagination(props: UsePaginationProps) {
  function fetchData() {
    return axios(props.url, props.requestOptions);
  }
  return fetchData;
}
