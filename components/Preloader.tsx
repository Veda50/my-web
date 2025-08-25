"use client";

import { useEffect, useState } from 'react';

const Preloader = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [loadingText, setLoadingText] = useState('');
  const fullText = 'Loading...';

  useEffect(() => {
    // Typing effect for loading text
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setLoadingText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 150);

    // Hide preloader after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => {
      clearInterval(typingInterval);
      clearTimeout(timer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="preloader-container">
      {/* Background with animated gradient */}
      <div className="preloader-bg" />
      
      {/* Main content */}
      <div className="preloader-content">
        {/* Animated circles */}
        <div className="circles-container">
          <div className="circle circle-1" />
          <div className="circle circle-2" />
          <div className="circle circle-3" />
          <div className="circle circle-4" />
        </div>

        {/* Center logo/icon */}
        <div className="center-icon">
          <div className="icon-ring" />
          <div className="icon-core" />
        </div>

        {/* Loading text */}
        <div className="loading-text">
          <span>{loadingText}</span>
          <span className="cursor">|</span>
        </div>

        {/* Loading dots */}
        <div className="loading-dots">
          <div className="dot dot-1" />
          <div className="dot dot-2" />
          <div className="dot dot-3" />
        </div>

        {/* Wave animation */}
        <div className="wave-container">
          <div className="wave wave-1" />
          <div className="wave wave-2" />
          <div className="wave wave-3" />
        </div>
      </div>

      <style jsx>{`
        .preloader-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          animation: fadeOut 0.5s ease-in-out 2.5s forwards;
        }

        .preloader-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 25%, #06b6d4 50%, #0ea5e9 75%, #3b82f6 100%);
          background-size: 400% 400%;
          animation: gradientShift 4s ease-in-out infinite;
        }

        .preloader-content {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .circles-container {
          position: relative;
          width: 200px;
          height: 200px;
          margin-bottom: 2rem;
        }

        .circle {
          position: absolute;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          animation: ripple 2s ease-in-out infinite;
        }

        .circle-1 {
          width: 60px;
          height: 60px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: 0s;
        }

        .circle-2 {
          width: 100px;
          height: 100px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: 0.3s;
        }

        .circle-3 {
          width: 140px;
          height: 140px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: 0.6s;
        }

        .circle-4 {
          width: 180px;
          height: 180px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: 0.9s;
        }

        .center-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
        }

        .icon-ring {
          position: absolute;
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255, 255, 255, 0.8);
          border-top: 3px solid #ffffff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .icon-core {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 16px;
          height: 16px;
          background: #ffffff;
          border-radius: 50%;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .loading-text {
          color: #ffffff;
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 3rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .cursor {
          animation: blink 1s ease-in-out infinite;
        }

        .loading-dots {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .dot {
          width: 8px;
          height: 8px;
          background: #ffffff;
          border-radius: 50%;
          animation: bounce 1.4s ease-in-out infinite;
        }

        .dot-1 {
          animation-delay: 0s;
        }

        .dot-2 {
          animation-delay: 0.2s;
        }

        .dot-3 {
          animation-delay: 0.4s;
        }

        .wave-container {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 20px;
        }

        .wave {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #ffffff, transparent);
          animation: wave 2s ease-in-out infinite;
        }

        .wave-1 {
          animation-delay: 0s;
        }

        .wave-2 {
          animation-delay: 0.3s;
          bottom: 5px;
        }

        .wave-3 {
          animation-delay: 0.6s;
          bottom: 10px;
        }

        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes ripple {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0;
          }
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.8;
          }
        }

        @keyframes blink {
          0%, 50% {
            opacity: 1;
          }
          51%, 100% {
            opacity: 0;
          }
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1.2);
            opacity: 1;
          }
        }

        @keyframes wave {
          0%, 100% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
            visibility: visible;
          }
          to {
            opacity: 0;
            visibility: hidden;
          }
        }

        @media (max-width: 768px) {
          .circles-container {
            width: 150px;
            height: 150px;
          }

          .circle-1 {
            width: 45px;
            height: 45px;
          }

          .circle-2 {
            width: 75px;
            height: 75px;
          }

          .circle-3 {
            width: 105px;
            height: 105px;
          }

          .circle-4 {
            width: 135px;
            height: 135px;
          }

          .loading-text {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Preloader;