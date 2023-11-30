import { useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

interface Coords {
  x: number;
  y: number;
  z: number;
}

class CustomGridLayer extends L.GridLayer {
  createTile(coords: Coords) {
    const tile = document.createElement("canvas");

    const ctx = tile.getContext("2d");
    const size = this.getTileSize();

    tile.width = size.x;
    tile.height = size.y;
    if (!ctx) {
      throw new Error("Failed to get 2D context");
    }
    // Draw grid lines
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, size.y);
    ctx.lineTo(size.x, size.y);
    ctx.lineTo(size.x, 0);
    ctx.closePath();
    ctx.stroke();

    return tile;
  }
}

function Grid() {
  const map = useMap();

  useEffect(() => {
    const gridLayer = new CustomGridLayer();

    gridLayer.addTo(map);

    return () => {
      map.removeLayer(gridLayer);
    };
  }, [map]);

  return null;
}

export default Grid;
