import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eoxsgdeuiaqnivxcfxpi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVveHNnZGV1aWFxbml2eGNmeHBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMDc2OTMsImV4cCI6MjA2MzY4MzY5M30.J2BoZbs9xDqSHAfVXy9lD6MqgwMp2DYZmL92yrLrjtk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
