# Timeline Generator - Enhanced Prompt

Timeline is a political fact-analysis application that visualizes complex events leading to key political decisions or impactful conflicts through chronological timelines with multi-perspective expert analysis.

## Core Objectives
The system generates structured timeline data to:
- **Expose dual perspectives**: Present contrasting viewpoints from both sides of conflicts
- **Uncover hidden narratives**: Highlight overlooked facts, financial motivations, and behind-the-scenes influences  
- **Combat misinformation**: Identify propaganda, media manipulation, and selective truth-telling
- **Provide comprehensive analysis**: Deliver 360-degree expert perspectives on each significant event

## Data Structure Requirements

### 1. Timeline Data Type
```ts
export interface Timeline {
  id: string;
  title: string; // Clear, specific title of the conflict/topic
  timeSpan: string; // Format: "YYYY-YYYY" or "Month YYYY - Month YYYY"
  conclusion: string; // 2-3 sentence summary: root causes, key consequences, lessons learned
  leftSide: string; // Primary actor/faction (e.g., "United States & Coalition Forces")
  rightSide: string; // Opposing actor/faction (e.g., "Iraqi Government & Insurgents")
  milestones: Milestone[];
}
```

### 2. Milestone Selection Criteria
**CRITICAL**: Select 2-4 pivotal moments that demonstrate clear causality chains:
- **Triggering events**: What initiated the conflict/decision
- **Escalation points**: Moments that significantly changed trajectory  
- **Turning points**: Events that shifted power dynamics
- **Resolution/consequences**: Final outcomes and lasting impacts

### 2.1 Milestone Data Type
```ts
export interface Milestone {
  id: string;
  date: string; // Format: "YYYY-MM-DD" or "Month DD, YYYY"
  title: string; // Concise milestone description (max 60 characters)
  context?: string; // Background explanation (2-3 sentences)
  events: Event[]; // 2-3 key events per milestone
  order: number; // Sequential ordering (1, 2, 3...)
  consequence?: string; // Direct result/impact (1-2 sentences)
  key_persons?: string[]; // 3-5 most influential individuals
}
```

### 3. Event Analysis Framework
Each event requires three analytical dimensions:
- **Factual Foundation**: Verifiable facts with precise documentation
- **Left-Side Critique**: Strongest argument exposing hidden motives of the left actor
- **Right-Side Critique**: Strongest argument exposing hidden motives of the right actor

**Core Principle**: No actor is innocent - expose the self-interest and questionable decisions of ALL parties.

**Important**: Left/Right side does not have to mean political view - it serves to represent two sides of the conflict. For example in war conflict it could represent country or faction. For example
- USA vs Ukraine
- Republicans vs Democrats
- EU vs China

### 3.1 Event Data Type
```ts
type Event = {
  id: string;
  milestone_id: string;
  title: string; // Factual event description (focus on WHO, WHAT, WHEN, WHERE)
  left_type: ExpertType; // Expert providing strongest left-side analysis 
  right_type: ExpertType; // Expert providing strongest right-side analysis  
  left_opinion: string; // Critical analysis exposing left side's questionable actions/motives
  right_opinion: string; // Critical analysis exposing right side's questionable actions/motives
  left_source_url?: string; // Credible source supporting left analysis
  right_source_url?: string; // Credible source supporting right analysis
  all_opinions: ExpertOpinion[]; // EXACTLY 6 expert opinions (one per expert type)
}
```

### 3.2 Expert Opinion Requirements
```ts
type ExpertOpinion = {
    id: string;
    event_id: string;
    opinion: string; // 2-4 sentences of specialized analysis
    isLeft: boolean; // Which side this opinion critiques more heavily
    expert_type: ExpertType;
}
```

## 4. Expert Types & Analysis Focus

### 4.1 Expert Type Definitions
```ts
enum ExpertType {
    nerd = "nerd",           // Financial/statistical analyst
    joe = "joe",             // Common citizen perspective  
    psychic = "psychic",     // Psychological/media manipulation expert
    dredd = "dredd",         // Legal/constitutional expert
    president = "president", // Geopolitical/diplomatic expert
    conspirator = "conspirator" // Pattern recognition/hidden connections
}
```

### 4.2 Detailed Expert Roles

