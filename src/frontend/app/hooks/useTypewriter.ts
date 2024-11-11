import { useState, useEffect, useCallback } from "react";

const useTypewriter = (speed: number, initialText: string) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [doneTyping, setDoneTyping] = useState(false);
  const [typingText, setTypingText] = useState(initialText);

  useEffect(() => {
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
  }, [currentIndex, speed, typingText]);

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

  return { displayText, doneTyping, reset, changeTypingText };
};

export default useTypewriter;
