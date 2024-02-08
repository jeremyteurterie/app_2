function ResultsDisplay({ image, setResults }) {
  const reader = new FileReader();
  reader.readAsDataURL(image);
  reader.onloadend = () => {
    // Ici, vous pourriez envoyer l'image à un service de reconnaissance d'image
    // et ensuite appeler setResults avec les résultats obtenus.
  };

  return (
    <div>
      <h2>Image chargée</h2>
      {/* Affichage de l'image */}
      <img
        src={URL.createObjectURL(image)}
        alt="Chargée"
        style={{ width: '100%', maxHeight: '400px' }}
      />
    </div>
  );
}

export default ResultsDisplay;
