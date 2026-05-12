export type LocalUploadFile = {
  id: string;
  filename: string;
  name: string;
  file_url: string;
  url: string;
  preview_url: string;
  mime_type: string;
  type: "image" | "file";
  size: number;
  size_label: string;
  created_at: string;
  uploaded_by: string;
  is_local: boolean;
};

export const formatUploadSize = (size?: number | string) => {
  if (!size) return "Size not available";
  if (typeof size === "string") return size;
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
};

export const isImageMime = (mimeType?: string) => Boolean(mimeType?.startsWith("image/"));

export const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("Could not read file."));
    reader.readAsDataURL(file);
  });

export const makeLocalUploadFile = async (file: File, index = 0, uploadedBy = "Current user"): Promise<LocalUploadFile> => {
  const dataUrl = await readFileAsDataUrl(file);
  const type = isImageMime(file.type) ? "image" : "file";

  return {
    id: `local-${Date.now()}-${index}`,
    filename: file.name,
    name: file.name,
    file_url: dataUrl,
    url: dataUrl,
    preview_url: dataUrl,
    mime_type: file.type || "application/octet-stream",
    type,
    size: file.size,
    size_label: formatUploadSize(file.size),
    created_at: new Date().toISOString(),
    uploaded_by: uploadedBy,
    is_local: true,
  };
};

export const makeLocalUploadFiles = async (files: FileList | File[] | null, uploadedBy = "Current user") => {
  if (!files) return [];
  return Promise.all(Array.from(files).map((file, index) => makeLocalUploadFile(file, index, uploadedBy)));
};
