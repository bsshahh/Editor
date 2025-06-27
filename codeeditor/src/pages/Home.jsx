import { problems } from "../data/problems";
import { Link } from "react-router-dom";

const Home = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold mb-4">All Problems</h1>
    {problems.map(p => (
      <div key={p.id} className="p-2 border mb-2">
        <h2 className="text-xl">{p.title}</h2>
        <Link to={`/problem/${p.id}`} className="text-blue-500">Solve</Link>
      </div>
    ))}
  </div>
);

export default Home;