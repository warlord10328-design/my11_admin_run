import imageCompression from "browser-image-compression";
import { removeBackground } from "@imgly/background-removal";

export async function processImage(
  file,
  width,
  height,
  removeBg = true
) {
  try {

    // 1. Compress image
    const compressed = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 2000,
      useWebWorker: true,
    });

    // 2. Remove background
    let imageBlob = compressed;

    if (removeBg) {
      imageBlob = await removeBackground(compressed);
    }

    // 3. Load image into canvas
    const img = new Image();

    const objectUrl = URL.createObjectURL(imageBlob);

    img.src = objectUrl;

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    // 4. Create canvas
    const canvas = document.createElement("canvas");

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    // Transparent background
    ctx.clearRect(0, 0, width, height);

    // Full stretch
    ctx.drawImage(img, 0, 0, width, height);

    // 5. Convert to PNG
    const finalBlob = await new Promise((resolve) => {
      canvas.toBlob(
        (blob) => resolve(blob),
        "image/png",
        1
      );
    });

    // cleanup memory
    URL.revokeObjectURL(objectUrl);

    // 6. Return file
    return new File(
      [finalBlob],
      `${Date.now()}.png`,
      {
        type: "image/png",
      }
    );

  } catch (err) {
    console.error("Image processing failed:", err);
    throw err;
  }
}