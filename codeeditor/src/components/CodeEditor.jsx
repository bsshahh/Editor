import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

const CodeEditor = ({ language, setLanguage, defaultCode, userCode, setUserCode }) => {
  useEffect(() => {
    if (defaultCode && defaultCode[language]) {
    setUserCode(defaultCode[language]);
  }
  }, [language, defaultCode, setUserCode]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="w-32 p-1 rounded bg-gray-800 text-white"
      >
        <option value="javascript">JavaScript</option>
        <option value="cpp">C++</option>
        <option value="java">Java</option>
      </select>
      <Editor
        height="400px"
        defaultLanguage={language}
        language={language}
        value={userCode||""}
        onChange={(val) => setUserCode(val)}
        theme="vs-dark"
      />
    </div>
  );
};

export default CodeEditor;
