import useSWR from "swr";

const fetcher = (...args: [string, RequestInit?]) =>
  fetch(...args).then((res) => res.json());

export function useTask() {
  const { data, error, isLoading } = useSWR(
    `http://192.168.2.112:8888/api/planning/GetPlanningTaskFiles`,
    fetcher,
    {
      refreshWhenHidden: false, // 当页面不可见时，停止重新获取数据
      refreshInterval: 3000,
    }
  );
  return {
    data: data,
    isLoading,
    isError: error,
  };
}
