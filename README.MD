# V: The keeper of truth

![V](https://img.shields.io/badge/Status-Hackathon_Project-orange) ![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Supabase](https://img.shields.io/badge/Supabase-Backend-green)

## 🎯 Overview

**Vaai** is an advanced AI-powered fact-checking platform designed to analyze political statements and provide comprehensive verification through multiple data sources. Built as a hackathon project, it combines cutting-edge LLM technology with real-time web research to deliver accurate, transparent, and actionable fact-checking results.

### 🚀 Key Value Propositions

- **Real-time Analysis**: Instant fact-checking of political statements using advanced AI models with ability to search through the web
- **Multi-source Verification**: Cross-references claims against academic, governmental, and mainstream sources
- **Visual Analytics**: Interactive visuals for tracking political accuracy trends
- **Speaker Profiling**: Comprehensive analysis of political figures' statement history and credibility scores
- **Transparency**: Full citation trails and expert perspective breakdowns for every fact-check

## 🛠️ Technology Stack

### **Frontend (Next.js 15)**
- **Framework**: Next.js 15.3.3 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion for smooth interactions
- **State Management**: React Query + Zustand stores

### **Backend Integration**
- **Database**: Supabase (PostgreSQL) for quick caching and data access
- **Research API**: Custom FastAPI server deployed in Google Cloud Run
- **LLM Integration**: Multiple AI providers (Groq, Gemini) with fallback
- **Audio Processing**: ElevenLabs for text-to-speech capabilities
- **Translations**: Czech, Russian, Spanish - Lingo.dev


## ✨ Core Features
### 🔍 **Factcheck analysis**
- **Text Statements**: Direct quote analysis from media articles with context and source attribution
- **YouTube Videos**: Automated transcription and timestamp-based fact-checking
- **Twitter/X Posts**: Social media content verification with viral statement tracking

### 📊 **Advanced Analytics Dashboard**
- **Speaker Profiles**: Individual politician credibility tracking and statement history
- **Trend Analysis**: Temporal visualization of fact-checking patterns
- **Comparison Tools**: Side-by-side analysis of multiple political figures
- **Geographic Insights**: Country-specific political statement analysis
- **Category Breakdown**: Analysis across politics, economy, healthcare, environment, etc.

### 🤖 **AI-Powered Research Engine**
- **Tri-factor research**: LLM training data + Web research + Resource analysis
- **Expert Perspectives**: Multiple AI-simulated expert viewpoints (critic, technical, predictive)
- **Confidence Scoring**: Transparent accuracy ratings (0-100) for each fact-check
- **Source Credibility**: Automated assessment of reference quality and bias

### 📈 **Visualization & Reporting**
- **Interactive Timelines**: Historical fact-checking trends and pattern recognition
- **Real-time Feed**: Live updates of breaking political statements and verifications
- **Export Capabilities**: PDF reports and data exports for research purposes
- **Mobile Responsive**: Full functionality across all device type