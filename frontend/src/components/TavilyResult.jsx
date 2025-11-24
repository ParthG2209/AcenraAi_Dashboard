const TavilyResult = ({ data }) => {
  if (!data) {
    return null;
  }

  return (
    <div className="tavily-result">
      <div className="tavily-header">
        <h3>Search Results</h3>
        <p className="tavily-query">
          <strong>Searched for:</strong> {data.query}
        </p>
      </div>

      {data.answer && (
        <div className="tavily-answer">
          <h4>Summary</h4>
          <p>{data.answer}</p>
        </div>
      )}

      {data.topResults && data.topResults.length > 0 && (
        <div className="tavily-sources">
          <h4>Sources</h4>
          <div className="sources-list">
            {data.topResults.map((result, index) => (
              <div key={index} className="source-item">
                <h5>
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {result.title}
                  </a>
                </h5>
                <p className="source-snippet">{result.snippet}</p>
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="source-url"
                >
                  {result.url}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.responseTime && (
        <p className="tavily-meta">
          Response time: {data.responseTime.toFixed(2)}s
        </p>
      )}
    </div>
  );
};

export default TavilyResult;