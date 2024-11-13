import React, { useState, useEffect } from 'react';
import { Button } from './components/ui/button';
import DigitChart from './DigitChart';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const DrawDigitFromLocal = ({ trainedNet, trainingSize, setTrainingSize }) => {
  const [digit, setDigit] = useState({ input: null, label: null });
  const [result, setResult] = useState(null); // Initialize as null for conditional rendering
  const [imagePath, setImagePath] = useState(null); // State to store image path

  const WIDTH = 28;
  const HEIGHT = 28;

  // Load a random image when the component mounts or when trainingSize changes
  useEffect(() => {
    const digitLabel = Math.floor(Math.random() * 10);
    const imageIndex = Math.floor(Math.random() * 10);
    const newImagePath = `/digits/${digitLabel}/${imageIndex}.jpg`; // Path to the image in public directory
    setImagePath(newImagePath);
  }, [trainingSize]); // This effect is triggered when the training size changes

  // Function to handle image load and extract image data
  const handleImageLoad = (event) => {
    const image = event.target;

    // Create an offscreen canvas to extract pixel data
    const offscreenCanvas = document.createElement('canvas');
    const offscreenContext = offscreenCanvas.getContext('2d');
    offscreenCanvas.width = WIDTH;
    offscreenCanvas.height = HEIGHT;

    // Draw the image onto the canvas (resize to fit 28x28)
    offscreenContext.drawImage(image, 0, 0, WIDTH, HEIGHT);

    // Get pixel data from the canvas
    const imageData = offscreenContext.getImageData(0, 0, WIDTH, HEIGHT);
    const pixels = imageData.data;

    // Convert the pixel data to grayscale and normalize to [0, 1]
    const grayscaleData = Array.from(pixels)
      .filter((_, index) => index % 4 === 0) // Extract the red channel (since it's grayscale)
      .map((value) => value / 255); // Normalize to [0, 1]

    // Set digit input and label
    const digitLabel = parseInt(imagePath.split('/')[2], 10); // Extract label from image path
    setDigit({ input: grayscaleData, label: digitLabel });
  };

  const handleClick = () => {
    if (digit.input && trainedNet) {
      const prediction = trainedNet.run(digit.input);
      console.log(digit.input);
      setResult(Array.from(prediction));
    }
  };

  const loadNewDigit = () => {
    const digitLabel = Math.floor(Math.random() * 10);
    const imageIndex = Math.floor(Math.random() * 10);
    const newImagePath = `/digits/${digitLabel}/${imageIndex}.jpg`; // Path to new image
    setImagePath(newImagePath);
  };

  return (
    <div className='flex justify-center items-center p-4 w-full max-w-4xl mx-auto'>
      <div className='flex flex-col justify-center items-center w-full'>
        {/* Radio Group and Label Container */}
        <div className='flex flex-row items-center'>

          {/* Labeled and Image Container */}
          <div className='flex flex-col items-center justify-center mr-5'>
            <p className='text-lg font-medium '>
              Labeled: {digit.label !== null ? digit.label : 'Loading...'}
            </p>

            {/* Image Display centered below label */}
            {imagePath && (
              <img
                src={imagePath}
                alt='Random Digit'
                width={WIDTH * 1.3}
                height={HEIGHT * 1.3}
                onLoad={handleImageLoad}
                className='mb-4'
              />
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className='w-full max-w-xs space-y-4 mt-4'>
          <Button
            className='w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200'
            onClick={handleClick}
            disabled={!trainedNet}
          >
            Make Prediction
          </Button>

          <Button
            className='w-full py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-200'
            onClick={loadNewDigit}
          >
            Load New Digit
          </Button>
        </div>

        {/* Conditionally render DigitChart based on whether there’s a prediction result */}
        {result && (
          <div className='mt-6 w-full max-w-xs'>
            <DigitChart data={result} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DrawDigitFromLocal;
