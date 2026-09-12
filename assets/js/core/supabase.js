// Supabase client configuration.
// Replace both placeholders with your project values.
// NEVER place the service_role key in frontend code.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export const SUPABASE_URL = 'PASTE_SUPABASE_URL_HERE';
export const SUPABASE_PUBLISHABLE_KEY = 'PASTE_SUPABASE_PUBLISHABLE_KEY_HERE';

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
);
