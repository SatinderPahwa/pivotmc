import { useState } from 'react';
import { questions, calculateResults, bandInfo, dimensionLabels } from './questions';
import type { DiagnosticResult } from './questions';
import RadarChart from './RadarChart';

export default function DiagnosticApp() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const total = questions.length;
  const question = questions[currentQ];
  const progress = ((currentQ) / total) * 100;

  function handleSelect(score: number) {
    setSelectedAnswer(score);
  }

  function handleNext() {
    if (selectedAnswer === null) return;

    const newAnswers = { ...answers, [question.id]: selectedAnswer };
    setAnswers(newAnswers);
    setSelectedAnswer(null);

    if (currentQ < total - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setResult(calculateResults(newAnswers));
    }
  }

  function handleBack() {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
      setSelectedAnswer(answers[questions[currentQ - 1].id] ?? null);
    }
  }

  function handleRestart() {
    setCurrentQ(0);
    setAnswers({});
    setResult(null);
    setSelectedAnswer(null);
  }

  // Results screen
  if (result) {
    const info = bandInfo[result.band];
    return (
      <div className="max-w-2xl mx-auto">
        {/* Band header */}
        <div className="text-center mb-6">
          <p className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: '#2388DD' }}>
            Your result: {result.band}
          </p>
          <h2 className="text-xl sm:text-2xl font-bold" style={{ color: '#1a1a2e', fontFamily: 'Lora, serif' }}>
            {info.headline}
          </h2>
          <p className="text-sm mt-2" style={{ color: '#4a4a5a' }}>
            {info.description}
          </p>
        </div>

        {/* Radar chart */}
        <div className="rounded-lg border p-4 sm:p-6 mb-6" style={{ borderColor: '#e2e8f0', background: '#f8f9fc' }}>
          <RadarChart scores={result.scores} />
        </div>

        {/* Overall score */}
        <div className="text-center mb-6">
          <p className="text-3xl font-bold" style={{ color: '#2388DD' }}>{result.overall}</p>
          <p className="text-xs" style={{ color: '#7a7a8a' }}>Overall score out of 100</p>
        </div>

        {/* CTA */}
        <div className="rounded-lg border p-5 text-center" style={{ borderColor: '#e2e8f0', background: '#f8f9fc' }}>
          <p className="text-sm font-semibold mb-2" style={{ color: '#1a1a2e' }}>{info.cta}</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <a
              href="mailto:gulati@pivotmc.com?subject=Breakthrough%20Diagnostic%20Follow-up"
              className="inline-flex items-center justify-center px-5 py-2.5 text-white text-sm font-semibold rounded-lg transition-colors"
              style={{ background: '#2388DD' }}
            >
              Email us &rarr;
            </a>
            <button
              onClick={handleRestart}
              className="inline-flex items-center justify-center px-5 py-2.5 border text-sm font-medium rounded-lg transition-colors"
              style={{ borderColor: '#e2e8f0', color: '#4a4a5a' }}
            >
              Retake diagnostic
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Question screen
  return (
    <div className="max-w-xl mx-auto">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs mb-1.5" style={{ color: '#7a7a8a' }}>
          <span>Question {currentQ + 1} of {total}</span>
          <span>{dimensionLabels[question.dimension]}</span>
        </div>
        <div className="w-full h-1.5 rounded-full" style={{ background: '#e2e8f0' }}>
          <div
            className="h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%`, background: '#2388DD' }}
          />
        </div>
      </div>

      {/* Question */}
      <h3 className="text-base sm:text-lg font-semibold mb-4" style={{ color: '#1a1a2e', fontFamily: 'Lora, serif' }}>
        {question.text}
      </h3>

      {/* Answers */}
      <div className="space-y-2 mb-6">
        {question.answers.map((answer, idx) => {
          const isSelected = selectedAnswer === answer.score;
          return (
            <button
              key={idx}
              onClick={() => handleSelect(answer.score)}
              className="w-full text-left px-4 py-3 rounded-lg border text-sm transition-all"
              style={{
                borderColor: isSelected ? '#2388DD' : '#e2e8f0',
                background: isSelected ? '#e8f2fc' : '#ffffff',
                color: '#1a1a2e',
              }}
            >
              {answer.text}
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handleBack}
          disabled={currentQ === 0}
          className="px-4 py-2 text-sm font-medium rounded-lg border transition-colors disabled:opacity-30"
          style={{ borderColor: '#e2e8f0', color: '#4a4a5a' }}
        >
          &larr; Back
        </button>
        <button
          onClick={handleNext}
          disabled={selectedAnswer === null}
          className="px-5 py-2 text-sm font-semibold rounded-lg text-white transition-colors disabled:opacity-30"
          style={{ background: selectedAnswer !== null ? '#2388DD' : '#93c5fd' }}
        >
          {currentQ === total - 1 ? 'See results' : 'Next \u2192'}
        </button>
      </div>
    </div>
  );
}
