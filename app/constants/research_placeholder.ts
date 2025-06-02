import { ResearchResponse } from "../sections/upload/types";

export const PLACEHOLDER_RESULT: ResearchResponse = {
  request: {
    statement: "Loading statement analysis...",
    source: "Analyzing source...",
    context: "Processing context...",
    datetime: new Date().toISOString(),
    country: "us",
    category: "politics"
  },
  valid_sources: "Calculating... (across multiple sources)",
  verdict: "Analyzing statement for factual accuracy and verifying claims against reliable sources...",
  status: "UNVERIFIABLE",
  correction: "Preparing corrected information if needed...",
  country: "us",
  category: "politics",
  resources_agreed: {
    total: "0%",
    count: 0,
    mainstream: 0,
    governance: 0,
    academic: 0,
    medical: 0,
    other: 0,
    major_countries: [],
    references: []
  },
  resources_disagreed: {
    total: "0%",
    count: 0,
    mainstream: 0,
    governance: 0,
    academic: 0,
    medical: 0,
    other: 0,
    major_countries: [],
    references: []
  },
  resources: [
    "Gathering verification sources...",
    "Compiling research references...", 
    "Collecting authoritative links..."
  ],
  experts: {
    critic: "Investigating potential hidden elements and examining the statement for gaps in information...",
    devil: "Exploring alternative perspectives and considering minority viewpoints that may challenge the consensus...",
    nerd: "Compiling statistical data and analyzing numerical claims for accuracy and context...",
    psychic: "Evaluating psychological motivations and potential manipulation tactics behind the statement..."
  },
  processed_at: new Date().toISOString(),
  research_method: "Processing..."
};