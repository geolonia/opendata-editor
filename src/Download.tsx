import React from 'react';

interface Props {
  className?: string;
  data: GeoJSON.FeatureCollection
}

const Component = (props: Props) => {
  const handleClick = () => {
    console.log(props.data.features)
  };

  return (
    <div className="main">
      <div className="container">
        <h1>ダウンロード</h1>
        <button onClick={handleClick}>ダウンロード</button>
      </div>
    </div>
  );
}

export default Component;
