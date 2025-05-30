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
  title: "Technology Evolution Timeline",
  question: "How has technology evolved over time?",
  dimensionTopTitle: "Hardware Innovations",
  dimensionBottomTitle: "Software Innovations",
  milestones: [
    {
      id: "milestone-1",
      date: "1990",
      events: [
        {
          id: "event-1",
          milestoneId: "milestone-1",
          title: "World Wide Web Created",
          description: "The World Wide Web (WWW or simply the Web[1]) is an information system that enables content sharing over the Internet through user-friendly ways meant to appeal to users beyond IT specialists and hobbyists.[2] It allows documents and other web resources to be accessed over the Internet according to specific rules of the Hypertext Transfer Protocol (HTTP).[3]",
          text_1: "Hypertext Transfer Protocol",
          text_2: "HTML",
          text_3: "CERN",
          text_4: "Information System",
          reference_url: "https://example.com/www",
          order: 1
        },
        {
          id: "event-2",
          milestoneId: "milestone-1",
          title: "First Web Browser",
          description: "The first web browser, WorldWideWeb (later renamed Nexus), is developed.",
          reference_url: "https://example.com/browser",
          order: 2
        }
      ],
      order: 1,
      isTop: false
    },
    {
      id: "milestone-2",
      date: "2000",
      events: [
        {
          id: "event-3",
          milestoneId: "milestone-2",
          title: "Dot-com Bubble",
          description: "The dot-com bubble peaks and bursts, shifting the tech landscape.",
          text_1: "NASDAQ Crash",
          text_2: "Overvaluation",
          text_3: "Investment Frenzy",
          text_4: "Market Correction",
          reference_url: "https://example.com/dotcom",
          order: 1
        }
      ],
      order: 2,
      isTop: true
    },
    {
      id: "milestone-3",
      date: "91-10/2007",
      events: [
        {
          id: "event-4",
          milestoneId: "milestone-3",
          title: "iPhone Launch",
          description: "Apple launches the first iPhone, revolutionizing mobile computing.",
          text_1: "Multi-touch",
          text_2: "App Store",
          text_3: "Mobile Internet",
          text_4: "Smartphone Revolution",
          reference_url: "https://example.com/iphone",
          order: 1
        },
        {
          id: "event-5",
          milestoneId: "milestone-3",
          title: "Cloud Computing",
          description: "Cloud computing gains mainstream adoption with services like AWS.",
          reference_url: "https://example.com/cloud",
          order: 2
        },
        {
          id: "event-6",
          milestoneId: "milestone-3",
          title: "Social Media Boom",
          description: "Facebook, Twitter and other social platforms see explosive growth.",
          reference_url: "https://example.com/social",
          order: 3
        }
      ],
      order: 3,
      isTop: false
    },
    {
      id: "milestone-4",
      date: "2017",
      events: [
        {
          id: "event-7",
          milestoneId: "milestone-4",
          title: "AI Renaissance",
          description: "Breakthroughs in deep learning fuel an AI renaissance across industries.",
          text_1: "Neural Networks",
          text_2: "Machine Learning",
          text_3: "Big Data",
          text_4: "Computer Vision",
          reference_url: "https://example.com/ai",
          order: 1
        }
      ],
      order: 4,
      isTop: true
    }
  ]
};
