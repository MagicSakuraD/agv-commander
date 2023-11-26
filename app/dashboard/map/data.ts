export function MapData(mqtt_message: string): Array<[number, number]> {
  // const keys = ["categoryCode", "actionCode", "speed", "pathPoints"];

  // 将mqtt_message拆分为各个部分
  const messageParts = mqtt_message.split("|");
  // 提取具体动作代码
  const actionCode = messageParts[1];

  switch (actionCode) {
    case "0x8302":
      // 获取导引点的个数
      const numPoints = messageParts.length - 3;

      // 提取路径点信息
      const pathPoints = messageParts.slice(3);

      // 创建包含路径点的数组
      const pathArray = pathPoints.map((point) => {
        const [x, y, theta] = point.split(",");
        return [parseFloat(x), parseFloat(y)] as [number, number];
      });

      // 打印导引点个数和路径点数组
      // console.log("导引点个数:", numPoints);
      // console.log("路径点数组:", pathArray);
      return pathArray;

    default:
      break;
  }

  return [];
}
