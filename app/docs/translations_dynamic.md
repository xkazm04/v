# Dynamic Translation Mechanism

## Overview

This system provides automatic translation of content based on user preferences. It includes intelligent caching, fallback handling, and seamless integration across the application.

## Architecture

```
User Preferences → API Client → Server API → Translation Service → Cache
       ↓               ↓           ↓              ↓              ↓
   Components ←   Hooks  ←    Response  ←    Translated  ←   Cached Results
```

## Core Components

### 1. User Preferences System

**Files:**
- `hooks/use-user-preferences.ts` - Client-side preference management
- `hooks/use-local-storage.ts` - Persistent storage utility

**Key Features:**
- Language preference storage (`en`, `es`, `fr`, etc.)
- Automatic preference detection
- LocalStorage persistence
- Validation and fallbacks

### 2. API Client Layer

**Files:**
- `lib/services/user-preferences-api-client.ts` - Universal API client
- `hooks/use-api-with-preferences.ts` - React hook wrapper

**Responsibilities:**
- Extract user preferences from multiple sources
- Inject preferences into API requests
- Create preference-aware URLs and headers
- Handle server/client preference synchronization

### 3. Server API Integration

**Files:**
- `api/news/route.ts` - News API endpoint
- `lib/services/supabase-news-service-server.ts` - Server-side data service

**Features:**
- Automatic preference extraction from requests
- Translation integration
- Response metadata with translation status
- Fallback to mock data

### 4. Translation Service

**Files:**
- `lib/services/translation-service.ts` - Core translation logic
- `api/translate/route.ts` - Translation API endpoint (create this)

**Capabilities:**
- Lingo.dev integration for high-quality translations
- Supabase caching for performance
- Batch translation support
- Error handling and fallbacks

### 5. Client Data Hooks

**Files:**
- `hooks/useNews.ts` - News data fetching
- `hooks/use-api-with-preferences.ts` - API integration

**Benefits:**
- Automatic preference injection
- Translation-aware data fetching
- Loading and error states
- Cache invalidation

## Implementation Guide

### Step 1: Add User Preferences to New Service

```typescript
// 1. Import the API client
import { useApiWithPreferences } from '@/app/hooks/use-api-with-preferences';

// 2. Use in your hook
export function useYourService() {
  const { 
    fetchWithPreferences, 
    createUrlWithPreferences,
    translationTarget 
  } = useApiWithPreferences();
  
  const fetchData = useCallback(async () => {
    const url = createUrlWithPreferences('/api/your-endpoint', {
      // your params
    });
    
    const response = await fetchWithPreferences(url);
    return response.json();
  }, [fetchWithPreferences, createUrlWithPreferences]);
}
```

### Step 2: Create API Route with Translation

```typescript
// api/your-endpoint/route.ts
import { userPreferencesApiClient } from '@/app/lib/services/user-preferences-api-client';

export async function GET(request: NextRequest) {
  // Extract user preferences
  const userPreferences = userPreferencesApiClient.extractUserPreferences({
    request
  });
  
  // Get translation target
  const translationTarget = userPreferencesApiClient.getTranslationTarget(userPreferences);
  
  // Apply to your filters
  const filters = {
    // your filters
    translateTo: translationTarget
  };
  
  // Fetch and return with metadata
  const results = await yourService.getData(filters);
  
  return NextResponse.json({
    results,
    __meta: {
      userPreferences: {
        translationEnabled: !!translationTarget,
        translationTarget: translationTarget || 'en'
      }
    }
  });
}
```

### Step 3: Add Translation to Service Layer

```typescript
// lib/services/your-service.ts
import { translateResearchStatement } from './translation-service';

class YourService {
  async getData(filters: { translateTo?: string }) {
    // Fetch your data
    let results = await this.fetchFromDatabase();
    
    // Apply translation if requested
    if (filters.translateTo) {
      results = await this.translateResults(results, filters.translateTo);
    }
    
    return results;
  }
  
  private async translateResults(results: YourType[], targetLanguage: string) {
    const translationPromises = results.map(async (item) => {
      const translatedFields: Partial<YourType> = {};
      
      // Translate each field you want to support
      if (item.title) {
        translatedFields.title = await translateResearchStatement(
          item.title, 'en', targetLanguage
        );
      }
      
      if (item.description) {
        translatedFields.description = await translateResearchStatement(
          item.description, 'en', targetLanguage
        );
      }
      
      return {
        ...item,
        ...translatedFields,
        __meta: {
          ...item.__meta,
          originalTitle: item.title,
          originalDescription: item.description,
          translatedTo: targetLanguage
        }
      };
    });
    
    const translatedResults = await Promise.allSettled(translationPromises);
    
    return translatedResults.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        console.warn(`Translation failed for item ${index}`);
        return results[index];
      }
    });
  }
}
```

