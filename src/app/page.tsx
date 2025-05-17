"use client";
import { useRouter } from "next/navigation";
import { PhotoIcon, ArrowUpOnSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { ChangeEvent, useRef, useState } from "react";
import { uploadImage } from "@/apis/upload";

export default function Home() {  
  const router = useRouter();
  const fileRef = useRef<File>(null);
  const [enableScanInvoice, setEnableScanInvoice] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);

  const readFile = (file: File) => {
    const reader = new FileReader();
    fileRef.current = file;
    reader.onload = () => {
      if (typeof reader.result === "string") setPreview(reader.result);

      setEnableScanInvoice(true);

      const dataUrl = reader.result as string;
      sessionStorage.setItem("imgData", dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    const file = e.dataTransfer.files?.[0];
    if (file) {
      readFile(file);
    }
    e.dataTransfer.clearData();
  };

  const handleClick = async (e: any) => {
    e.preventDefault();

    try {
      if (fileRef.current) {
        const data = await uploadImage(fileRef.current, {
          url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/upload-image`,
          onUploadProgress: () => {
            setLoading(true);
          },
        });

        sessionStorage.setItem("invoice_data", JSON.stringify(data.data));
      } else {
        console.error("Lỗi upload file");
        return;
      }

      setLoading(false);

      router.push("/invoice-detail");
    } catch (err) {
      console.error("Upload thất bại:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-[2dvh]">
      <h1 className="text-4xl font-bold text-center mt-[2dvh]">
        Scanning Invoice
      </h1>

      <div
        className="w-[90dvw] h-[60dvh] border-2 border-dashed border-gray-300 rounded-lg mt-[4dvh] flex flex-col items-center justify-center relative"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="flex items-center justify-center w-full h-full">
            <img
              src={preview}
              alt="Preview"
              className="object-contain max-w-full max-h-full"
            />
          </div>
        ) : (
          <>
            <PhotoIcon className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-lg font-medium">Drop, Upload or Paste Images</p>
            <p className="text-sm text-gray-400 mt-1 text-center">
              Supported formats: JPG, PNG, GIF, JFIF (JPEG), HEIC, PDF
            </p>
            <label
              htmlFor="fileInput"
              className="mt-6 flex items-center px-6 py-2 bg-white shadow border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50"
            >
              <ArrowUpOnSquareIcon className="w-5 h-5 mr-2 text-gray-600" />
              Browse
            </label>
            <input
              id="fileInput"
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </>
        )}
      </div>

      <Link
        onClick={handleClick}
        className={`mt-[4dvh]  px-6 py-2 rounded-md ${
          (console.log(enableScanInvoice),
          enableScanInvoice
            ? "bg-blue-600 text-white rounded-md hover:bg-blue-700"
            : "bg-gray-600 text-white hover:bg-blue-700")
        }`}
        href={""}
      >
        Scan Invoice
      </Link>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
            <div className="h-12 w-12 mb-4 rounded-full border-4 border-gray-200 border-t-black animate-spin" />
            <p className="text-gray-700 font-medium">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
}
