import { useEffect, useRef } from "react";

export const useIsMounted = () => {
  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false) as unknown as void;
  }, []);

  return isMounted;
};
