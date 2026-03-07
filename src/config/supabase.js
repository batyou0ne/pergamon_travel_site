const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("⚠️  SUPABASE_URL or SUPABASE_ANON_KEY not set. Image uploads to Supabase Storage will fail.");
}

const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");

module.exports = supabase;
