import React from 'react';
import spinner from '../spinner_w.gif';

export const Form = ({ onSubmit, isLoading }) => {

  let submitText = <button className="form-control btn btn-primary" type="submit">Submit</button>;
  if(isLoading) {
    submitText = <div><img src={spinner} style={{ width: '50px',height: '50px', margin: 'auto', display: 'block' }} alt="Loading..." /><button className="form-control btn btn-primary" type="submit" disabled>The project is being created...</button></div>;
  }
  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input className="form-control" id="title" />
      </div>
      <div className="form-group">
        <label htmlFor="desc">Description</label>
        <textarea className="form-control" id="desc" />
      </div>
      <div className="form-group">
        <label htmlFor="amountGoal">Amount (in ETH)</label>
        <input className="form-control" id="amountGoal" />
      </div>
      <div className="form-group">
        <label htmlFor="duration">Duration (in Days)</label>
        <input type="number" className="form-control" id="duration" />
      </div>
      <div className="form-group">
        {submitText}
      </div>
    </form>
  );
};
export default Form;
