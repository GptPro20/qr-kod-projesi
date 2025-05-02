// validate.js (Vercel API route)
export default async function handler(req, res) {
  const token = req.query.token;

  if (!token) {
    return res.status(400).json({ valid: false, error: "Token eksik" });
  }

  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(
    "https://nxxnlyzerrzarrljvahg.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54eG5seXplcnJ6YXJybGp2YWhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMjk0OTEsImV4cCI6MjA2MTcwNTQ5MX0.69VH2om7MnvxgYpdppI1P1q-wBbnvANtMWeYvTMfQw8"
  );

  const { data, error } = await supabase
    .from("qr_tokens")
    .select("*")
    .eq("token", token)
    .limit(1);

  if (error || !data || data.length === 0) {
    return res.status(200).json({ valid: false });
  }

  const createdAt = new Date(data[0].created_at);
  const now = new Date();
  const diffSeconds = (now - createdAt) / 1000;

  // Token 30 saniyeden eskiyse geçersiz say
  if (diffSeconds > 30) {
    return res.status(200).json({ valid: false });
  }

  return res.status(200).json({ valid: true });
}
