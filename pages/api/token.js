// pages/api/token.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nxxnlyzerrzarrljvahg.supabase.co', // Supabase URL
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54eG5seXplcnJ6YXJybGp2YWhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMjk0OTEsImV4cCI6MjA2MTcwNTQ5MX0.69VH2om7MnvxgYpdppI1P1q-wBbnvANtMWeYvTMfQw8' // Anon Public Key
);

export default async function handler(req, res) {
  const newToken = Math.random().toString(36).substring(2);

  const { data, error } = await supabase
    .from('qr_tokens')
    .insert([{ token: newToken, created_at: new Date() }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // 30 saniye sonra token'ı sil
  setTimeout(async () => {
    await supabase
      .from('qr_tokens')
      .delete()
      .eq('id', data[0].id);
  }, 30000);

  res.status(200).json({ token: newToken });
}
