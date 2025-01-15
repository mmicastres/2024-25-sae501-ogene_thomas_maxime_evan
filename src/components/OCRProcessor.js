import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import CameraFeed from './CameraFeed';

const OCRProcessor = () => {
  const [filteredText, setFilteredText] = useState('');
  const [textFinale, setTextFinale] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageCapture = async (imageData) => {
    setLoading(true);
    try {
      const { data: { text } } = await Tesseract.recognize(
        imageData,
        'fra',
        {
          tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
          logger: (info) => console.log(info),
        }
      );

      const regex = /(M.*T[PD]|SIDOBRE|ALBINQUE)/;
      const match = text.match(regex);

      if (match && match[1]) {
        let transformedText = match[1];

        if (/M.*T[PD]/.test(match[1])) {
          transformedText = transformedText
            .replace(/o|O/g, '0')
            .replace(/\s/g, '');

          const formatCheck = /M\d{2}/;
          if (!formatCheck.test(transformedText)) {
            setFilteredText('');
            return;
          }
        } else if (/SIDOBRE|ALBINQUE/.test(match[1])) {
          const formatCheck = /^SIDOBRE$|^ALBINQUE$/;
          if (!formatCheck.test(transformedText)) {
            setFilteredText('');
            return;
          }
        }
        setFilteredText(transformedText);
        setTextFinale(transformedText);
      } else {
        setFilteredText('');
      }

    } catch (err) {
      console.error('Erreur :', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <CameraFeed onCaptureFrame={handleImageCapture} textFinale={textFinale} loading={loading} />
    </div>
  );
};

export default OCRProcessor;
