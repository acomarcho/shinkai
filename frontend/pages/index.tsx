import { Wrapper } from "@/components/wrapper";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function IndexPage() {
  const onDrop = useCallback(<T extends File>(acceptedFile: T[]) => {
    console.log(acceptedFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  let fileUploadStyle =
    "w-full flex flex-col justify-center items-center h-[300px] border-black border-dashed border-[2px] rounded-2xl mt-[3rem]";
  if (isDragActive) {
    fileUploadStyle += " bg-sky-100 border-sky-800";
  }

  return (
    <Wrapper>
      <>
        <h1 className="font-bold text-[2rem] text-sky-800">shinkai</h1>
        <p>Color grade your images, Makoto Shinkai style!</p>
        <Divider />
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
                Drag and drop a file here, or click to select a file
              </p>
            </>
          )}
        </div>
      </>
    </Wrapper>
  );
}

const Divider = () => {
  return (
    <div className="h-[3px] w-full bg-gradient-to-r my-[1rem] from-sky-800 to-sky-500" />
  );
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
