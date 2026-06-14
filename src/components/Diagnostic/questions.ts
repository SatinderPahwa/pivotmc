export type Dimension =
  | 'lssMaturity'
  | 'resultsTrajectory'
  | 'contradictionExposure'
  | 'qualitySystemRisk'
  | 'changeReadiness'
  | 'innovationPipeline';

export const dimensionLabels: Record<Dimension, string> = {
  lssMaturity: 'LSS Maturity',
  resultsTrajectory: 'Results Trajectory',
  contradictionExposure: 'Contradiction Exposure',
  qualitySystemRisk: 'Quality-System Risk',
  changeReadiness: 'Change Readiness',
  innovationPipeline: 'Innovation Pipeline',
};

export interface Answer {
  text: string;
  score: number;
}

export interface Question {
  id: number;
  dimension: Dimension;
  text: string;
  answers: Answer[];
}

export const questions: Question[] = [
  // LSS Maturity (2 questions)
  {
    id: 1,
    dimension: 'lssMaturity',
    text: 'How would you describe your Lean Six Sigma deployment?',
    answers: [
      { text: 'No formal program in place', score: 0 },
      { text: 'Pilot projects in a few areas', score: 33 },
      { text: 'Deployed across most functions', score: 66 },
      { text: 'Enterprise-wide with certified belts at all levels', score: 100 },
    ],
  },
  {
    id: 2,
    dimension: 'lssMaturity',
    text: 'How many staff are trained or certified in LSS methods?',
    answers: [
      { text: 'Fewer than 5', score: 0 },
      { text: '5–20 across the organization', score: 33 },
      { text: '20–50 with active project work', score: 66 },
      { text: '50+ with an internal training pipeline', score: 100 },
    ],
  },

  // Results Trajectory (2 questions)
  {
    id: 3,
    dimension: 'resultsTrajectory',
    text: 'Over the last 12 months, your improvement savings have…',
    answers: [
      { text: 'Declined or stopped being tracked', score: 0 },
      { text: 'Stayed roughly flat', score: 33 },
      { text: 'Grown modestly', score: 66 },
      { text: 'Accelerated significantly', score: 100 },
    ],
  },
  {
    id: 4,
    dimension: 'resultsTrajectory',
    text: 'Are your improvement projects delivering diminishing returns?',
    answers: [
      { text: 'Yes — the easy wins are gone', score: 0 },
      { text: 'Some projects still pay off, but fewer each year', score: 33 },
      { text: 'Returns are steady but not growing', score: 66 },
      { text: 'No — each cycle delivers more than the last', score: 100 },
    ],
  },

  // Contradiction Exposure (2 questions)
  {
    id: 5,
    dimension: 'contradictionExposure',
    text: 'How often does your team face trade-offs it can\'t optimize away (e.g. faster vs. cheaper, lighter vs. stronger)?',
    answers: [
      { text: 'Rarely — most problems yield to standard tools', score: 0 },
      { text: 'Occasionally on complex projects', score: 33 },
      { text: 'Frequently — we compromise more than we\'d like', score: 66 },
      { text: 'Constantly — it\'s the main barrier to improvement', score: 100 },
    ],
  },
  {
    id: 6,
    dimension: 'contradictionExposure',
    text: 'When you hit a trade-off, what typically happens?',
    answers: [
      { text: 'We pick the lesser evil and move on', score: 100 },
      { text: 'We escalate for a management decision', score: 66 },
      { text: 'We invest more analysis time but usually still compromise', score: 33 },
      { text: 'We have structured methods to dissolve contradictions', score: 0 },
    ],
  },

  // Quality-System Risk (1 question)
  {
    id: 7,
    dimension: 'qualitySystemRisk',
    text: 'How would you rate your audit and CAPA posture?',
    answers: [
      { text: 'Overdue audits and growing CAPA backlog', score: 0 },
      { text: 'Meeting minimum requirements but stretched thin', score: 33 },
      { text: 'Solid — few findings, manageable backlog', score: 66 },
      { text: 'Exemplary — proactive, zero major findings', score: 100 },
    ],
  },

  // Change Readiness (1 question)
  {
    id: 8,
    dimension: 'changeReadiness',
    text: 'How aligned is your leadership on continuous improvement priorities?',
    answers: [
      { text: 'CI is seen as a cost, not a strategy', score: 0 },
      { text: 'Supportive in principle but not actively involved', score: 33 },
      { text: 'Engaged — reviews results and removes blockers', score: 66 },
      { text: 'CI is embedded in strategy; leadership champions it', score: 100 },
    ],
  },

  // Innovation Pipeline (2 questions)
  {
    id: 9,
    dimension: 'innovationPipeline',
    text: 'Does your organization have a structured approach to product or process innovation?',
    answers: [
      { text: 'Innovation is ad hoc or reactive', score: 0 },
      { text: 'Some R&D process, but not linked to operations', score: 33 },
      { text: 'Formal pipeline with stage gates', score: 66 },
      { text: 'Structured innovation methods (TRIZ, Design Thinking, etc.) actively used', score: 100 },
    ],
  },
  {
    id: 10,
    dimension: 'innovationPipeline',
    text: 'How confident are you in your ability to solve novel technical problems?',
    answers: [
      { text: 'We usually outsource or live with limitations', score: 0 },
      { text: 'We can solve some, but often hit dead ends', score: 33 },
      { text: 'Good track record, but it depends on key individuals', score: 66 },
      { text: 'We have repeatable methods that anyone can apply', score: 100 },
    ],
  },
];

