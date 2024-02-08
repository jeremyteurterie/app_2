import { useState, useEffect, useRef } from 'react';

const Camera = ({ onFrame }) => {
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
  const handleStartCamera = async () => {
    if (!selectedDeviceId) return; // S'assurer qu'un dispositif est sélectionné
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: selectedDeviceId } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Erreur lors de l'accès à la caméra: ", err);
    }
  };

  // Fonction pour arrêter la caméra
  const handleStopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // Exécuter onFrame à intervalles réguliers
  useEffect(() => {
    let interval;
    if (videoRef.current && typeof onFrame === 'function') {
      interval = setInterval(() => {
        onFrame(videoRef.current);
      }, 3000); // Ajustez l'intervalle selon les besoins
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [onFrame, selectedDeviceId]); // Se réabonner lorsque onFrame ou selectedDeviceId change

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
      <button onClick={handleStartCamera}>Démarrer la caméra</button>
      <button onClick={handleStopCamera}>Arrêter la caméra</button>
    </div>
  );
};

export default Camera;
