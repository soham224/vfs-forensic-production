import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function Content({ children }) {
  const location = useLocation();
  const animationEndClass = "grid-animateContent-finished";
  const [cssClassesState, setCssClassesState] = useState([
    "grid-animateContent",
    animationEndClass
  ]);

  useEffect(() => {
    // Remove animationEndClass to restart animation
    const startAnimation = cssClassesState.filter(el => el !== animationEndClass);
    setCssClassesState(startAnimation);

    const timeOutId = setTimeout(() => {
      setCssClassesState([...startAnimation, animationEndClass]);
    }, 200);

    return () => {
      clearTimeout(timeOutId);
    };
  }, [location.pathname]); // 🔄 Listens for route changes

  return <>{children}</>;
}
