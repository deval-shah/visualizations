import React, { useState } from 'react';
import { ArrowRight, RefreshCcw } from 'lucide-react';

const RRFVisualization = () => {
  const [step, setStep] = useState(0);
  const [k, setK] = useState(60);

  const documents = ['Doc A', 'Doc B', 'Doc C', 'Doc D', 'Doc E'];
  const retrievers = ['Dense', 'Sparse', 'Hybrid'];
  
  const rankings = {
    'Dense':  [1, 3, 2, 5, 4],
    'Sparse': [2, 1, 4, 3, 5],
    'Hybrid': [3, 2, 1, 5, 4]
  };

  const calculateRRF = (doc) => {
    return retrievers.reduce((sum, retriever) => {
      const rank = rankings[retriever][documents.indexOf(doc)];
      return sum + 1 / (k + rank);
    }, 0);
  };

  const rrf_scores = documents.map(doc => ({
    doc,
    score: calculateRRF(doc)
  })).sort((a, b) => b.score - a.score);

  const steps = [
    { title: "Initial Rankings", content: () => (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {retrievers.map(retriever => (
          <div key={retriever} className="bg-white p-4 rounded shadow">
            <h3 className="font-bold mb-2">{retriever}</h3>
            <ol className="list-decimal list-inside">
              {rankings[retriever].map((rank, index) => (
                <li key={index}>{documents[index]}</li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    )},
    { title: "RRF Calculation", content: () => (
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-bold mb-2">RRF Scores (k = {k})</h3>
        <ul>
          {documents.map(doc => (
            <li key={doc} className="mb-2">
              <strong>{doc}:</strong> {calculateRRF(doc).toFixed(4)}
              <br />
              <small>
                {retrievers.map(retriever => (
                  `1/(${k} + ${rankings[retriever][documents.indexOf(doc)]})`
                )).join(' + ')} = {calculateRRF(doc).toFixed(4)}
              </small>
            </li>
          ))}
        </ul>
      </div>
    )},
    { title: "Final Ranking", content: () => (
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-bold mb-2">Final Ranking</h3>
        <ol>
          {rrf_scores.map(({doc, score}, index) => (
            <li key={doc} className="mb-2">
              {doc} (Score: {score.toFixed(4)})
            </li>
          ))}
        </ol>
      </div>
    )}
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Interactive RRF Visualization</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          k value:
          <input
            type="number"
            value={k}
            onChange={(e) => setK(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
      </div>
      <div className="flex flex-wrap mb-4">
        {steps.map((s, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`flex-1 p-2 ${
              i === step ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
            } ${i > 0 ? 'ml-2' : ''} rounded mb-2 md:mb-0`}
          >
            {s.title}
          </button>
        ))}
      </div>
      <div className="mb-4">{steps[step].content()}</div>
      <div className="flex justify-between">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          <ArrowRight className="transform rotate-180" />
        </button>
        <button
          onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
          disabled={step === steps.length - 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          <ArrowRight />
        </button>
      </div>
      <button
        onClick={() => {setStep(0); setK(60);}}
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded flex items-center"
      >
        <RefreshCcw className="mr-2" /> Reset
      </button>
    </div>
  );
};

export default RRFVisualization;
