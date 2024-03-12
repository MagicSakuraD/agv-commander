import useSWR from "swr";

const fetcher = (...args: [string, RequestInit?]) =>
  fetch(...args).then((res) => res.json());

export function useTask() {
  const { data, error, isLoading } = useSWR(
    `http://192.168.2.112:8888/api/planning/GetPlanningTaskFiles`,
    fetcher
  );

  return {
    data: data,
    isLoading,
    isError: error,
  };
}
