
import axiosInstance from "./axiosInstance";

export const runCode = async (source_code, stdin, language) => {
  try {
    const res = await axiosInstance.post("/code/run-code", {
      source_code,
      input:stdin,
      language,
    });
    return res.data.output;
  } catch (err) {
    console.error("Frontend Error:", err.message);
    return "Error executing code.";
  }
};
