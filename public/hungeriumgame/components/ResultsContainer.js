export default function ResultsContainer({ results, onNext }) {
  const getImpactClass = (value) => {
    return value > 0 ? 'positive' : value < 0 ? 'negative' : '';
  };
  
  const formatImpact = (value) => {
    return value > 0 ? `+${value}` : value;
  };
  
  return (
    <div className="bg-white p-5 rounded-lg text-center">
      <h2 className="text-2xl font-bold mb-4">Results</h2>
      <p className="mb-5">{results.text}</p>
      
      <div className="grid grid-cols-2 gap-3 my-5">
        <div className="p-3 bg-coffee-light rounded">
          Money: <span className={getImpactClass(results.moneyImpact)}>
            {formatImpact(results.moneyImpact)}
          </span>
        </div>
        <div className="p-3 bg-coffee-light rounded">
          Popularity: <span className={getImpactClass(results.popularityImpact)}>
            {formatImpact(results.popularityImpact)}
          </span>
        </div>
        <div className="p-3 bg-coffee-light rounded">
          Operations: <span className={getImpactClass(results.operationsImpact)}>
            {formatImpact(results.operationsImpact)}
          </span>
        </div>
        <div className="p-3 bg-coffee-light rounded">
          Sustainability: <span className={getImpactClass(results.sustainabilityImpact)}>
            {formatImpact(results.sustainabilityImpact)}
          </span>
        </div>
      </div>
      
      <button 
        onClick={onNext}
        className="bg-coffee-dark text-white border-none rounded py-3 px-6 text-lg cursor-pointer hover:bg-coffee-darker transition-colors"
      >
        Next Scenario
      </button>
    </div>
  );
}
