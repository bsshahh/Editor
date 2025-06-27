const ProblemViewer = ({ problem }) => (
  <div className="p-4 text-white bg-gray-800 rounded-md h-full overflow-auto">
    <h2 className="text-xl font-semibold mb-2">{problem.title}</h2>
    <p className="mb-4">{problem.description}</p>
    {problem.examples.map((e, i) => (
      <pre key={i} className="bg-vs-black-100 p-2 my-2">
        <strong>Input: </strong>
        {e.input}
        <br />
        <strong>Output: </strong>
        {e.output}
      </pre>
    ))}
  </div>
);

export default ProblemViewer;
