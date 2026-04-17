import { useState } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefine') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueTostore = value instanceof Function ? value(setStoredValue) : value
      setStoredValue(valueTostore)
      if (typeof window !== "undefined"){
        window.localStorage.setItem(key, JSON.stringify(valueTostore))
      }

    } catch (error){
      console.log(error)
    }
  }

  return [storedValue, setValue]

}