### Step 4: Update UI Components

```typescript
// components/YourComponent.tsx
export function YourComponent() {
  const { articles, loading, error } = useYourService({
    // Component doesn't need to know about translation
    // It's handled automatically by the hook
  });
  
  return (
    <div>
      {articles.map(article => (
        <div key={article.id}>
          {/* These fields are automatically translated based on user preferences */}
          <h3>{article.title}</h3>
          <p>{article.description}</p>
          
          {/* Show translation status if needed */}
          {article.__meta?.translatedTo && (
            <span className="text-xs opacity-60">
              Translated to {article.__meta.translatedTo}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
```

## Translation Fields Support

### Current Implementation
- ✅ `research.statement` - Main statement/headline
- ✅ `research.verdict` - Fact-check verdict
- ✅ `research.context` - Additional context

### To Add More Fields
1. Update the translation functions in services
2. Add field handling in `translateResearchResults`
3. Preserve originals in `__meta` object
4. Test with different languages

## Caching Strategy

### Supabase Cache Table
```sql
CREATE TABLE lingo_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_text TEXT NOT NULL, -- Base64 hash of original text
  source_locale VARCHAR(10) NOT NULL,
  target_locale VARCHAR(10) NOT NULL,
  translated_text TEXT NOT NULL,
  translation_type VARCHAR(20) NOT NULL DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(source_text, source_locale, target_locale, translation_type)
);
```

### Cache Benefits
- **Performance**: Avoid re-translating same content
- **Cost**: Reduce API calls to translation service
- **Reliability**: Fallback when translation service is down

## Error Handling

### Graceful Degradation
1. **Translation fails** → Return original text
2. **Service unavailable** → Return original text
3. **Invalid language** → Default to English
4. **Network error** → Use cached version if available

### Error Logging
```typescript
// All translation errors are logged but don't break the user experience
console.warn('Translation failed for field X:', error);
// User still sees content in original language
```

## Testing Translation

### Test Different Languages
```typescript
// Set user preference to Spanish
const preferences = { language: 'es' };

// All content should now be in Spanish
const articles = await useNews();
```

### Verify Translation Metadata
```typescript
// Check if translation occurred
console.log(article.__meta?.translatedTo); // 'es'
console.log(article.__meta?.originalStatement); // Original English text
```

## Performance Considerations

### Batch Translation
- Multiple items translated simultaneously
- Connection pooling for translation API
- Parallel processing with Promise.allSettled

### Caching Strategy
- Hash-based cache keys for deduplication
- Automatic cache lookup before translation
- Persistent cache across app restarts

### Fallback Performance
- Original content returned immediately on translation failure
- Non-blocking translation (doesn't delay content rendering)
- Progressive enhancement approach

## Security Considerations

### API Key Management
- Translation API keys stored in environment variables
- Server-side translation to protect API keys
- Rate limiting on translation endpoints

### Content Validation
- Input sanitization before translation
- Output validation after translation
- SQL injection prevention in cache queries

## Monitoring and Analytics

### Translation Metrics
- Track translation success/failure rates
- Monitor translation API usage
- Cache hit/miss ratios
- User language preference distribution

### Debug Information
```typescript
console.log('🌐 Translation status:', {
  requested: translationTarget,
  successful: !!translatedText,
  cached: fromCache,
  duration: translationTime
});
```

## Extending to Other Services

This translation mechanism can be applied to:
- **Timeline data** (milestones, events, consequences)
- **Expert opinions** (analysis, quotes, sources)
- **User-generated content** (comments, reviews)
- **Static content** (UI labels, help text)
- **Dynamic content** (notifications, alerts)

Follow the 4-step implementation guide above for each new service.