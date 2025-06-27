import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SolveProblem from "./pages/SolveProblem";
import Formroutes from "./pages/Formroutes";

function App() {
  return (
    // <Router>
    //   <Routes>
    //     <Route path="/" element={<Dashboard />} />
    //     <Route path="/problem/:id" element={<SolveProblem />} />
    //   </Routes>
    // </Router>
    <>
      <Formroutes/>
    </>
  );
}

export default App;
