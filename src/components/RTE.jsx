import { Controller } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import conf from "../config/conf";
import { useMemo } from "react";

function RTE({ name, control }) {
  const editorConfig = useMemo(
    () => ({
      height: 500,
      menubar: false,

      skin: "oxide-dark",
      content_css: "dark",

      plugins: [
        "advlist autolink lists link image charmap print preview anchor",
        "searchreplace visualblocks code fullscreen",
        "insertdatetime media table paste code help wordcount",
      ],

      toolbar:
        "undo redo | formatselect | bold italic backcolor | " +
        "alignleft aligncenter alignright alignjustify | " +
        "bullist numlist outdent indent | removeformat | help",

      content_style:
        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px; background-color:#1e1e1e; color:#eaeaea; }",
    }),
    [],
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <Editor
          apiKey={conf.tinymceApiKey}
          value={value || ""}
          onEditorChange={onChange}
          init={editorConfig}
        />
      )}
    />
  );
}

export default RTE;
