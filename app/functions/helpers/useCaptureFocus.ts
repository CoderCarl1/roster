import { useEffect, useRef } from "react";

type useCaptureFocusProps<T> = {
  cb: (value?: KeyboardEvent) => unknown;
  initialRef?: React.RefObject<T>;
}

export function useCaptureFocus<T extends HTMLElement>({cb, initialRef}: useCaptureFocusProps<T>): React.MutableRefObject<T | null>{
  const domRef = useRef(initialRef ? initialRef.current : null);

  useEffect(() => {
    function handleKeyPress(event: KeyboardEvent){
      event.stopPropagation();
      if (event.key === 'Escape') {
        cb(event);
      } else if (event.key === 'Tab') {
        const elementsArray = [...domRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ) as NodeListOf<HTMLElement>];
          
        if (elementsArray.length) {
          const currentIndex = elementsArray.indexOf(document.activeElement as HTMLElement);
          const lastIndex = elementsArray.length - 1;
          
          if (event.shiftKey && currentIndex === 0) {
            event.preventDefault();
            elementsArray[lastIndex].focus();
          } else if (!event.shiftKey && currentIndex === lastIndex) {
            event.preventDefault();
            elementsArray[0].focus();
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyPress, true);

    return () => {
      document.removeEventListener(
          'keydown',
          handleKeyPress,
          true
      );
  };
  },[domRef])

  
  return domRef;
}

export default useCaptureFocus;