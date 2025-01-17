import React, { useRef, useEffect, useState } from "react";

const CameraFeed = ({ onCaptureFrame, textFinale, loading }) => {
  const canvasRef = useRef(null);
  const videoStreamRef = useRef(null);
  const captureIntervalRef = useRef(null);

  const [cameraError, setCameraError] = useState(false);
  const [flashActive, setFlashActive] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const constraints = {
          video: {
            facingMode: { exact: "environment" }, // Utilise explicitement la caméra arrière
          },
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoStreamRef.current = stream;

        const videoElement = document.createElement("video");
        videoElement.srcObject = stream;

        videoElement.onloadedmetadata = () => {
          videoElement.play();
          drawToCanvas(videoElement);
        };
      } catch (error) {
        console.error("Erreur d'accès à la caméra :", error);
        setCameraError(true);
      }
    };

    const drawToCanvas = (videoElement) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");

      const renderFrame = () => {
        if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
          canvas.width = videoElement.videoWidth;
          canvas.height = videoElement.videoHeight;
          ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        }
        requestAnimationFrame(renderFrame);
      };

      renderFrame();
    };

    startCamera();

    return () => {
      if (videoStreamRef.current) {
        const tracks = videoStreamRef.current.getTracks();
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
    const canvas = canvasRef.current;
    if (canvas) {
      const imageData = canvas.toDataURL("image/png");
      onCaptureFrame(imageData);
    }
  };

  const toggleFlash = () => {
    if (videoStreamRef.current) {
      const videoTrack = videoStreamRef.current
        .getVideoTracks()
        .find((track) => track.getCapabilities().torch);

      if (videoTrack) {
        const settings = videoTrack.getSettings();
        const capabilities = videoTrack.getCapabilities();

        if (capabilities.torch) {
          videoTrack
            .applyConstraints({
              advanced: [{ torch: !flashActive }],
            })
            .then(() => {
              setFlashActive((prevState) => !prevState);
            })
            .catch((error) => {
              console.error("Erreur lors de l'activation du flash :", error);
            });
        }
      } else {
        console.warn("Le périphérique ne prend pas en charge la fonction torche.");
      }
    }
  };

  return (
    <div>
      {cameraError ? (
        <p>La caméra n'est pas disponible. Veuillez vérifier votre configuration.</p>
      ) : (
        <div>
          <canvas ref={canvasRef} style={{ width: "100%" }} />
          <button onClick={toggleFlash} style={{ marginTop: "10px" }}>
            {flashActive ? "Désactiver le flash" : "Activer le flash"}
          </button>
          {loading ? (
            <div className="flex h-4 w-4 rounded-full bg-orange-400 m-1" />
          ) : (
            textFinale && <p>Salle : {textFinale}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CameraFeed;
