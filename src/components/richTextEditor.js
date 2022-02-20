import * as React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

function RichTextEditor() {
  const [text, setText] = React.useState("");
  console.log(text);
  return (
    <>
      <CKEditor
        editor={ClassicEditor}
        data={text}
        onChange={(event, editor) => {
          const data = editor.getData();
          setText(data);
        }}
      />
    </>
  );
}

export default RichTextEditor;
