/* eslint-disable @next/next/no-img-element */
import { Divider } from "@/components/divider";
import { FileDropper } from "@/components/file-dropper";
import { Wrapper } from "@/components/wrapper";
import { matchers, methods } from "@/constants";
import axios from "axios";
import { useState } from "react";
import Select from "react-select";

export default function IndexPage() {
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
        <FileDropper image={image} setImage={setImage} />
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
