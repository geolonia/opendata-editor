import React from 'react';

interface Props {
  className?: string;
  data: GeoJSON.FeatureCollection
}

const Component = (props: Props) => {
  return (
    <div className="main">
      <div className="container">
        <h1>レコードの一覧</h1>
        <p>{props.data.features.length}件のデータが登録されています。</p>
      </div>
    </div>
  );
}

export default Component;
