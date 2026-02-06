export interface MetricBullet {
  label: string;
  before: number;
  after: number;
  unit: string;
  direction: "increase" | "decrease";
  summary: string;
}

export interface ProblemBullet {
  issue: string;
  outcome: string;
}

export interface CaseStudyData {
  client: string;
  industry: string;
  durationLabel: string;
  heroStatement: string;
  challengeSummary: string;
  problemBullets: ProblemBullet[];
  responseBullets: string[];
  metricBullets: MetricBullet[];
  quote: string;
  quoteAttribution: string;
  ctaTitle: string;
  ctaSubtitle: string;
}

export const CASE_STUDY_DATA: CaseStudyData = {
  client: "1440",
  industry: "Email media and audience growth",
  durationLabel: "May 2024 - Jan 2025",
  heroStatement:
    "How 1440 turned channel confusion into confident scaling with Blue Alpha's action system.",
  challengeSummary:
    "Paid, organic, and quality signals lived in separate systems, making channel-level decisions slower and less reliable.",
  problemBullets: [
    {
      issue: "MMM readouts and platform attribution often pointed to different winners.",
      outcome: "Budget decisions were delayed because teams could not isolate true incremental impact.",
    },
    {
      issue: "Quality outcomes were not tightly linked to channel-level spend curves.",
      outcome: "Channels with weak incrementality kept receiving spend despite mixed business outcomes.",
    },
    {
      issue: "Organic social contribution was hidden inside unexplained baseline attribution.",
      outcome: "Paid social looked less efficient than it actually was, muting confidence to scale.",
    },
  ],
  responseBullets: [
    "Built a Bayesian MMM in Blue Alpha combining spend, outcome quality, and seasonality.",
    "Shifted from quarterly updates to weekly model refreshes tied to campaign actions.",
    "Used the accidental Meta outage as a causal stress test to validate channel signal.",
    "Created a Digest Organic layer to separate social-driven baseline lift from paid effects.",
    "Reallocated spend by insight: reduced low-return channels and scaled higher-confidence Meta activity.",
  ],
  metricBullets: [
    {
      label: "Model refresh cadence",
      before: 13,
      after: 1,
      unit: " weeks",
      direction: "decrease",
      summary: "1440 moved from quarterly model snapshots to weekly decision cycles.",
    },
    {
      label: "Organic social share of baseline attribution",
      before: 0,
      after: 20,
      unit: "%",
      direction: "increase",
      summary: "Blue Alpha surfaced that organic social explained about one-fifth of prior unexplained baseline.",
    },
    {
      label: "Facebook paid over-attribution",
      before: 100,
      after: 85,
      unit: " index",
      direction: "decrease",
      summary: "Adding organic social context reduced inflated paid credit by roughly 15%.",
    },
  ],
  quote:
    "Blue Alpha helped us stop guessing and start acting weekly with confidence in what was really driving outcomes.",
  quoteAttribution: "Erika Burghardt, Marketing at 1440",
  ctaTitle: "Turn attribution noise into confident weekly decisions.",
  ctaSubtitle:
    "See the full breakdown at bluealpha.ai/case-studies/1440 and adapt the same playbook to your growth model.",
};
