import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';

interface ImageSlideshowProps {
  images: string[];
  interval?: number;
}

const ImageSlideshow = ({ images, interval = 5000 }: ImageSlideshowProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
      }}
    >
      {images.map((image, index) => (
        <Box
          key={image}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: currentImageIndex === index ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
          }}
        />
      ))}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
        }}
      />
    </Box>
  );
};

export default ImageSlideshow;
