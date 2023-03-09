import React from 'react';

interface Props {
  className?: string;
}

const Component = (props: Props) => {
  return (
    <div className="main">
      <div className="container">
        <h1>設定</h1>
      </div>
    </div>
  );
}

export default Component;
