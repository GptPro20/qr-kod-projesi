import { createClient } from '@supabase/supabase-js';

// Supabase URL ve Anon Public Key
const supabase = createClient(
  'https://nxxnlyzerrzarrljvahg.supabase.co', // Supabase URL
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54eG5seXplcnJ6YXJybGp2YWhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMjk0OTEsImV4cCI6MjA2MTcwNTQ5MX0.69VH2om7MnvxgYpdppI1P1q-wBbnvANtMWeYvTMfQw8' // Supabase Anon Public Key
);

export default async function handler(req, res) {
  try {
    // Yeni bir token oluştur
    const newToken = Math.random().toString(36).substring(2);

    // Token'ı Supabase'e ekle
    const { data, error } = await supabase
      .from('qr_tokens')
      .insert([
        {
          token: newToken, 
          created_at: new Date().toISOString(), // ISO formatında tarih
        }
      ]);

    // Eğer hata varsa, hatayı logla ve yanıt ver
    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Error inserting token' });
    }

    // 30 saniye sonra token'ı sil
    setTimeout(async () => {
      const { error: deleteError } = await supabase
        .from('qr_tokens')
        .delete()
        .eq('id', data[0].id);

      if (deleteError) {
        console.error('Supabase delete error:', deleteError);
      }
    }, 30000); // 30 saniye sonra token'ı sil

    // Başarıyla işlem yapılırsa, token'ı geri döndür
    res.status(200).json({ token: newToken });

  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
}
