import React, { useEffect, useState } from "react";

const CheckMapping = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (count === 10) {
          return; // Stop making fetch requests when count is 10
        }

        const res = await fetch(
          "http://192.168.2.112:8888/api/info/CheckIsMappingRecord",
          { next: { revalidate: 3 } }
        );
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await res.json();
        // 处理返回的数据
      } catch (error) {
        // 处理错误
      } finally {
        setCount((prevCount) => prevCount + 1);
      }
    };

    fetchData();
  }, [count]);

  return <div></div>;
};

export default CheckMapping;
