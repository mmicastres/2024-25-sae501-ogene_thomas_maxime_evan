import React, { useRef, useEffect, useState } from 'react';

const CameraFeed = ({ onCaptureFrame, textFinale, loading }) => {
  const videoRef = useRef(null);
  const [text, setText] = useState('');
  const captureIntervalRef = useRef(null);

  const [cameraError, setCameraError] = useState(false);

  useEffect(() => {
    setText(textFinale);
  }, [textFinale]);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().catch((error) => {
              console.error("Erreur lors de la lecture du flux :", error);
            });
          };
        }
      } catch (error) {
        console.error("Erreur d'accès à la caméra :", error);
        setCameraError(true);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }

      if (captureIntervalRef.current) {
        clearInterval(captureIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (loading === false && textFinale.trim() === '') {
      captureIntervalRef.current = setInterval(() => {
        captureFrame();
      }, 1000);
    } else {
      if (captureIntervalRef.current) {
        clearInterval(captureIntervalRef.current);
      }
    }

    return () => {
      if (captureIntervalRef.current) {
        clearInterval(captureIntervalRef.current);
      }
    };
  }, [textFinale]);

  const captureFrame = () => {
    if (videoRef.current && videoRef.current.videoWidth && videoRef.current.videoHeight) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/png');
      onCaptureFrame(imageData);
    } else {
      console.warn('La vidéo n\'est pas prête pour la capture.');
    }
  };

  return (
    <div>
      {cameraError ? (
        <div>
          <p>La caméra n'est pas disponible sur cet appareil. Veuillez vérifier votre configuration.</p>
        </div>
      ) : (
        <div>
          <video ref={videoRef} style={{ width: '100%' }} autoPlay muted />
          {text === '' && <p>Analyse en cours...</p>}
          {text !== '' && <p>Salle : {text}</p>}
        </div>
      )}
    </div>
  );
  
}
export default CameraFeed;
