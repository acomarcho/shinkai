/* eslint-disable @next/next/no-img-element */
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Select from "react-select";
import axios from "axios";

const matchers = [
  {
    value: "beyond-the-clouds.jpg",
    label: "The Place Promised in Our Early Days",
  },
  {
    value: "garden-of-words.png",
    label: "Garden of Words",
  },
  {
    value: "kimi-no-na-wa.jpg",
    label: "Your Name",
  },
  {
    value: "tenki-no-ko.jpg",
    label: "Weathering with You",
  },
];

const methods = [
  {
    value: "hm",
    label: "Histogram Matching (HM)",
  },
  {
    value: "reinhard",
    label: "Reinhard",
  },
  {
    value: "mvgd",
    label: "Multi-Variate Gaussian Distribution (MVGD)",
  },
  {
    value: "hm-mvgd-hm",
    label: "HM - MVGD - HM",
  },
];

export default function IndexPage() {
  const onDrop = useCallback(<T extends File>(acceptedFile: T[]) => {
    setImage(acceptedFile[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const [image, setImage] = useState<File | null>(null);
  const [selectedMatcher, setSelectedMatcher] = useState({
    value: "",
    label: "",
  });
  const [selectedMethod, setSelectedMethod] = useState({
    value: "",
    label: "",
  });
  const [outputImageInBase64, setOutputImageInBase64] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  let fileUploadStyle =
    "w-full flex flex-col justify-center items-center h-[300px] border-black border-dashed border-[2px] rounded-2xl mt-[1rem] transition-all cursor-pointer hover:bg-sky-100 hover:border-sky-800";
  if (isDragActive) {
    fileUploadStyle += " bg-sky-100 border-sky-800";
  }

  const onProcessImage = async () => {
    if (!image || !selectedMatcher.value || !selectedMethod.value) {
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();

      formData.append("image", image);
      formData.append("matcher_filename", selectedMatcher.value);
      formData.append("method", selectedMethod.value);

      type APIResponse = {
        image: string;
      };

      const { data: responseData } = await axios.post<APIResponse>(
        "http://host.docker.internal:5000/image",
        formData
      );

      setOutputImageInBase64(responseData.image);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
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
        <div className="flex items-center gap-[1rem] w-full mt-[1rem]">
          <p>Style:</p>
          <Select
            options={matchers}
            value={selectedMatcher}
            onChange={(v) => {
              if (v) {
                setSelectedMatcher(v);
              }
            }}
            className="flex-1"
          />
        </div>
        <div className="flex items-center gap-[1rem] w-full mt-[1rem]">
          <p>Method:</p>
          <Select
            options={methods}
            value={selectedMethod}
            onChange={(v) => {
              if (v) {
                setSelectedMethod(v);
              }
            }}
            className="flex-1"
          />
        </div>
        <button
          className="mt-[1rem] p-[1rem] bg-sky-600 w-full text-white font-bold rounded-2xl disabled:bg-sky-300 transition-all hover:bg-sky-700"
          disabled={!image || isLoading}
          onClick={() => onProcessImage()}
        >
          {!isLoading ? "Process image!" : "Loading..."}
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

const Wrapper = ({ children }: { children: JSX.Element }) => {
  return <div className="max-w-[1160px] mx-auto p-[1rem]">{children}</div>;
};

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
