import { useState, useEffect, useRef } from 'react';

const Camera = ({ onFrame }) => {
  const videoRef = useRef(null);
  const [devices, setDevices] = useState([]); // Ajouté pour stocker la liste des dispositifs de caméra
  const [selectedDeviceId, setSelectedDeviceId] = useState(''); // Ajouté pour stocker l'ID du dispositif sélectionné

  // Obtenir la liste des caméras disponibles
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoDevices = devices.filter(
        (device) => device.kind === 'videoinput'
      );
      setDevices(videoDevices);
      if (videoDevices.length > 0) {
        setSelectedDeviceId(videoDevices[0].deviceId); // Sélectionnez par défaut la première caméra
      }
    });
  }, []);

  // Accéder à la caméra sélectionnée
  useEffect(() => {
    if (selectedDeviceId) {
      const getVideo = async () => {
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

      getVideo();
    }
  }, [selectedDeviceId]);

  // Exécuter onFrame à intervalles réguliers
  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && typeof onFrame === 'function') {
        onFrame(videoRef.current);
      }
    }, 3000); // Ajustez l'intervalle selon les besoins

    return () => clearInterval(interval);
  }, [onFrame]);

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline width="100%"></video>
      {devices.length > 1 && (
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
    </div>
  );
};

export default Camera;
