import React, {
  FC,
  PureComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { set } from "react-hook-form";
import { PieChart, Pie, Sector, ResponsiveContainer } from "recharts";

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`${value} GB`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const ActiveShapePieChart = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [data, setData] = useState<{ name: string; value: unknown }[]>([]);
  useEffect(() => {
    // 发送 GET 请求
    fetch("http://192.168.2.112:8888/api/info/GetDiskInfo", {
      method: "GET",
    })
      .then((response) => {
        // 检查响应的状态码
        if (!response.ok) {
          throw new Error("HTTP 状态" + response.status);
        }
        return response.json();
      })
      .then((data) => {
        // 处理响应数据

        let dataList = data.data;
        let res_system =
          dataList["total_size"] -
          dataList["bag_size"] -
          dataList["free_size"] -
          dataList["log_size"];

        dataList["system_size"] = parseFloat(res_system.toFixed(2));
        // 删除 total_size
        delete dataList["total_size"];
        console.log(dataList);

        // 创建一个映射对象，将英文的键名映射到中文的名字
        const nameMap: { [key: string]: string } = {
          bag_size: "数据包",
          free_size: "空闲空间",
          log_size: "日志",
          system_size: "系统",
        };

        // 映射 dataList 到新的数组
        const res_data = Object.entries(dataList).map(([name, value]) => ({
          name: nameMap[name],
          value,
        }));

        setData(res_data);
      })
      .catch((error) => {
        // 处理错误
        console.error("Error:", error);
      });
  }, []);
  const onPieEnter = useCallback(
    (_: object, index: number) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  return (
    <PieChart width={500} height={500}>
      <Pie
        activeIndex={activeIndex}
        activeShape={renderActiveShape}
        data={data}
        cx={200}
        cy={200}
        innerRadius={60}
        outerRadius={80}
        fill="#16a34a"
        dataKey="value"
        onMouseEnter={onPieEnter}
      />
    </PieChart>
  );
};

export default ActiveShapePieChart;
