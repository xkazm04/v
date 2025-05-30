type Diagram = {
  id: string;
  title: string;
  question: string;
  dimensionTopTitle: string;
  dimensionBottomTitle: string;
  milestones: Milestone[];
};

export type Milestone = {
  id: string;
  date: string;
  events: Event[];
  order: number;
  isTop: boolean;
};

type Event = {
  id: string;
  milestoneId: string;
  title: string;
  description: string;
  text_1?: string;
  text_2?: string;
  text_3?: string;
  text_4?: string;
  reference_url?: string;
  order: number;
};

export const sampleDiagram: Diagram = {
  id: "diagram-1",
  title: "Fact-Checking Political Misinformation Timeline",
  question: "How have major political misinformation campaigns evolved and been debunked over time?",
  dimensionTopTitle: "Economic Dimension",
  dimensionBottomTitle: "Historical Facts",
  milestones: [
    {
      id: "milestone-1",
      date: "1938",
      events: [
        {
          id: "event-1",
          milestoneId: "milestone-1",
          title: "War of the Worlds Radio Broadcast Panic",
          description: "Orson Welles' radio adaptation of H.G. Wells' 'War of the Worlds' was presented as a series of news bulletins, leading some listeners to believe that Earth was actually being invaded by Martians. While the panic was later exaggerated by newspapers, it demonstrated the power of media manipulation.",
          text_1: "The supposed mass panic was largely fabricated by newspapers seeking to discredit radio as a news medium. Critical analysis shows only scattered reports of genuine fear, not widespread hysteria.",
          text_2: "Newspaper industry was losing advertising revenue to radio. Creating the panic narrative served to undermine radio's credibility as a news source and protect print media's economic interests.",
          text_3: "People just got confused because they tuned in late and missed the introduction. Simple case of not paying attention to the whole story.",
          text_4: "Classic example of authority manipulation - using realistic news format triggers automatic trust responses. The authoritative voice patterns mimicked trusted news anchors, bypassing critical thinking.",
          reference_url: "https://www.snopes.com/fact-check/war-worlds-broadcast/",
          order: 1
        }
      ],
      order: 1,
      isTop: true
    },
    {
      id: "milestone-2",
      date: "1950s",
      events: [
        {
          id: "event-2",
          milestoneId: "milestone-2",
          title: "McCarthyism Communist Infiltration Claims",
          description: "Senator Joseph McCarthy claimed to have a list of communist infiltrators in the U.S. government. His accusations were largely unfounded and destroyed many careers before being discredited. The exact number of supposed communists changed frequently, revealing the fabricated nature of his claims.",
          text_1: "McCarthy's evidence was consistently vague and unsubstantiated. His refusal to provide concrete proof and constantly changing numbers indicate a politically motivated witch hunt rather than legitimate security concerns.",
          text_2: "Post-war anxiety created a market for security theater. McCarthy's crusade attracted funding, media attention, and political capital while defense contractors benefited from increased security spending.",
          text_3: "People were scared after WWII and just wanted someone to blame for their problems. Communists were an easy target because they seemed foreign and threatening.",
          text_4: "Textbook scapegoating and in-group/out-group manipulation. Created an us-versus-them mentality where questioning McCarthy meant being labeled a communist sympathizer, silencing opposition through fear.",
          reference_url: "https://www.history.com/topics/cold-war/joseph-mccarthy",
          order: 1
        }
      ],
      order: 2,
      isTop: false
    },
    {
      id: "milestone-3",
      date: "2003",
      events: [
        {
          id: "event-3",
          milestoneId: "milestone-3",
          title: "Iraq WMD Claims",
          description: "The Bush administration claimed Iraq possessed weapons of mass destruction, justifying the 2003 invasion. Extensive post-invasion investigations found no WMDs. Intelligence was cherry-picked and manipulated to support predetermined policy decisions.",
          text_1: "Intelligence agencies expressed doubts about WMD claims, but dissenting voices were marginalized. The administration presented uncertain intelligence as definitive fact, violating basic analytical standards.",
          text_2: "War generated massive profits for defense contractors, oil companies, and reconstruction firms. Halliburton alone received over $39 billion in Iraq-related contracts, often without competitive bidding.",
          text_3: "After 9/11, everyone was worried about terrorism. Saddam Hussein was a bad guy, so it made sense to think he might have dangerous weapons and team up with terrorists.",
          text_4: "Manufactured urgency and fear-based decision making. Used 9/11 trauma to bypass rational deliberation, while 'dodgy dossier' techniques made weak evidence appear compelling through confident presentation.",
          reference_url: "https://www.factcheck.org/2008/02/no-wmds-in-iraq/",
          order: 1
        },
        {
          id: "event-4",
          milestoneId: "milestone-3",
          title: "Yellow Cake Uranium Niger Documents",
          description: "Forged documents claimed Iraq was trying to purchase uranium from Niger. Despite being debunked by intelligence agencies, these documents were cited in Bush's State of the Union address as evidence of Iraq's nuclear ambitions.",
          text_1: "The documents contained obvious forgeries - wrong official names, outdated letterheads, and suspicious timing. Intelligence services quickly identified them as fake, yet they continued to be used politically.",
          text_2: "Nuclear threat narrative justified higher military budgets and emergency spending powers. Fear of nuclear terrorism opened funding streams that conventional threats couldn't access.",
          text_3: "Politicians probably just got bad information from their advisors and repeated it without checking. Happens all the time in government.",
          text_4: "Repetition of false claims despite debunking - classic 'illusory truth effect.' When people hear something multiple times, they start believing it regardless of its accuracy.",
          reference_url: "https://www.theguardian.com/world/2005/aug/24/usa.iraq",
          order: 2
        }
      ],
      order: 3,
      isTop: true
    },
    {
      id: "milestone-4",
      date: "2016",
      events: [
        {
          id: "event-5",
          milestoneId: "milestone-4",
          title: "Pizzagate Conspiracy Theory",
          description: "False claims spread on social media alleged that a Washington D.C. pizza restaurant was the center of a child trafficking ring involving prominent Democrats. The conspiracy led to an armed individual investigating the restaurant, finding no evidence of the alleged crimes.",
          text_1: "Zero credible evidence supported these claims. The 'coded messages' were normal business communications misinterpreted through confirmation bias. Investigation by armed vigilante proved the allegations baseless.",
          text_2: "Viral misinformation drives engagement, generating ad revenue for platforms and content creators. Political operatives exploit these algorithms to amplify divisive content during election cycles.",
          text_3: "People saw weird emails and connected dots that weren't really there. Social media made it easy for rumors to spread faster than fact-checkers could debunk them.",
          text_4: "Conspiracy thinking exploits pattern-seeking behavior and parental protective instincts. Child endangerment triggers emotional responses that bypass logical analysis, making people more susceptible to manipulation.",
          reference_url: "https://www.bbc.com/news/world-us-canada-38156500",
          order: 1
        },
        {
          id: "event-6",
          milestoneId: "milestone-4",
          title: "2016 Election 'Rigged' Claims",
          description: "Before the election, claims were made that the voting system was rigged and fraudulent, despite no evidence of widespread fraud. These claims undermined confidence in democratic institutions and were later repeated in 2020 with similar lack of evidence.",
          text_1: "Election security experts and bipartisan election officials confirmed the integrity of voting systems. Isolated incidents of fraud exist in every election but at statistically insignificant levels that don't affect outcomes.",
          text_2: "Questioning election integrity serves to suppress voter turnout and justify restrictive voting laws that benefit certain political interests while generating fundraising opportunities.",
          text_3: "Politics is messy and people don't trust politicians, so when someone says elections are rigged, it confirms what many already suspected about corruption in government.",
          text_4: "Preemptive delegitimization strategy - by claiming fraud before it happens, creates cognitive framework where any loss can be attributed to cheating rather than voter rejection.",
          reference_url: "https://www.reuters.com/article/us-usa-election-fraud/explainer-despite-trump-claims-voter-fraud-is-extremely-rare-here-is-how-u-s-elections-are-protected-idUSKBN2601HG",
          order: 2
        }
      ],
      order: 4,
      isTop: false
    },
    {
      id: "milestone-5",
      date: "2020",
      events: [
        {
          id: "event-7",
          milestoneId: "milestone-5",
          title: "COVID-19 Lab Origin Conspiracy",
          description: "Claims that COVID-19 was engineered in a Chinese laboratory were initially dismissed but later gained traction. While the lab leak theory remains unproven, early dismissals were often politically motivated rather than scientifically based, showing how political polarization affects fact-checking.",
          text_1: "Scientific consensus evolved from dismissing lab leak as conspiracy theory to acknowledging it as possible but unproven. Early political contamination of the question hindered objective investigation.",
          text_2: "Pandemic restrictions created economic winners and losers. Blaming China deflected from domestic policy failures while serving geopolitical interests in trade and military competition.",
          text_3: "Virus came from somewhere in China, lab is in China studying viruses, so it's natural people would think they're connected. Coincidences happen but people look for explanations.",
          text_4: "Xenophobic scapegoating mixed with legitimate scientific questions. Political polarization caused both knee-jerk dismissal and conspiracy amplification, preventing rational evaluation.",
          reference_url: "https://www.factcheck.org/2021/05/the-wuhan-lab-and-the-gain-of-function-disagreement/",
          order: 1
        },
        {
          id: "event-8",
          milestoneId: "milestone-5",
          title: "Vaccine Microchip Tracking Claims",
          description: "False claims spread that COVID-19 vaccines contained microchips for tracking people. These theories were completely unfounded, with no physical evidence and no technological basis, yet gained significant traction on social media platforms.",
          text_1: "Microchip claims lack any scientific basis. Vaccine ingredients are publicly available, manufacturing is heavily regulated, and the technology described doesn't exist in injectable form.",
          text_2: "Anti-vaccine content generates significant engagement and monetization opportunities for influencers. Alternative health product sales often accompany vaccine misinformation campaigns.",
          text_3: "People already carry smartphones that track everything, so worrying about vaccine chips doesn't make much sense when you think about it logically.",
          text_4: "Exploits existing distrust of authority and technology fears. The tracking narrative appeals to loss of control anxieties while providing simple explanation for complex societal changes.",
          reference_url: "https://www.reuters.com/article/uk-factcheck-coronavirus-bill-gates-mic/false-claim-bill-gates-planning-to-use-microchip-implants-to-fight-coronavirus-idUSKBN21I3EC",
          order: 2
        }
      ],
      order: 5,
      isTop: true
    }
  ]
};