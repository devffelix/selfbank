import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://grftjrepnitvpkgwjmoc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyZnRqcmVwbml0dnBrZ3dqbW9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxODE2MzgsImV4cCI6MjA3OTc1NzYzOH0.IhdRFD8E07lOmzFqwKN1yRQwPMQpq6QyCA98jtdl_J4';

console.log('Inicializando Supabase Client...');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});