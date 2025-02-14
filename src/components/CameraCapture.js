import React, { useState, useEffect, useRef } from 'react';
import { Camera } from '@capacitor/camera';
import { Http } from '@capacitor-community/http';
import { createWorker, createScheduler } from 'tesseract.js';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import CalendarModal from './CalendarModal';

const CameraCapture = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [extractedText, setExtractedText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasValidResult, setHasValidResult] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const workerRef = useRef(null);
  const streamRef = useRef(null);
  const lastSuccessRef = useRef(Date.now());
  const analysisCountRef = useRef(0);
  const [day, setDay] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    initializeCamera();
    initializeTesseract();
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  useEffect(() => {
    if (extractedText) {
      sendToApi(extractedText);
    }
  }, [extractedText]);

  const initializeTesseract = async () => {
    try {
      if (workerRef.current) {
        await workerRef.current.terminate();
      }
      const worker = await createWorker('fra');
      await worker.loadLanguage('fra');
      await worker.initialize('fra');
      await worker.setParameters({
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-',
      });
      workerRef.current = worker;
    } catch (error) {
      console.error('Erreur d\'initialisation de Tesseract:', error);
      setIsAnalyzing(false);
    }
  };

  const stopCurrentStream = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const initializeCamera = async () => {
    try {
      stopCurrentStream();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: isFrontCamera ? 'user' : 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        startAnalysis();
      }
    } catch (error) {
      console.error('Erreur d\'accès à la caméra:', error);
      setExtractedText('Erreur d\'accès à la caméra');
    }
  };

  const preprocessText = (text) => {
    return text
      .replace(/[oO]/g, '0')
      .replace(/\s+/g, '')
      .trim();
  };

  const getRoomId = (text) => {
    switch (text) {
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
      default:
        return null;
    }
  };

  const sendToApi = async (text) => {
    setIsLoading(true);
    const id = getRoomId(text);
    if (!id) return;

    const isTP = text.endsWith('-TP');
    const payload = {
      salle: [
        {
          id,
          title: text,
          eventColor: isTP ? '#FFFFBF' : '#FFD7B0'
        }
      ]
    };

    try {
      const today = format(new Date(), 'yyyy-MM-dd', { locale: fr });
      const response = await Http.post({
        url: `https://progpedammi.iut-tlse3.fr/APICelcat/public/sallesmmi?date=${today}`,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        data: payload
      });

      if (!response.data) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = response.data;
      setDay(data);
      console.log('Réponse API:', data);

      if (data && Array.isArray(data)) {
        setCalendarEvents(data);
        setIsCalendarOpen(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi à l\'API:', error);
    }
  };

  const isValidFormat = (text) => {
    const regex = /^M[0-9]{1,2}-T[DP]$/;
    return regex.test(text);
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current || !workerRef.current || hasValidResult) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL('image/jpeg');
  };

  const reinitializeWorker = async () => {
    console.log('Réinitialisation du worker Tesseract...');
    try {
      if (workerRef.current) {
        await workerRef.current.terminate();
        workerRef.current = null;
      }
      const worker = await createWorker('fra');
      await worker.loadLanguage('fra');
      await worker.initialize('fra');
      await worker.setParameters({
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-',
      });
      workerRef.current = worker;
      lastSuccessRef.current = Date.now();
      analysisCountRef.current = 0;
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du worker:', error);
      setIsAnalyzing(false);
    }
  };

  const analyzeFrame = async (frameData) => {
    if (!frameData || !workerRef.current || hasValidResult) return;

    try {
      analysisCountRef.current++;
      const currentTime = Date.now();
      const timeSinceLastSuccess = currentTime - lastSuccessRef.current;

      if (timeSinceLastSuccess > 10000 && analysisCountRef.current > 20) {
        await reinitializeWorker();
        return;
      }

      const result = await workerRef.current.recognize(frameData);
      const text = result.data.text || '';

      const lines = text.split('\n');
      for (const line of lines) {
        const processed = preprocessText(line);

        if (isValidFormat(processed)) {
          console.log('Format valide trouvé:', processed);
          setExtractedText(processed);
          setHasValidResult(true);
          setIsAnalyzing(false);
          lastSuccessRef.current = currentTime;
          return;
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      setIsAnalyzing(false);
    }
  };

  const startAnalysis = () => {
    if (hasValidResult) return;

    setIsAnalyzing(true);
    let analysisInterval;

    const analyzeLoop = async () => {
      try {
        if (hasValidResult) {
          clearInterval(analysisInterval);
          return;
        }

        if (!workerRef.current) {
          await reinitializeWorker();
          if (!workerRef.current) return;
        }

        const frameData = captureFrame();
        if (frameData) {
          await analyzeFrame(frameData);
        }
      } catch (error) {
        console.error('Erreur dans la boucle d\'analyse:', error);
        clearInterval(analysisInterval);
        setIsAnalyzing(false);
      }
    };

    analysisInterval = setInterval(analyzeLoop, 500);

    return () => {
      if (analysisInterval) {
        clearInterval(analysisInterval);
      }
    };
  };

  const resetAnalysis = async () => {
    setHasValidResult(false);
    setExtractedText('');
    setIsAnalyzing(true);
    await reinitializeWorker();
    setTimeout(() => {
      startAnalysis();
    }, 100);
  };

  return (
    <div className="fixed inset-0 bg-black">
      <div className="flex flex-col h-full relative pt-safe pb-safe">
        <div className="flex-1 relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />
        </div>
        <div className="h-safe-bottom bg-black absolute bottom-0 left-0 right-0 z-20" />
        <div className="absolute left-0 right-0 bottom-[72px] p-4 bg-gradient-to-t from-black/50 to-transparent">
          {hasValidResult ? (
            <div className="space-y-4">
              <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
                <h3 className="font-semibold text-gray-800 text-sm">Format détecté</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">{extractedText}</p>
              </div>
              <button
                onClick={resetAnalysis}
                className="w-full bg-blue-500 text-white py-3 px-6 rounded-xl
                         hover:bg-blue-600 active:bg-blue-700 transition-colors
                         font-semibold shadow-lg"
              >
                Recommencer
              </button>
            </div>
          ) : (
            <div className="bg-black/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
              <div className="flex items-center justify-center space-x-3">
                {isAnalyzing && (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple border-t-transparent"></div>
                )}
                <p className="text-white font-medium">
                  {isAnalyzing ? 'Analyse en cours...' : 'Préparation de l\'analyse...'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={async () => {
          setIsCalendarOpen(false);
          setDay(null);
          setHasValidResult(false);
          setExtractedText('');
          setIsAnalyzing(true);
          await reinitializeWorker();
          startAnalysis();
        }}
        events={calendarEvents}
        extractedText={extractedText}
      />
    </div>
  );
};

export default CameraCapture;
