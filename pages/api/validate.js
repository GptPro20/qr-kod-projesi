import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nxxnlyzerrzarrljvahg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54eG5seXplcnJ6YXJybGp2YWhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMjk0OTEsImV4cCI6MjA2MTcwNTQ5MX0.69VH2om7MnvxgYpdppI1P1q-wBbnvANtMWeYvTMfQw8'
);

export default async function handler(req, res) {
  const { token } = req.query;

  const { data, error } = await supabase
    .from('qr_tokens')
    .select('*')
    .eq('token', token)
    .single();

  if (error || !data) {
    return res.status(401).json({ valid: false });
  }

  res.status(200).json({ valid: true });
}
