import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nuuwmimnnxwfxfrvttzg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51dXdtaW1ubnh3ZnhmcnZ0dHpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyOTM2MjAsImV4cCI6MjA2Njg2OTYyMH0.vWQVj3yidYIu0eOPPxdZGSYYSoc8A7fkON29fZVlJC0';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase; 