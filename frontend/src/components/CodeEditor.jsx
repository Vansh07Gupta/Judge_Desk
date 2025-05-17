import React, { useState, useEffect } from "react";
import storageService from '../services/storageService';

// Mock Monaco Editor for demo
const Editor = ({ height, defaultLanguage, language, value, onChange, theme, options }) => {
  return (
    <div
      style={{ height }}
      className="bg-gray-900 text-green-400 p-4 font-mono text-sm rounded-xl border border-gray-800 overflow-auto"
    >
      <div className="mb-2 text-gray-500">// {language} code editor</div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-full bg-transparent text-green-400 resize-none outline-none"
        style={{ minHeight: "400px" }}
        placeholder={`Write your ${language} code here...`}
      />
    </div>
  );
};

const CodeEditor = ({
  socket,
  roomId = "demo-room",
  userName = "Demo User",
  language = "javascript",
  setLanguage = () => {},
  code = "// Welcome to the collaborative code editor\nconsole.log('Hello, World!');",
  setCode = () => {},
  outPut = "Ready to execute code...",
  setOutPut = () => {},
}) => {
  const [userInput, setUserInput] = useState("");
  const [version, setVersion] = useState("*");
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    // Restore code, language, input, output from sessionStorage
    const savedCode = storageService.getCode();
    if (savedCode) setCode(savedCode);
    const savedLanguage = storageService.getLanguage();
    if (savedLanguage) setLanguage(savedLanguage);
    const savedInput = sessionStorage.getItem('input');
    if (savedInput) setUserInput(savedInput);
    const savedOutput = sessionStorage.getItem('output');
    if (savedOutput) setOutPut(savedOutput);
  }, []);

  useEffect(() => {
    sessionStorage.setItem('output', outPut);
  }, [outPut]);

  // When new output arrives, mark execution as finished
  useEffect(() => {
    if (isExecuting) {
      setIsExecuting(false);
    }
  }, [outPut]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    storageService.saveCode(newCode);
    socket.emit("codeChange", { roomId, code: newCode });
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    storageService.saveLanguage(e.target.value);
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    sessionStorage.setItem('input', e.target.value);
  };

  const runCode = () => {
    setIsExecuting(true);
    socket.emit("compileCode", {
      code,
      roomId,
      language,
      version,
      input: userInput,
    });
  };

  const handleFileOpen = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = event.target.result;
      setCode(fileContent);
      storageService.saveCode(fileContent);
      socket.emit("codeChange", { roomId, code: fileContent });
      const ext = file.name.split(".").pop();
      let newLanguage = language;
      if (ext === "js") newLanguage = "javascript";
      else if (ext === "py") newLanguage = "python";
      else if (ext === "java") newLanguage = "java";
      else if (ext === "cpp") newLanguage = "cpp";
      setLanguage(newLanguage);
    };
    reader.readAsText(file);
  };

  const downloadCode = () => {
    const extensions = {
      javascript: ".js",
      python: ".py",
      java: ".java",
      cpp: ".cpp",
    };
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code${extensions[language] || ".txt"}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const languageIcons = {
    javascript: "🟨",
    python: "🐍",
    java: "☕",
    cpp: "⚡",
  };

  return (
    <div className="flex flex-col gap-8 p-8 bg-gray-950 min-h-screen">
      {/* Code Editor Panel */}
      <div className="bg-gray-900 rounded-2xl shadow-lg p-6 mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-blue-400 font-semibold flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
              Collaborative Editor
            </span>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-300">Language:</label>
              <select
                value={language}
                onChange={handleLanguageChange}
                className="px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="javascript">{languageIcons.javascript} JavaScript</option>
                <option value="python">{languageIcons.python} Python</option>
                <option value="java">{languageIcons.java} Java</option>
                <option value="cpp">{languageIcons.cpp} C++</option>
              </select>
            </div>
            {/* File Actions */}
            <label className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl cursor-pointer transition-colors">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" /></svg>
              Open File
              <input
                type="file"
                accept=".cpp,.java,.py,.js"
                className="hidden"
                onChange={handleFileOpen}
              />
            </label>
            <button
              onClick={downloadCode}
              className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors"
            >
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a4 4 0 014-4h10a4 4 0 014 4v14a4 4 0 01-4 4z" /></svg>
              Save
            </button>
          </div>
        </div>
        <Editor
          height="400px"
          defaultLanguage={language}
          language={language}
          value={code}
          onChange={handleCodeChange}
          theme="vs-dark"
          options={{ minimap: { enabled: false }, fontSize: 14 }}
        />
      </div>
      {/* Input Section */}
      <div className="bg-gray-900 rounded-2xl shadow-lg p-6 mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-4">
          <label className="flex items-center gap-2 text-blue-400 font-semibold">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            Input
          </label>
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={runCode}
              disabled={isExecuting}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all text-lg
                ${isExecuting
                  ? "bg-gradient-to-r from-gray-600 to-gray-800 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"}
              `}
            >
              {isExecuting && (
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" /><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" /></svg>
              )}
              Execute Code
            </button>
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium
              ${isExecuting ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}
            `}>
              <span className={`w-2 h-2 rounded-full mr-2
                ${isExecuting ? "bg-yellow-400 animate-pulse" : "bg-green-400"}
              `}></span>
              {isExecuting ? "Running..." : "Ready"}
            </span>
          </div>
        </div>
        <textarea
          value={userInput}
          onChange={handleInputChange}
          placeholder="Enter input for your program..."
          className="w-full h-28 p-4 bg-gray-800 text-white border-2 border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-y font-mono"
        />
      </div>

      {/* Output Console */}
      <div className="bg-gray-900 rounded-2xl shadow-lg p-6 relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-blue-400 font-semibold flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a4 4 0 01-4-4V5a4 4 0 014-4h10a4 4 0 014 4v14a4 4 0 01-4 4z" /></svg>
            Output Console
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => navigator.clipboard.writeText(outPut)}
              className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Copy
            </button>
            <button
              onClick={() => setOutPut("")}
              className="text-xs px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
            >
              Clear
            </button>
          </div>
        </div>
        <pre className="w-full min-h-[80px] p-4 bg-gray-800 text-green-400 rounded-xl font-mono text-sm overflow-auto border border-gray-700 whitespace-pre-wrap">
          {outPut}
        </pre>
      </div>
    </div>
  );
};

export default CodeEditor;