export type Band = 'Foundational' | 'Developing' | 'Plateaued' | 'Breakthrough-ready';

export interface DiagnosticResult {
  scores: Record<Dimension, number>;
  overall: number;
  band: Band;
}

export function calculateResults(answers: Record<number, number>): DiagnosticResult {
  const dimensionScores: Record<Dimension, number[]> = {
    lssMaturity: [],
    resultsTrajectory: [],
    contradictionExposure: [],
    qualitySystemRisk: [],
    changeReadiness: [],
    innovationPipeline: [],
  };

  for (const q of questions) {
    const score = answers[q.id];
    if (score !== undefined) {
      dimensionScores[q.dimension].push(score);
    }
  }

  const scores = {} as Record<Dimension, number>;
  for (const [dim, vals] of Object.entries(dimensionScores)) {
    scores[dim as Dimension] = vals.length > 0
      ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
      : 0;
  }

  const overall = Math.round(
    Object.values(scores).reduce((a, b) => a + b, 0) / 6
  );

  let band: Band;
  const { lssMaturity, resultsTrajectory, contradictionExposure } = scores;

  if (lssMaturity >= 66 && resultsTrajectory <= 33 && contradictionExposure >= 66) {
    band = 'Plateaued';
  } else if (overall >= 75) {
    band = 'Breakthrough-ready';
  } else if (overall >= 45) {
    band = 'Developing';
  } else {
    band = 'Foundational';
  }

  return { scores, overall, band };
}

export const bandInfo: Record<Band, { headline: string; description: string; cta: string }> = {
  Foundational: {
    headline: 'Your program is building foundations.',
    description: 'Focus on deploying core LSS capabilities and building leadership alignment before tackling advanced methods.',
    cta: 'Talk to us about accelerating your foundation.',
  },
  Developing: {
    headline: 'Your program is gaining momentum.',
    description: 'You have traction but haven\'t yet hit the ceiling. Now is the time to build the innovation capability that prevents a future plateau.',
    cta: 'Learn how TRIZ prevents the plateau before it hits.',
  },
  Plateaued: {
    headline: 'Your program is ready for TRIZ.',
    description: 'High maturity, flattening returns, clear contradictions — exactly where structured innovation breaks through. This is the most common profile we see in our clients.',
    cta: 'Book a call to discuss your breakthrough.',
  },
  'Breakthrough-ready': {
    headline: 'Your program is operating at a high level.',
    description: 'Strong across all dimensions. The question now is: what\'s the next constraint to dissolve?',
    cta: 'Let\'s identify your next breakthrough together.',
  },
};
