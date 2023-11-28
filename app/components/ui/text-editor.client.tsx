import type { ComponentProps } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

type ReactQuillProps = ComponentProps<typeof ReactQuill>;

const toolBarOptions = {
  toolbar: [
    ["bold", "italic", "underline"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    // ["link", "image", "video"],
    ["clean"],
  ],
};

export function TextEditor(props: ReactQuillProps) {
  return <ReactQuill {...props} modules={toolBarOptions} />;
}
