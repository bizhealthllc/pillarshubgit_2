import React from 'react';
import PropTypes from 'prop-types';

import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/neat.css'; // choose your preferred theme
import 'codemirror/mode/css/css';
import 'codemirror/mode/htmlmixed/htmlmixed';


const CodeEditor = ({ name, value, mode = 'htmlmixed', onChange }) => {

  const handleChange = (value) => {
    onChange(name, value);
  };

  return <>
    <CodeMirror
      value={value}
      options={{
        mode: mode,
        lineNumbers: true,
      }}
      onBeforeChange={(editor, data, value) => {
        handleChange(value);
      }}
    />
  </>
}

export default CodeEditor;

CodeEditor.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  mode: PropTypes.string,
  onChange: PropTypes.func.isRequired
}
