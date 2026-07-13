import React, { useState, useEffect } from "react";

const Airtable = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("/api/airtable-images");

        if (!response.ok) {
          throw new Error("Failed to fetch images");
        }

        const { images } = await response.json();

        // Randomly select two unique images
        const randomImages = [...images]
          .sort(() => 0.5 - Math.random())
          .slice(0, 2);

        setImages(randomImages);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div>
      <h1>Airtable Images</h1>
      <div>
        {images.map((image, index) => (
          <img key={index} src={image} alt={`Employee Headshot ${index}`} />
        ))}
      </div>
    </div>
  );
};

export default Airtable;
