
-- Create user_settings table
CREATE TABLE public.user_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  nlp_model TEXT NOT NULL DEFAULT 'gpt-4o-mini',
  confidence_threshold INTEGER NOT NULL DEFAULT 75,
  simulation_complexity TEXT NOT NULL DEFAULT 'standard',
  default_view TEXT NOT NULL DEFAULT 'timeline',
  compact_view BOOLEAN NOT NULL DEFAULT false,
  animations_enabled BOOLEAN NOT NULL DEFAULT true,
  auto_simulation BOOLEAN NOT NULL DEFAULT true,
  timezone TEXT NOT NULL DEFAULT 'utc',
  language TEXT NOT NULL DEFAULT 'en',
  dark_mode BOOLEAN NOT NULL DEFAULT true,
  notifications JSONB NOT NULL DEFAULT '{
    "timeline_anomalies": true,
    "timeline_updates": true,
    "feed_highpriority": true,
    "feed_trending": false,
    "feed_daily": true,
    "system_updates": true,
    "system_security": true
  }',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for user_settings
CREATE POLICY "Users can view their own settings" 
  ON public.user_settings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" 
  ON public.user_settings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" 
  ON public.user_settings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own settings" 
  ON public.user_settings 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add trigger to update updated_at column
CREATE TRIGGER update_user_settings_updated_at 
  BEFORE UPDATE ON public.user_settings 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create unique index to ensure one settings record per user
CREATE UNIQUE INDEX user_settings_user_id_unique ON public.user_settings(user_id);
