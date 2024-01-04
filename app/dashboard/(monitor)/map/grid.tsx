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
    if (!ctx) {
      throw new Error("Failed to get 2D context");
    }

    const size = this.getTileSize();
    const scale = Math.pow(1 / 2, coords.z);
    tile.width = size.x;
    tile.height = size.y;
    ctx.strokeStyle = "#16a34a";
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

    // Draw the grid labels
    ctx.fillStyle = "black";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const x = coords.x * tile.width;
    const y = coords.y * tile.height;
    ctx.fillText(
      `(${x * scale}, ${y * scale})`,
      tile.width / 7,
      tile.height / 7
    );
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
