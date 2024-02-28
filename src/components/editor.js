import React, { useRef } from 'react';
import { Editor as MCE } from '@tinymce/tinymce-react';
import PropTypes from 'prop-types';


const Editor = ( { name, value, onChange } ) => {
    const editorRef = useRef(null);
  
    const handleChange = () => {
        let value = editorRef.current.getContent();
        onChange(name, value);
    };

    return <>
        <MCE
        tinymceScriptSrc={'/lib/tinymce/tinymce.min.js'}
        onInit={(evt, editor) => editorRef.current = editor}
        onChange={handleChange}
        name={name}
        initialValue={value}
        init={{
          height: 300,
          menubar: false,
          statusbar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
      />
    </>
}

export default Editor;

Editor.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
}