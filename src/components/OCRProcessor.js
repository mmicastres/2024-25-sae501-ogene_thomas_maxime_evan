import React, { useState, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import CameraFeed from './CameraFeed';
import { useIa } from "../context/Ia"

const OCRProcessor = () => {
  const [textFinale, setTextFinale] = useState('');
  const [loading, setLoading] = useState(false);
  const [salle, setSalle] = useState(false);

  const {setSaller} = useIa()

  useEffect(() => {
    setSaller(salle)
  }, [salle])
  

  const handleReset = () => {
    setTextFinale('')
  }

  const handleImageCapture = async (imageData) => {
    setLoading(true);
    try {
      const { data: { text } } = await Tesseract.recognize(
        imageData,
        'fra',
        {
          tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        }
      );

      const regex = /(M\d{2}-T[PD]|SIDOBRE|ALBINQUE)/;
      const match = text.match(regex);

      if (match && match[1]) {
        let transformedText = match[1];

        if (/M.*T[PD]/.test(match[1])) {
          transformedText = transformedText
            .replace(/o|O/g, '0')
            .replace(/\s/g, '');

          const formatCheck = /M\d{2}/;
          if (!formatCheck.test(transformedText)) {
            return;
          }
        } else if (/SIDOBRE|ALBINQUE/.test(match[1])) {
          const formatCheck = /^SIDOBRE$|^ALBINQUE$/;
          if (!formatCheck.test(transformedText)) {
            return;
          }
        }
        setTextFinale(transformedText);
      }

    } catch (err) {
      console.error('Erreur :', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (textFinale) {
      let title = textFinale;

      if (textFinale === "ALBINQUE") {
        title = "Grand Amphi";
      } else if (textFinale === "SIDOBRE") {
        title = "Petit Amphi";
      }

      const newSalle = {
        salle: [
          {
            id: textToId(textFinale),
            title: title,
            eventColor: textToColor(textFinale),
          },
        ],
      };
      setSalle(newSalle);
    }
  }, [textFinale]);

  useEffect(() => {
    console.log(salle);
  }, [salle]);

  // Retourne l'ID de la salle
  const textToId = (textFinale) => {
    switch (textFinale) {
      case 'M01-TD':
        return 12673;
      case 'M02-TD':
        return 12981;
      case 'M03-TP':
        return 19393;
      case 'M05-TP':
        return 12680;
      case 'M06-TP':
        return 43372;
      case 'M07-TP':
        return 12677;
      case 'M09-TP':
        return 12678;
      case 'M10-TP':
        return 12679;
      case 'M11-TD':
        return 12674;
      case 'M13-TP':
        return 62575;
      case 'M14-TD':
        return 13927;
      // Reconnaissance des Amphi
      case 'ALBINQUE':
        return 12983;
      case 'SIDOBRE':
        return 12982;
      default:
        return null;
    }
  };

  // Retourne la couleur associée à la salle
  const textToColor = (textFinale) => {
    switch (textFinale) {
      case 'M01-TD':
      case 'M02-TD':
        return "#FFD7B0";
      case 'M03-TP':
      case 'M05-TP':
      case 'M06-TP':
      case 'M07-TP':
      case 'M09-TP':
      case 'M10-TP':
      case 'M13-TP':
        return "#FFFFBF";
      case 'M11-TD':
      case 'M14-TD':
        return "#FFD7B0";
      // Reconnaissance des Amphi
      case 'ALBINQUE':
      case 'SIDOBRE':
        return "#BEEAFF";
      default:
        return null;
    }
  };

  return (
    <div>
      <CameraFeed onCaptureFrame={handleImageCapture} textFinale={textFinale} loading={loading} />
      {textFinale && <button className='flex p-2 bg-black text-white rounded-2xl' onClick={() => handleReset()}>Reset</button>}
    </div>
  );
};

export default OCRProcessor;
