// Client-side media handling for uploads from the phone. Images are resized
// and compressed before being stored in the draft (keeps localStorage small).

const MAX_IMAGE_WIDTH = 1600;
const MAX_FILE_BYTES = 3 * 1024 * 1024;

const loadImage = (file) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("That file couldn't be read as an image."));
    };
    img.src = url;
  });

/** Resize to ≤1600px wide and encode as WebP (JPEG fallback for older Safari). */
export const imageFileToDataUrl = async (file, maxWidth = MAX_IMAGE_WIDTH) => {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  const img = await loadImage(file);
  const scale = Math.min(1, maxWidth / img.naturalWidth);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.naturalWidth * scale);
  canvas.height = Math.round(img.naturalHeight * scale);
  canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
  let data = canvas.toDataURL("image/webp", 0.82);
  if (!data.startsWith("data:image/webp")) data = canvas.toDataURL("image/jpeg", 0.85);
  return data;
};

/** Read any file (e.g. resume PDF) as a data URL, with a size limit. */
export const fileToDataUrl = (file, maxBytes = MAX_FILE_BYTES) =>
  new Promise((resolve, reject) => {
    if (file.size > maxBytes) {
      reject(new Error(`File is too large (max ${Math.round(maxBytes / 1024 / 1024)} MB).`));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Couldn't read that file."));
    reader.readAsDataURL(file);
  });

export const isDataUrl = (v) => typeof v === "string" && v.startsWith("data:");

export const dataUrlInfo = (dataUrl) => {
  const [meta, base64] = dataUrl.split(",");
  const mime = meta.slice(5).split(";")[0];
  const ext = { "image/webp": "webp", "image/jpeg": "jpg", "image/png": "png", "image/gif": "gif", "application/pdf": "pdf" }[mime] ?? "bin";
  return { mime, ext, base64 };
};
