// pages/index.js
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

export default function Home() {
  const [qrUrl, setQrUrl] = useState('');
  const [qrImage, setQrImage] = useState('QR kod yükleniyor...');

  const generateQR = async () => {
    try {
      const res = await fetch('/api/token.js');
      const data = await res.json();
      if (data.token) {
        const url = `https://yoklama-sistemi-pskgun.vercel.app/`;
        setQrUrl(url);

        const qr = await QRCode.toDataURL(url);
        setQrImage(qr);
      } else {
        setQrImage('Token alınamadı');
      }
    } catch (err) {
      console.error('QR oluşturulamadı', err);
      setQrImage('Bir hata oluştu');
    }
  };

  useEffect(() => {
    generateQR(); // İlk yüklemede çalışır
    const interval = setInterval(generateQR, 30000); // 30 saniyede bir günceller
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>QR Kod Sistemi</h1>
      {qrImage.startsWith('data:image') ? (
        <img src={qrImage} alt="QR Kod" />
      ) : (
        <p>{qrImage}</p>
      )}
    </div>
  );
}