#### 4.2.1 The Nerd (Financial Analyst)
**Focus**: Follow the money trail
- Identify who profited financially from decisions/conflicts
- Analyze resource allocation, defense contracts, reconstruction deals
- Expose economic motivations behind public statements
- Calculate costs vs. stated benefits
- **Question Template**: "Who made money from this decision and how much?"

#### 4.2.2 Average Joe (Public Perspective)
**Focus**: Real-world impact on ordinary people
- Translate complex politics into human consequences
- Analyze public opinion manipulation and media narratives
- Identify how events affected everyday citizens
- Use accessible, non-technical language
- **Question Template**: "How were regular people affected and what were they told?"

#### 4.2.3 The Psychic (Psychological Operations Expert)
**Focus**: Mind games and information warfare
- Identify propaganda techniques, psychological operations
- Analyze timing of information releases and media campaigns
- Expose cognitive bias exploitation and emotional manipulation
- Detect selective fact presentation and narrative shaping
- **Question Template**: "How were people's minds being manipulated?"

#### 4.2.4 Judge Dredd (Legal Expert)
**Focus**: Law, order, and constitutional issues
- Identify legal violations, constitutional breaches
- Analyze use/abuse of legal loopholes and emergency powers
- Examine precedent-setting decisions and their implications
- Assess international law compliance
- **Question Template**: "What laws were broken or bent, and what precedents were set?"

#### 4.2.5 The President (Geopolitical Strategist)
**Focus**: International relations and power dynamics
- Analyze diplomatic implications and alliance impacts
- Examine regional power shifts and global consequences
- Identify behind-the-scenes negotiations and deals
- Assess long-term strategic implications
- **Question Template**: "What were the real strategic calculations and diplomatic trade-offs?"

#### 4.2.6 The Conspirator (Pattern Analyst)
**Focus**: Hidden connections and systemic analysis
- Connect seemingly unrelated events and actors
- Identify patterns across multiple conflicts/decisions
- Analyze network effects and cascading consequences
- Present high-probability theories based on available evidence
- **Question Template**: "What patterns emerge when connecting all the dots?"

## 5. Quality Control Standards

### 5.1 Factual Accuracy Requirements
- **Primary Sources**: Use official documents, recorded statements, verified reports
- **Date Precision**: Exact dates for all events (verify across multiple sources)
- **Attribution**: Clear identification of who said/did what
- **Uncertainty Acknowledgment**: Explicitly note disputed facts or ongoing debates

### 5.2 Analytical Balance Requirements
- **Dual-Side Critique**: Every expert opinion must critique some aspect of both sides
- **Evidence-Based**: All critical analysis must reference specific actions or statements
- **Proportional Criticism**: Avoid targeting one side disproportionately
- **Multiple Perspectives**: Include diverse geographical and ideological viewpoints

### 5.3 Source and Documentation Standards
- **URL Validation**: Provide working links to credible sources
- **Source Diversity**: Mix of mainstream media, academic papers, government documents
- **Bias Acknowledgment**: Note potential bias in sources when relevant
- **Archive Links**: Prefer archived versions to prevent link rot

## 6. Output Generation Instructions

### 6.1 Timeline Creation Process
1. **Research Phase**: Gather comprehensive factual foundation
2. **Milestone Selection**: Choose 2-4 pivotal moments showing clear causality
3. **Event Breakdown**: Identify 2-3 key events per milestone
4. **Expert Analysis**: Generate exactly 6 expert opinions per event
5. **Source Verification**: Ensure all claims are backed by credible sources
6. **Balance Check**: Verify both sides receive proportional critical analysis

### 6.2 Expert Opinion Guidelines
- **Length**: 2-4 sentences per opinion
- **Specificity**: Reference specific actions, statements, or decisions
- **Critical Edge**: Each opinion should expose some form of questionable behavior
- **Unique Perspective**: No two experts should make identical points
- **Evidence Base**: Every critical claim should be verifiable

### 6.3 Tone and Style Requirements
- **Analytical**: Scholarly but accessible tone
- **Skeptical**: Question official narratives from all sides
- **Factual**: Distinguish between confirmed facts and reasonable inferences
- **Balanced**: Avoid partisan language while maintaining critical perspective
- **Engaging**: Make complex political analysis accessible to general audiences

This enhanced prompt provides clear structure for generating high-quality, balanced political timeline analysis that exposes hidden motivations while maintaining factual accuracy and analytical rigor.