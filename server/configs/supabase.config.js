import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    flowType: "pkce",
    detectSessionInUrl: false,
  },
});

export default supabase;
