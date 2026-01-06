import {createClient} from '@supabase/supabase-js';

const supabaseUrl = "https://stataltndlfdkuatygiy.supabase.co";
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0YXRhbHRuZGxmZGt1YXR5Z2l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MTExNDksImV4cCI6MjA3OTQ4NzE0OX0.K_I46NXE8Jfu7_KfJ3y1Gmzu1cLt3tswovEBrLRoBzU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);