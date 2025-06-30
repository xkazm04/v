Please research topic and generate output according to instructions below

Topic: Sudanese civil war 2023-2025

Instructions:
# Timeline Generator 
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
  consequences: string // Free text in markdown  format - Described in 1.1
  timeSpan: string; // Format: "YYYY-YYYY" or "Month YYYY - Month YYYY"
  conclusion: string; // 2-3 sentence summary: root causes, key consequences, lessons learned
  leftSide: string; // Primary actor/faction (e.g., "United States & Coalition Forces")
  rightSide: string; // Opposing actor/faction (e.g., "Iraqi Government & Insurgents")
  milestones: Milestone[];
}
```


### 1.1 Consequences
Major consequences to overview the conflict in numbers. Data could be different for each request topic

example (Iraq war) output in markdown:
**Total War Costs:**
- **US Government Spending:** $800+ billion
- **Contractor Revenue:** $138+ billion to private companies
- **Top Contractor:** KBR/Halliburton ($39.5 billion)
- **Reconstruction Waste:** Estimated $60 billion lost to fraud/waste

**Human Casualties:**
- **US Military Deaths:** ~4,500
- **US Military Wounded:** ~32,000  
- **Iraqi Civilian Deaths:** 100,000-600,000+ (disputed)
- **Iraqi Refugees/Displaced:** 4+ million

**Corporate Beneficiaries:**
- **KBR/Halliburton:** $39.5 billion (oil infrastructure, logistics)
- **Agility Logistics:** $7.2 billion (Kuwait-based logistics)
- **Kuwait Petroleum Corp:** $6.3 billion (fuel supplies)
- **Bechtel:** $2.4 billion (reconstruction projects)
- **DynCorp:** Major police training contracts

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
  key_persons?: Person[]; // 3-5 most influential individuals
}

type Person = {
  name: string;
  role: string
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

# Important - Output format
Final output MUST follow schema defined throughout the instructions. 

Example of the output:
```json
{
  "id": "iraq-war-2003-2011",
  "title": "Iraq War: From WMD Claims to Occupation",
  "timeSpan": "2001-2011",
  "consequences": "**Total War Costs:**
        - **US Government Spending:** $800+ billion
        - **Contractor Revenue:** $138+ billion to private companies
        - **Top Contractor:** KBR/Halliburton ($39.5 billion)
        - **Reconstruction Waste:** Estimated $60 billion lost to fraud/waste

        **Human Casualties:**
        - **US Military Deaths:** ~4,
    500
        - **US Military Wounded:** ~32,
    000  
        - **Iraqi Civilian Deaths:** 100,
    000-600,
    000+ (disputed)
        - **Iraqi Refugees/Displaced:** 4+ million

        **Corporate Beneficiaries:**
        - **KBR/Halliburton:** $39.5 billion (oil infrastructure, logistics)
        - **Agility Logistics:** $7.2 billion (Kuwait-based logistics)
        - **Kuwait Petroleum Corp:** $6.3 billion (fuel supplies)
        - **Bechtel:** $2.4 billion (reconstruction projects)
        - **DynCorp:** Major police training contracts",
  "conclusion": "The Iraq War stemmed from post-9/11 geopolitical ambitions masked as WMD prevention, resulting in regional destabilization, hundreds of thousands of casualties, and massive financial costs while achieving few stated objectives. The conflict exposed how intelligence can be manipulated to justify predetermined policy goals.",
  "leftSide": "United States & Coalition Forces",
  "rightSide": "Iraqi Government & Insurgent Forces",
  "milestones": [
    {
      "id": "wmd-intelligence-buildup",
      "date": "2002-09-01",
      "title": "WMD Intelligence Campaign",
      "context": "Following 9/11, the Bush administration began building a case for military action against Iraq, claiming Saddam Hussein possessed weapons of mass destruction that posed an imminent threat to regional and global security.",
      "order": 1,
      "consequence": "Created public and international support for military intervention despite significant skepticism from UN weapons inspectors and several allied nations.",
      "key_persons": [
        { "name": "Donald Rumsfeld", "role": "Secretary of Defense" },
        { "name": "George W. Bush", "role": "President of the United States" },
        { "name": "Paul Bremer", "role": "Administrator of the Coalition Provisional Authority" },
        { "name": "Saddam Hussein", "role": "President of Iraq" },
        { "name": "Iraqi Insurgents", "role": "Various groups opposing occupation" }
      ],
      "events": [
        {
          "id": "bush-un-speech-2002",
          "milestone_id": "wmd-intelligence-buildup",
          "title": "Bush addresses UN General Assembly claiming Iraq has WMDs and poses imminent threat",
          "left_type": "psychic",
          "right_type": "dredd", 
          "left_opinion": "The Bush administration orchestrated a sophisticated propaganda campaign, using carefully selected intelligence fragments while suppressing contradictory evidence. The timing coincided with midterm elections, suggesting domestic political calculations influenced national security messaging.",
          "right_opinion": "Saddam Hussein's regime deliberately maintained ambiguity about WMD capabilities as a deterrent strategy, refusing full cooperation with UN inspectors and maintaining dual-use facilities that could be interpreted as weapons programs.",
          "left_source_url": "https://www.un.org/webcast/ga/57/statements/020912usaE.htm",
          "right_source_url": "https://www.un.org/Depts/unmovic/documents/1284.pdf",
          "all_opinions": [
            {
              "id": "bush-un-nerd-1",
              "event_id": "bush-un-speech-2002",
              "opinion": "Defense contractors saw immediate stock price increases following Bush's speech, with Halliburton, Lockheed Martin, and Raytheon gaining billions in market value. The speech triggered massive defense spending authorization requests that would ultimately cost taxpayers over $2 trillion.",
              "isLeft": true,
              "expert_type": "nerd"
            },
            {
              "id": "bush-un-joe-1", 
              "event_id": "bush-un-speech-2002",
              "opinion": "Most Americans, still traumatized by 9/11, trusted their president's claims about imminent threats. However, millions globally protested the rush to war, sensing the evidence was thin and the motivations questionable.",
              "isLeft": true,
              "expert_type": "joe"
            },
            {
              "id": "bush-un-psychic-1",
              "event_id": "bush-un-speech-2002", 
              "opinion": "The speech employed classic fear-based persuasion techniques, connecting 9/11 trauma to Iraqi threats without establishing direct links. The administration amplified uncertainty into certainty, using definitive language about 'gathering threats' despite intelligence community disagreements.",
              "isLeft": true,
              "expert_type": "psychic"
            },
            {
              "id": "bush-un-dredd-1",
              "event_id": "bush-un-speech-2002",
              "opinion": "The legal basis for preemptive war was constitutionally questionable, as Congress hadn't declared war and UN authorization was absent. However, Saddam's violations of previous UN resolutions and obstruction of weapons inspections provided some legal justification.",
              "isLeft": false,
              "expert_type": "dredd"
            },
            {
              "id": "bush-un-president-1",
              "event_id": "bush-un-speech-2002",
              "opinion": "The speech aimed to isolate Iraq diplomatically while signaling American resolve to allies and adversaries. However, it strained relationships with France, Germany, and Russia, who viewed the intelligence as insufficient for military action.",
              "isLeft": true,
              "expert_type": "president"
            },
            {
              "id": "bush-un-conspirator-1",
              "event_id": "bush-un-speech-2002",
              "opinion": "The speech was part of a broader 'Project for a New American Century' agenda to reshape the Middle East. Key neoconservatives had advocated regime change in Iraq since the 1990s, using 9/11 as the catalyst for predetermined policies.",
              "isLeft": true,
              "expert_type": "conspirator"
            }
          ]
        },
        {
          "id": "powell-un-presentation",
          "milestone_id": "wmd-intelligence-buildup", 
          "title": "Colin Powell presents WMD evidence to UN Security Council with vials and satellite photos",
          "left_type": "psychic",
          "right_type": "president",
          "left_opinion": "Powell's presentation was a masterclass in visual manipulation, using props, satellite imagery, and intercepted communications taken out of context. The CIA later admitted much of the evidence was fabricated or misinterpreted, yet Powell's reputation gave it undeserved credibility.",
          "right_opinion": "Iraqi officials knew they had eliminated WMD stockpiles but maintained facilities and documentation that could be misinterpreted, calculating that ambiguity would deter both internal uprisings and external threats from Iran.",
          "left_source_url": "https://www.un.org/press/en/2003/sc7658.doc.htm",
          "right_source_url": "https://www.cia.gov/library/reports/general-reports-1/iraq_wmd_2004/",
          "all_opinions": [
            {
              "id": "powell-nerd-1",
              "event_id": "powell-un-presentation",
              "opinion": "The presentation cost Powell his political future but secured billions in military contracts. Reconstruction companies like Bechtel and Halliburton had already positioned themselves for post-war contracts, suggesting the outcome was predetermined regardless of evidence quality.",
              "isLeft": true,
              "expert_type": "nerd"
            },
            {
              "id": "powell-joe-1",
              "event_id": "powell-un-presentation", 
              "opinion": "Powell was the most trusted figure in the Bush administration, so his presentation convinced many skeptical Americans. People thought 'if Colin Powell says it, it must be true' - his credibility was weaponized to sell the war to a divided public.",
              "isLeft": true,
              "expert_type": "joe"
            },
            {
              "id": "powell-psychic-1",
              "event_id": "powell-un-presentation",
              "opinion": "The presentation used sophisticated visual rhetoric - satellite photos, audio recordings, and physical props created an illusion of overwhelming evidence. The performance was designed for television audiences, not UN delegates who remained largely unconvinced.",
              "isLeft": true,
              "expert_type": "psychic"
            },
            {
              "id": "powell-dredd-1",
              "event_id": "powell-un-presentation",
              "opinion": "Powell presented intelligence that hadn't been verified through proper legal channels, essentially making a prosecutor's case without allowing cross-examination. However, Iraq's documented history of chemical weapons use and UN resolution violations provided some legal foundation.",
              "isLeft": false,
              "expert_type": "dredd"
            },
            {
              "id": "powell-president-1",
              "event_id": "powell-un-presentation",
              "opinion": "The presentation was meant to provide diplomatic cover for military action, giving allies justification to support or at least not oppose the invasion. Yet it backfired diplomatically, with France, Germany, and Russia becoming more opposed to unilateral action.",
              "isLeft": true,
              "expert_type": "president"
            },
            {
              "id": "powell-conspirator-1",
              "event_id": "powell-un-presentation",
              "opinion": "Powell was deliberately kept out of the loop on the intelligence fabrication, chosen precisely because his reputation would sell a predetermined policy. His later regret suggests he was used as an unwitting front man for more calculating officials.",
              "isLeft": true,
              "expert_type": "conspirator"
            }
          ]
        }
      ]
    },
  ]
}
```

