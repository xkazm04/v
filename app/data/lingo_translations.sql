CREATE TABLE lingo_translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_text TEXT NOT NULL,
  source_locale VARCHAR(10) NOT NULL,
  target_locale VARCHAR(10) NOT NULL,
  translated_text TEXT NOT NULL,
  translation_type VARCHAR(20) NOT NULL CHECK (translation_type IN ('text', 'object', 'html', 'chat')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(source_text, source_locale, target_locale, translation_type)
);

-- Index for faster lookups
CREATE INDEX idx_lingo_translations_lookup 
ON lingo_translations(source_text, source_locale, target_locale, translation_type);

-- RLS policies (adjust based on your security needs)
ALTER TABLE lingo_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to translations" ON lingo_translations
FOR SELECT USING (true);

CREATE POLICY "Allow insert/update to translations" ON lingo_translations
FOR ALL USING (true);