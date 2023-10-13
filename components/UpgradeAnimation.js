import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

export default function UpgradeAnimation({ oldImage, newImage, onAnimationEnd }) {
  const [stage, setStage] = useState('glitch');
  const [runConfetti, setRunConfetti] = useState(false);

  useEffect(() => {
    if (stage === 'glitch') {
      setTimeout(() => {
        setStage('transition');
        setRunConfetti(true);  // Trigger confetti when transitioning
      }, 6000);
    } else if (stage === 'transition') {
      setTimeout(() => {
        onAnimationEnd();
      }, 3000);
    }
  }, [stage]);

  useEffect(() => {
    if (runConfetti) {
      let end = Date.now() + (15 * 200);
      let colors = ['#29cdff', '#a864fd', '#78ff44', '#ff718d', '#fdff6a'];

      function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }

      frame();
    }
  }, [runConfetti]);

  return (
    <div className="wrapper">
      <div className={`upgrade-animation ${stage}`}>
        <div className="imgWrap">
          <div className="glitchWrap">
            <img src={oldImage} className="image old-image" alt="Old NFT" />
          </div>
          <img src={newImage} className="image new-image" alt="New NFT" />
        </div>
      </div>
    </div>
  );
}