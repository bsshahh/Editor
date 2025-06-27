const OutputBox = ({ output }) => {
  if(!output || output.length===0) return null;
  
  if(Array.isArray(output)){
    return (

      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Test Case Results:</h2>
        {output.map((res, idx) => (
          <div key={idx} className={`p-3 mb-2 rounded ${res.passed ? 'bg-green-100' : 'bg-red-100'}`}>
            <p><strong>Input:</strong> {res.input}</p>
            <p><strong>Expected:</strong> {res.expected}</p>
            <p><strong>Actual:</strong> {res.actual}</p>
            <p><strong>Status:</strong> {res.passed ? '✅ Passed' : '❌ Failed'}</p>
          </div>
        ))}
      </div>
  );
  }

  return <div className="bg-gray-100 p-4 mt-4 rounded"><pre>{output}</pre></div>;
  
};

export default OutputBox;
