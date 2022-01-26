import { useEffect, useRef } from 'react';

import { Nullable } from 'shared/types';

export const useIntersect = (element: Nullable<Element>, onIntersect: () => void) => {
  const observerRef = useRef<IntersectionObserver>();

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      const [target] = entries;

      if (target.isIntersecting) {
        onIntersect();
      }
    });
  }, []);

  useEffect(() => {
    if (!element || !observerRef.current) return;

    const observer = observerRef.current;

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [element]);
};
