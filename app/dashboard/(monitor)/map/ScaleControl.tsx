import { useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

/**
 * 自定义比例尺控件
 */
function CustomScaleControl() {
  const map = useMap();

  /**
   * 计算比例尺
   * @returns {number} 比例尺的值
   */
  const calculateScale = () => {
    const zoom = map.getZoom();

    const scale = Math.pow(1 / 2, zoom);
    return scale;
  };

  return (
    <>
      <div className="leaflet-left leaflet-bottom text-gray-900 m-5  border-x-2 border-b-2 w-20 text-xs text-center border-green-600/75 drop-shadow-2xl">
        {calculateScale()} cm
      </div>
    </>
  );
}

export default CustomScaleControl;
