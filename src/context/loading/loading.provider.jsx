import {createContext, useState} from 'react';

const INITIAL_STATE = {
  loading: false,
};

export const LoadingContext = createContext(INITIAL_STATE);

const LoadingProvider = ({children}) => {
  const [loading, setLoading] = useState(false);

  const values = {
    loading,
    setLoading,
  };
  return (
    <LoadingContext.Provider value={values}>{children}</LoadingContext.Provider>
  );
};

export default LoadingProvider;
