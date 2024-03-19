import React, { useEffect, useState } from "react";

const Square = ({ turn, onClick, finished, reset, setResetBool, val }) => {
  const [value, setValue] = useState(val);

  const handleClick = () => {
    if (!value && !finished) {
      setValue(turn);
      onClick();
    }
  };

  const resetVals = () => {
    if (reset) {
      setValue("");
      setResetBool(false);
    }
  };

  useEffect(() => {
    setValue(val);
  }, [val]);

  useEffect(() => {
    resetVals();
  }, [reset]);

  return (
    <div className="square" onClick={handleClick}>
      {value}
    </div>
  );
};

export default Square;
