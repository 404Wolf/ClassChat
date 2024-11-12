import { useState, useEffect, useCallback } from "react";

const useTypewriter = (speed: number, initialText: string | string[]) => {
  const [displayText, setDisplayText] = useState(initialText[0]);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [doneTyping, setDoneTyping] = useState(false);
  const [typingText, setTypingText] = useState(initialText);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setTimeout(() => {
      if (currentIndex < typingText.length) {
        setDisplayText((prevText) => prevText + typingText[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      } else {
        setDoneTyping(true);
      }
    }, speed);

    return () => {
      clearTimeout(timer);
    };
  }, [currentIndex, speed, typingText, isPaused]);

  const reset = useCallback(() => {
    setDisplayText("");
    setCurrentIndex(0);
    setDoneTyping(false);
  }, []);

  const changeTypingText = useCallback(
    (newText: string) => {
      setTypingText(newText);
      reset();
    },
    [reset]
  );

  const pauseTyping = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resumeTyping = useCallback(() => {
    setIsPaused(false);
  }, []);

  return {
    displayText,
    doneTyping,
    reset,
    changeTypingText,
    pauseTyping,
    resumeTyping,
  };
};

export default useTypewriter;
