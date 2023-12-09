/* eslint-disable @next/next/no-img-element */
import { Wrapper } from "@/components/wrapper";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

export default function IndexPage() {
  const onDrop = useCallback(<T extends File>(acceptedFile: T[]) => {
    setImage(acceptedFile[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const [image, setImage] = useState<File | null>(null);
  const [outputImageInBase64, setOutputImageInBase64] = useState("");

  let fileUploadStyle =
    "w-full flex flex-col justify-center items-center h-[300px] border-black border-dashed border-[2px] rounded-2xl mt-[1rem] transition-all cursor-pointer hover:bg-sky-100 hover:border-sky-800";
  if (isDragActive) {
    fileUploadStyle += " bg-sky-100 border-sky-800";
  }

  const onProcessImage = async () => {
    if (!image) {
      return;
    }

    try {
      const formData = new FormData();

      if (image) {
        formData.append("image", image);
      }

      type APIResponse = {
        image: string;
      };

      const { data: responseData } = await axios.post<APIResponse>(
        "http://localhost:5000/image",
        formData
      );

      setOutputImageInBase64(responseData.image);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Wrapper>
      <>
        <h1 className="font-bold text-[2rem] text-sky-800">shinkai</h1>
        <p>Color grade your images, Makoto Shinkai style!</p>
        <div {...getRootProps()} className={fileUploadStyle}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <>
              <FileUploadIcon className="text-sky-800" size="42" />
              <p className="mt-[1rem] font-bold text-[1.125rem] text-sky-800">
                Drop the file here!
              </p>
            </>
          ) : (
            <>
              <FileUploadIcon size="42" />
              <p className="mt-[1rem] font-bold text-[1.125rem]">
                {image
                  ? `File uploaded: ${image.name}`
                  : "Drag and drop a file here, or click to select a file"}
              </p>
            </>
          )}
        </div>
        <button
          className="mt-[1rem] p-[1rem] bg-sky-600 w-full text-white font-bold rounded-2xl disabled:bg-sky-300 transition-all hover:bg-sky-700"
          disabled={!image}
          onClick={() => onProcessImage()}
        >
          Process image!
        </button>
        {outputImageInBase64 && (
          <>
            <Divider className="my-[2rem]" />
            <h1 className="font-bold text-[2rem] text-sky-800">
              Here is your image!
            </h1>
            <img
              src={`data:image/png;base64,${outputImageInBase64}`}
              className="w-full block"
              alt="Output image"
            />
          </>
        )}
      </>
    </Wrapper>
  );
}

const Divider = ({ className }: { className?: string }) => {
  let dividerStyle =
    "h-[3px] w-full bg-gradient-to-r my-[1rem] from-sky-800 to-sky-500";
  if (className) {
    dividerStyle += " " + className;
  }

  return <div className={dividerStyle} />;
};

const FileUploadIcon = ({
  size,
  className,
}: {
  size?: string;
  className?: string;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size ?? "24"}
      height={size ?? "24"}
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
      className={className ?? ""}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
      <path d="M7 9l5 -5l5 5" />
      <path d="M12 4l0 12" />
    </svg>
  );
};