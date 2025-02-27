import React from "react";

const DataMapper = ({ data, Component, componentProps = {}, getKey }) => {

  return (
    <>
      {data.map((item) => (
        <Component key={getKey(item)} {...item} {...componentProps} />
      ))}
    </>
  );
};

export default DataMapper;
