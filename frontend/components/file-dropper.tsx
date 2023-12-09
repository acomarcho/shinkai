import { FileUploadIcon } from "@/assets/file-upload-icon";
import { Dispatch, SetStateAction, useCallback } from "react";
import { useDropzone } from "react-dropzone";

export const FileDropper = ({
  image,
  setImage,
}: {
  image: File | null;
  setImage: Dispatch<SetStateAction<File | null>>;
}) => {
  const onDrop = useCallback(
    <T extends File>(acceptedFile: T[]) => {
      setImage(acceptedFile[0]);
    },
    [setImage]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  let fileUploadStyle =
    "w-full flex flex-col justify-center items-center h-[300px] border-black border-dashed border-[2px] rounded-2xl mt-[1rem] transition-all cursor-pointer hover:bg-sky-100 hover:border-sky-800";
  if (isDragActive) {
    fileUploadStyle += " bg-sky-100 border-sky-800";
  }

  return (
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
  );
};
