import useSWR from "swr";

const fetcher = (...args: [string, RequestInit?]) =>
  fetch(...args).then((res) => res.json());

export function useTask() {
  const { data, error, isLoading } = useSWR(
    `http://192.168.2.200:8888/api/planning/GetPlanningTaskFiles`,
    fetcher,
    {
      refreshWhenHidden: false, // 当页面不可见时，停止重新获取数据
    }
  );
  return {
    data: data,
    isLoading,
    isError: error,
  };
}

export function useKivaTask() {
  const {
    data: taskData,
    error: taskError,
    isLoading: isTaskLoading,
  } = useSWR(
    `http://192.168.2.200:8888/api/planning/GetAllKivaPlanningTaskFilesName`,
    fetcher,
    {
      refreshWhenHidden: false, // 当页面不可见时，停止重新获取数据
    }
  );
  return {
    data: taskData,
    isLoading: isTaskLoading,
    isError: taskError,
  };
}
