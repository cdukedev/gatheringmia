import { useRouter } from 'next/router';

// This function will replace the navigate function from react-router-dom
export const useNextNavigation = () => {
  const router = useRouter();
  
  const navigate = (path, options = {}) => {
    router.push(path, undefined, options);
  };
  
  return { navigate };
};