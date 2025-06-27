
import axios from "axios";
import qs from "qs";

const runcode=async (req, res) => {
  const { source_code, input, language } = req.body;

  try {
    
    const data = qs.stringify({
      source_code,
      language,
      input,
      longpoll: true,
      api_key: "guest", 
    });

    const createRes = await axios.post("https://api.paiza.io/runners/create.json", data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    // console.log("h1");
    const { id } = createRes.data;

    if (!id) {
      return res.status(500).json("Failed to create submission.");
    }

    // Poll for result
    const pollResult = async () => {
      const result = await axios.get("https://api.paiza.io/runners/get_details", {
        params: { id, api_key: "guest" },
      });

      if (result.data.status === "completed") {
        const output = result.data.stdout || result.data.stderr || result.data.build_stderr || "No Output";
        // console.log(output);
        return res.json({ output: output.trim() });
      } else {
        setTimeout(pollResult, 1000); 
      }
    };

    pollResult(); 

  } catch (err) {
    console.error("Backend Error:", err.message);
    res.status(500).json({ error: "Execution failed: " + err.message });
  }
}
export default runcode;