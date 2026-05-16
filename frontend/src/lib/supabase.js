import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL  = 'https://egahhhbyxbtsfuzuhkww.supabase.co'
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnYWhoaGJ5eGJ0c2Z1enVoa3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4Nzg2ODgsImV4cCI6MjA5NDQ1NDY4OH0.gqTht8tFhSamdcISlh54MrAR1djXw01htt8qNBy-i8w'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)
