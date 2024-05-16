import { createContext, useEffect, useState } from "react";
// import data from '../utility/data.json'

export const SaltContext = createContext();

const SaltProvider = ({ children }) => {
  const [allSaltData, setAllSaltData] = useState(null);
  const [saltSuggestion, setSaltSuggestion] = useState([]);

  // useEffect(() => {
  //   setAllSaltData(data.data);
  // }, []);

  useEffect(() => {
    if (allSaltData) {
      setSaltSuggestion(allSaltData.saltSuggestions);
    }
  }, [allSaltData]);

  // console.log(allSaltData && saltSuggestion, "salt suggestion");

  return (
    <SaltContext.Provider
      value={{
        saltSuggestion,
        allSaltData,
        setAllSaltData
      }}
    >
      {children}
    </SaltContext.Provider>
  );
};

export default SaltProvider;
