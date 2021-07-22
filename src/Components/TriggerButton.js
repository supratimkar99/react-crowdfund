import React from 'react';
const Trigger = ({ isLoading, triggerText, buttonRef, showModal }) => {
  let Btn = <button className="btn btn-lg btn-danger center" ref={buttonRef} onClick={showModal}>{triggerText}</button>;
  if(isLoading) {
    Btn = <button className="btn btn-lg btn-danger center" ref={buttonRef} onClick={showModal} disabled>{triggerText}</button>; 
  }
  return (
    <div>{Btn}</div>
  );
};
export default Trigger;
