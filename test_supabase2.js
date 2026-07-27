const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://gvuzsbrplmgqjuchjcpk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2dXpzYnJwbG1ncWp1Y2hqY3BrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MTE5NDMsImV4cCI6MjA5MTI4Nzk0M30.PowRUwVvHnEKvfBC3jvK5gHUsCACT2ecTJxOAat8qXU';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function test() {
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
        console.error("Error:", error);
    } else {
        console.log("Count:", data.length);
        console.log(data);
    }
}
test();
