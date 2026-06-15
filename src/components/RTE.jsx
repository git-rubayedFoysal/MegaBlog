import { Controller } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import conf from "../config/conf";

function RTE({ name, control, label, defaultValue = "" }) {
  return (
    <div className="w-full">
      {label && <label className="inline-block mb-1 pl-1">{label}</label>}
      <Controller
        name={name || "content"}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { onChange, value } }) => (
          <Editor
            apiKey={conf.tinymceApiKey}
            initialValue={value || defaultValue}
            onEditorChange={onChange}
            init={{
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
            }}
          />
        )}
      />
    </div>
  );
}

export default RTE;
