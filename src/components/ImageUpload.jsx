function ImageUpload({ onImageUpload }) {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && onImageUpload) {
      onImageUpload(file);
    }
  };

  return <input type="file" accept="image/*" onChange={handleImageChange} />;
}

export default ImageUpload;
