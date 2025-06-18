export interface Timeline {
  id: string;
  title: string; // Title of the topic
  timeSpan: string; // e.g., "2020-2023"
  conclusion: string; // Conclusion of the topic key question, verdict about the topic causality - why it happened and what are the consequences
  leftSide: string; // Actor #1 in the topic - country, political party, person, etc.
  rightSide: string; // Actor #2 in the topic - country, political party, person, etc.
  milestones: Milestone[];
};


// Chronological timeline of events. Each milestone represents a key point in the story of the timeline
export interface Milestone {
  id: string;
  date: string;
  title: string;
  context?: string; // Context of the milestone, e.g., "The event that started the war"
  events: EventType[];
  order: number;
  consequence?: string; // Consequence of the milestone, e.g., "The war started"
  key_persons?: string[]; // Key persons involved in the milestone, e.g., "John Doe, Jane Smith"
};

export type EventType = {
  id: string;
  milestone_id: string;
  title: string; // Factual information of the event. Focus on verifiable facts, documentation, and empirical evidence
  left_type: ExpertType; // Expert type of the strongest left opinion
  right_type: ExpertType; // Expert type of the strongest right opinion
  left_opinion: string; // The strongest opinion exposing the left side of the conflict
  right_opinion: string; // The strongest opinion exposing the right side of the conflict
  left_source_url?: string; // Source URL for the left opinion, e.g., "https://example.com/article1"
  right_source_url?: string; // Source URL for the right opinion, e.g., "https://example.com/article2"
  all_opinions: ExpertOpinion[]; // Set with exactly 6 analyzed expert argumenets LLM finds from any perspective
};

export type ExpertOpinion = {
    id: string
    event_id: string
    opinion: string
    isLeft: boolean // Side of the opinion
    expert_type: ExpertType
}



// Prompt, each expert type is communicated as a quote from a person with deep opinion in specific area
// The goal to debunk unknown facts, expose hiddent turh, highlight the fact of dishonesty and past lies.

// Enum with perspectives, which can be provied to the event
enum ExpertType {
    nerd = "nerd", 
    joe = "joe",
    psychic = "psychic",
    dredd = "dredd",
    president = "president", 
    conspirator = "conspirator"
}