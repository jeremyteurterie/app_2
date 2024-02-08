import React, { useState, useEffect, useRef } from 'react';

const Camera = () => {
  const videoRef = useRef(null);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');

  // Obtenir la liste des dispositifs de caméra dès le chargement du composant
  useEffect(() => {
    const enumerateDevices = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === 'videoinput'
      );
      setDevices(videoDevices);
      if (videoDevices.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(videoDevices[0].deviceId); // Sélectionnez par défaut la première caméra disponible
      }
    };

    enumerateDevices();
  }, [selectedDeviceId]);

  // Fonction pour démarrer la caméra avec le dispositif sélectionné
  const handleStartCamera = async (deviceId) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: deviceId ? { exact: deviceId } : undefined },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Une fois le flux démarré, récupérer la liste des dispositifs
        enumerateDevices();
      }
    } catch (err) {
      console.error("Erreur lors de l'accès à la caméra: ", err);
    }
  };

  // Fonction pour récupérer la liste des dispositifs de caméra disponibles
  const enumerateDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(
      (device) => device.kind === 'videoinput'
    );
    setDevices(videoDevices);
    if (videoDevices.length > 0) {
      setSelectedDeviceId(videoDevices[0].deviceId);
    }
  };

  // Fonction pour arrêter la caméra
  const handleStopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline width="100%"></video>
      {devices.length > 0 && (
        <select
          onChange={(e) => setSelectedDeviceId(e.target.value)}
          value={selectedDeviceId}
        >
          {devices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Caméra ${device.deviceId}`}
            </option>
          ))}
        </select>
      )}
      <button onClick={() => handleStartCamera(selectedDeviceId)}>
        Démarrer la caméra
      </button>
      <button onClick={handleStopCamera}>Arrêter la caméra</button>
    </div>
  );
};

export default Camera;
