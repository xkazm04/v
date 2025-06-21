# V: The keeper of truth

![V](https://img.shields.io/badge/Status-Hackathon_Project-orange) ![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Supabase](https://img.shields.io/badge/Supabase-Backend-green)

## 🎯 Overview

**StoryTeller** is an advanced AI-powered fact-checking platform designed to analyze political statements and provide comprehensive verification through multiple data sources. Built as a hackathon project, it combines cutting-edge LLM technology with real-time web research to deliver accurate, transparent, and actionable fact-checking results.

### 🚀 Key Value Propositions

- **Real-time Analysis**: Instant fact-checking of political statements using advanced AI models with ability to search through the web
- **Multi-source Verification**: Cross-references claims against academic, governmental, and mainstream sources
- **Visual Analytics**: Interactive visuals for tracking political accuracy trends
- **Speaker Profiling**: Comprehensive analysis of political figures' statement history and credibility scores
- **Transparency**: Full citation trails and expert perspective breakdowns for every fact-check

## ✨ Core Features
- TBD merge with Modules chapter
### 🔍 **Multi-Modal Input Processing**
- **Text Statements**: Direct quote analysis with context and source attribution
- **YouTube Videos**: Automated transcription and timestamp-based fact-checking
- **Twitter/X Posts**: Social media content verification with viral statement tracking
- **File Uploads**: Batch processing of documents and transcripts

### 📊 **Advanced Analytics Dashboard**
- **Speaker Profiles**: Individual politician credibility tracking and statement history
- **Trend Analysis**: Temporal visualization of fact-checking patterns
- **Comparison Tools**: Side-by-side analysis of multiple political figures
- **Geographic Insights**: Country-specific political statement analysis
- **Category Breakdown**: Analysis across politics, economy, healthcare, environment, etc.

### 🤖 **AI-Powered Research Engine**
- **Tri-factor Verification**: LLM training data + Web research + Resource analysis
- **Expert Perspectives**: Multiple AI-simulated expert viewpoints (critic, technical, predictive)
- **Confidence Scoring**: Transparent accuracy ratings (0-100) for each fact-check
- **Source Credibility**: Automated assessment of reference quality and bias

### 📈 **Visualization & Reporting**
- **Interactive Timelines**: Historical fact-checking trends and pattern recognition
- **Real-time Feed**: Live updates of breaking political statements and verifications
- **Export Capabilities**: PDF reports and data exports for research purposes
- **Mobile Responsive**: Full functionality across all device types

## 🛠️ Technology Stack

### **Frontend (Next.js 15)**
- **Framework**: Next.js 15.3.3 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion for smooth interactions
- **State Management**: React Query + Zustand stores

### **Backend Integration**
- **Database**: Supabase (PostgreSQL) for quick caching and data access
- **API**: FastAPI microservices for fact-checking processing
- **LLM Integration**: Multiple AI providers (Groq, Gemini) with fallback
- **Web Research**: Real-time web scraping and source verification
- **Audio Processing**: ElevenLabs for text-to-speech capabilities

### **AI & Data Processing**
- **LLM Models**: LLama, Gemini, and Claude for multi-perspective analysis
- **Web Grounding**: Real-time search and source verification
- **Resource Analysis**: Academic paper and government source integration
- **Profile Intelligence**: Automated speaker metadata extraction

## 📱 Modules
### **Landing Page**
- Featured breaking news fact-checks
- Real-time feed of verified political statements
- Quick access to upload and analysis tools

### **Upload & Analysis**
- Intuitive multi-tab interface for different content types
- Real-time processing with progress indicators
- Immediate results with detailed breakdowns

### **Dashboard Analytics**
- Comprehensive speaker profile management
- Historical trend analysis and pattern recognition
- Exportable reports and data visualizations

### **Timeline View**
- Chronological fact-checking history
- Interactive filtering by date, category, and credibility
- Educational content about verification methodologies

## 🎯 Target Audiences

### **Primary Users**
- **Journalists & Media**: Quick verification for breaking news stories
- **Political Researchers**: Academic analysis of political discourse patterns
- **Educators**: Teaching critical thinking and media literacy
- **Citizens**: Personal fact-checking for social media and news consumption

### **Use Cases**
- **Election Coverage**: Real-time candidate statement verification
- **Policy Analysis**: Fact-checking of policy claims and proposals
- **Media Literacy Education**: Teaching verification skills not only to students

## 🔒 Data principles
- **Transparent Processing**: Full audit trail for every fact-check
- **Source Attribution**: Complete citation and reference tracking
- **Open Methodology**: Documented fact-checking processes and criteria

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account and API keys
- AI provider API keys (Groq, OpenAI, etc.)
- TBD possibly keys for translations and eleven labs

### Installation
```bash
# Clone the repository
git clone [tbd]
cd v

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase and AI provider keys

# Run development server
npm run dev
```

### Configuration
1. Set up Supabase project and configure authentication
2. Add AI provider API keys to environment variables
3. Configure backend API endpoints
4. Run database migrations for user profiles


---
⚡*Powered by Bolt*