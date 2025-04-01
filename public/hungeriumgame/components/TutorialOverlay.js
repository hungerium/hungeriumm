import { useState } from 'react';

export default function TutorialOverlay({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  
  const tutorialSteps = [
    {
      title: "Welcome to CoffyLapse!",
      content: "You're now the proud owner of a modern coffee shop with Web3 integration. Your goal is to balance business success with sustainable practices."
    },
    {
      title: "Key Metrics",
      content: "Watch your Money, Popularity, Operations, and Sustainability. If any of these metrics hit zero, your business will fail."
    },
    {
      title: "Making Decisions",
      content: "You'll face various scenarios that impact your business. Choose wisely - you'll see changes to your metrics immediately."
    },
    {
      title: "Crypto Rewards",
      content: "Don't forget to claim your COFFEE tokens with the button in the top right. These can be used for special upgrades in future updates!"
    },
    {
      title: "Ready to Begin!",
      content: "Your first customers are waiting. Good luck with your coffee empire!"
    }
  ];
  
  const goToNextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };
  
  const step = tutorialSteps[currentStep];
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-coffee-bg p-4 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold text-coffee-dark mb-2">{step.title}</h2>
        <p className="mb-4 text-sm">{step.content}</p>
        
        <div className="flex justify-between items-center">
          <div className="flex space-x-1">
            {tutorialSteps.map((_, index) => (
              <span 
                key={index} 
                className={`w-2 h-2 rounded-full ${index === currentStep ? 'bg-coffee-dark' : 'bg-coffee-medium opacity-50'}`}
              />
            ))}
          </div>
          
          <button 
            onClick={goToNextStep} 
            className="bg-coffee-dark text-white px-4 py-1 rounded text-sm hover:bg-coffee-darker transition-colors"
          >
            {currentStep < tutorialSteps.length - 1 ? "Next" : "Start Game"}
          </button>
        </div>
      </div>
    </div>
  );
}
