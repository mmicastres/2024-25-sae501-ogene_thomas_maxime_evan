import React, { useRef, useEffect, useState } from 'react';

const CameraFeed = ({ onCaptureFrame, textFinale, loading }) => {
  const videoRef = useRef(null);
  const captureIntervalRef = useRef(null);

  const [cameraError, setCameraError] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });

        // Vérifie si la vidéo est déjà en cours de lecture avant de tenter de la démarrer
        if (videoRef.current && videoRef.current.srcObject !== stream) {
          if (videoRef.current.srcObject) {
            // Arrête les pistes existantes
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          }

          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            // Démarre la lecture de la vidéo après que les métadonnées aient été chargées
            videoRef.current.play().catch((error) => {
              console.error("Erreur lors de la lecture du flux :", error);
            });
          };
        }
      } catch (error) {
        console.error('Erreur d\'accès à la caméra :', error);
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
    if (!loading && !textFinale) {
      captureIntervalRef.current = setInterval(() => {
        captureFrame();
      }, 1000);
    } else if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
    }

    return () => {
      if (captureIntervalRef.current) {
        clearInterval(captureIntervalRef.current);
      }
    };
  }, [textFinale, loading]);

  const captureFrame = () => {
    if (videoRef.current && videoRef.current.videoWidth && videoRef.current.videoHeight) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/png');
      onCaptureFrame(imageData);
    }
  };

  return (
    <div>
      {cameraError ? (
        <p>La caméra n'est pas disponible. Veuillez vérifier votre configuration.</p>
      ) : (
        <div>
          <video ref={videoRef} style={{ width: '100%' }} autoPlay muted />
          {loading ? <div className='flex h-4 w-4 rounded-full bg-orange-400 m-1' /> : textFinale && <p>Salle : {textFinale}</p>}
        </div>
      )}
    </div>
  );
};

export default CameraFeed;
