import { useState, useEffect } from 'react';
import ImageUpload from './components/ImageUpload';
import Camera from './components/CameraFeed'; // Assurez-vous que le nom est correct et correspond au fichier
import '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

import './App.css';

function App() {
  const [model, setModel] = useState(null);
  const [predictionFrame, setPredictionFrame] = useState([]);
  const [predictionImage, setPredictionImage] = useState([]);

  useEffect(() => {
    const loadModel = async () => {
      const net = await mobilenet.load();
      setModel(net);
      console.log('Model loaded.');
    };
    loadModel();
  }, []);

  const handleFrame = async (video) => {
    if (!model) return;

    try {
      const prediction = await model.classify(video);
      setPredictionFrame(prediction); // Met à jour les prédictions basées sur la vidéo en temps réel
      console.log(prediction);
    } catch (error) {
      console.error('Erreur lors de la prédiction: ', error);
    }
  };

  const handleImageUpload = async (imageFile) => {
    if (!model) return;

    console.log('Predicting...');
    const imgElement = document.createElement('img');
    imgElement.src = URL.createObjectURL(imageFile);
    imgElement.onload = async () => {
      const prediction = await model.classify(imgElement);
      setPredictionImage(prediction); // Met à jour les prédictions basées sur l'image téléchargée
      console.log(prediction);
    };
  };

  return (
    <div className="App">
      <h1>Reconnaissance avec TensorFlow.js</h1>
      <ImageUpload onImageUpload={handleImageUpload} />
      <Camera onFrame={handleFrame} />
      {predictionImage.length > 0 && (
        <div>
          <h2>Prédiction Image :</h2>
          <p>{`Classe: ${predictionImage[0].className}, Probabilité: ${(
            predictionImage[0].probability * 100
          ).toFixed(2)}%`}</p>
        </div>
      )}
      {predictionFrame.length > 0 && (
        <div>
          <h2>Prédiction Video temps reel :</h2>
          <p>{`Classe: ${predictionFrame[0].className}, Probabilité: ${(
            predictionFrame[0].probability * 100
          ).toFixed(2)}%`}</p>
        </div>
      )}
    </div>
  );
}

export default App;
