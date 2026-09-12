// Supabase client configuration.
// Replace both placeholders with your project values.
// NEVER place the service_role key in frontend code.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export const SUPABASE_URL = 'https://xlxufliwijblnauzhkko.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_aiOD7NYtz3ORz9qdaVsFXA_lATIGZjr';

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
);
