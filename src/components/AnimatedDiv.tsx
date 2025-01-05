// components/AnimatedDiv.tsx
import { useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface AnimatedDivProps {
  children: React.ReactNode;
  animationClass: string;
}

const AnimatedDiv: React.FC<AnimatedDivProps> = ({ children, animationClass }) => {
  const [isInView, setIsInView] = useState(false);
  const { ref } = useInView({
    threshold: 0.2, // Le pourcentage de la div visible pour déclencher l'animation
    triggerOnce: true, // L'animation ne se déclenche qu'une seule fois
    onChange: (inView) => setIsInView(inView),
  });

  return (
    <div
      ref={ref}
      className={`transition-transform duration-700 ease-out ${isInView ? animationClass : 'opacity-0 -translate-x-full'}`}
    >
      {children}
    </div>
  );
};

export default AnimatedDiv;

