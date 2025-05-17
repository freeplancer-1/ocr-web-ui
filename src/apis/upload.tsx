import axios, { AxiosProgressEvent } from "axios";

export interface UploadOptions {
  url?: string;
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
}

export interface UploadResponse {
  url: string;
  [key: string]: any;
}

export async function uploadImage(
  file: File,
  options: UploadOptions = {}
): Promise<UploadResponse> {
  if (!(file instanceof File)) {
    throw new Error("uploadImage: tham số đầu tiên phải là File");
  }

  const { url = "/api/upload", onUploadProgress } = options;
  console.log(url);
  
  const formData = new FormData();
  formData.append("file", file);

  const config = {
    headers: { "Content-Type": "multipart/form-data" as const },
    ...(onUploadProgress && { onUploadProgress }),
  };

  const response = await axios.post<UploadResponse>(url, formData, config);
  return response.data;
}
