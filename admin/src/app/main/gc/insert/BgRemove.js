import imageCompression from "browser-image-compression";

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

    // 2. Remove background using remove.bg API
    let imageBlob = compressed;

    if (removeBg) {

  const API_KEYS = [
    process.env.NEXT_PUBLIC_REMOVE_BG_KEY_1,
    process.env.NEXT_PUBLIC_REMOVE_BG_KEY_2,
    process.env.NEXT_PUBLIC_REMOVE_BG_KEY_3,
  ];

  let success = false;

  for (const key of API_KEYS) {

    try {

      const formData = new FormData();

      formData.append("image_file", compressed);
      formData.append("size", "auto");

      const response = await fetch(
        "https://api.remove.bg/v1.0/removebg",
        {
          method: "POST",
          headers: {
            "X-Api-Key": key,
          },
          body: formData,
        }
      );

      if (response.ok) {

        imageBlob = await response.blob();

        success = true;

        break;
      }

    } catch (err) {
      console.log("API key failed");
    }
  }

  if (!success) {
    throw new Error(
      "All remove.bg API keys exhausted"
    );
  }
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

    // Full stretch resize
    ctx.drawImage(img, 0, 0, width, height);

    // 5. Convert canvas to PNG blob
    const finalBlob = await new Promise((resolve) => {
      canvas.toBlob(
        (blob) => resolve(blob),
        "image/png",
        1
      );
    });

    // cleanup memory
    URL.revokeObjectURL(objectUrl);

    // 6. Return final file
    return new File(
      [finalBlob],
      `${Date.now()}.png`,
      {
        type: "image/png",
      }
    );

  } catch (err) {

    console.error(
      "Image processing failed:",
      err
    );

    throw err;
  }
}
