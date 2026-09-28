const MAX_EDGE = 960;
const MAX_CHARS = 180_000;

/** Shrink a picked photo so it can be stored with the shared catalog. */
export function compressVehiclePhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
      const width = Math.max(1, Math.round(img.width * scale));
      const height = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("canvas"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      let quality = 0.72;
      let data = canvas.toDataURL("image/jpeg", quality);
      while (data.length > MAX_CHARS && quality > 0.4) {
        quality = Math.round((quality - 0.08) * 100) / 100;
        data = canvas.toDataURL("image/jpeg", quality);
      }
      URL.revokeObjectURL(url);
      if (data.length > 220_000) reject(new Error("too_large"));
      else resolve(data);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("image"));
    };
    img.src = url;
  });
}
