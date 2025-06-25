import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zrmkruidxdeekcaizwgj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpybWtydWlkeGRlZWtjYWl6d2dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NDg1NDEsImV4cCI6MjA2NjMyNDU0MX0.aF_Non4HLNJsJtOXHU99vbdfOZDbmvEXqPI-DV6ODKI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
