import React, { useState, useEffect } from 'react';
import { NeuralNetwork } from 'brain.js';
import DrawDigitFromLocal from './DrawDigitFromLocal';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const App = () => {
  const [trainedNet, setTrainedNet] = useState(null); // Store the trained network
  const [isLoading, setIsLoading] = useState(true); // Loading state for fetching model


  // Load the trained model when the component mounts or when trainingSize changes
  useEffect(() => {
    const loadTrainedModel = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`2000-trained-model.json`); // Correct URL
        const modelJSON = await response.json(); // Parse JSON
        const net = new NeuralNetwork({ gpu: false }).fromJSON(modelJSON); // Load the model
        setTrainedNet(net); // Store the trained network
      } catch (error) {
        console.error('Error loading the model:', error);
      }
      setIsLoading(false);
    };

    loadTrainedModel();
  }, []); // Dependency on trainingSize

  return (
    <div className='flex justify-center items-center min-h-screen p-4 bg-gray-100'>
      <div className='text-center max-w-4xl w-full'>
        <h1 className='text-4xl font-bold underline mb-3'>
          MNIST - AI Handwritten Digit Recognition
        </h1>

        {isLoading ? (
          <p className='text-lg'>Loading the trained model...</p>
        ) : trainedNet ? (
          <>
            <div className='flex space-y-6'>
              <DrawDigitFromLocal
                trainedNet={trainedNet}
              />
            </div>
          </>
        ) : (
          <p className='text-lg'>Error loading the model. Please try again.</p>
        )}
      </div>
    </div>
  );
};

export default App;
