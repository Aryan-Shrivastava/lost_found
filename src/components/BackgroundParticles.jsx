import React, { useEffect, useState } from 'react';

const BackgroundParticles = () => {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    // Create random particles
    const createParticles = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const particleCount = Math.min(windowWidth, windowHeight) / 10; // Responsive particle count
      
      const newParticles = [];
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * windowWidth,
          y: Math.random() * windowHeight,
          size: Math.random() * 5 + 2,
          opacity: Math.random() * 0.5 + 0.1,
          animationDuration: Math.random() * 15 + 5,
          animationDelay: Math.random() * 5
        });
      }
      
      setParticles(newParticles);
    };
    
    // Initialize particles
    createParticles();
    
    // Recreate particles on window resize
    const handleResize = () => {
      createParticles();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div className="particles-container">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animationDuration: `${particle.animationDuration}s`,
            animationDelay: `${particle.animationDelay}s`
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundParticles; 