import { useState, useEffect, useRef } from 'react';

const Camera = ({ onFrame }) => {
  const videoRef = useRef(null);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoDevices = devices.filter(
        (device) => device.kind === 'videoinput'
      );
      setDevices(videoDevices);
      if (videoDevices.length > 0) {
        setSelectedDeviceId(videoDevices[0].deviceId);
      }
    });
  }, []);

  const handleStartCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: { exact: selectedDeviceId } },
    });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  };

  const handleStopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // Exécuter onFrame à intervalles réguliers (si nécessaire)
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
