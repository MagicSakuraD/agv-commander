export default function parseAction(action: string) {
  if ((action.match(/\|/g) || []).length >= 2) {
    const parts = action.split("|");
    const actionSubcategory = parts[1];
    let actionParameter: string;
    switch (actionSubcategory) {
      case "0x8201":
        actionParameter = parts[2];
        return `前进${actionParameter}米`;
      case "0x8202":
        actionParameter = parts[2];
        return `后退${actionParameter}米`;
      case "0x8203":
        actionParameter = parts[2];
        return `左转${actionParameter}度`;
      case "0x8204":
        actionParameter = parts[2];
        return `右转${actionParameter}度`;

      case "0x8301":
        const startpoint = parts[2];
        const endpint = parts[3];
        return `从起点(${startpoint})到终点(${endpint})的路径规划`;
      case "0x8302":
        const speed = parts[2];
        let pointlist = [];
        for (let index = 3; index < parts.length; index++) {
          const fallowpoint = `(${parts[index]})`;
          pointlist.push(fallowpoint);
        }
        let res = `以${speed} m/s的速度依次经过 ${pointlist.join(",")}`;
        return res;
      case "0x8303":
        const mySpeed = parts[2];
        const mygoal = parts[3];
        return `以${mySpeed} m/s的速度到达目标点(${mygoal})`;
      default:
        break;
    }
  } else {
    return "无效的操作格式，正确格式：“大类编码|动作代码|参数”";
  }
}
