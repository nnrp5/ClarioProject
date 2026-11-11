import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export const supabaseConfigIssue = !supabaseUrl
  ? 'missing-url'
  : !supabaseAnonKey
    ? 'missing-key'
    : !isValidHttpUrl(supabaseUrl)
      ? 'invalid-url'
      : null;

export const supabase =
  supabaseConfigIssue === null
    ? createClient(supabaseUrl!, supabaseAnonKey!)
    : null;
