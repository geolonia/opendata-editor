import { useParams } from "react-router-dom";
import { createRef, useRef } from 'react';

interface Props {
  className?: string;
  data: GeoJSON.FeatureCollection
}

const Component = (props: Props) => {
  let { id } = useParams();

  const refs = useRef([]);
  const properties = props.data.features[Number(id)].properties;

  if (properties) {
    for (let i = 0; i < Object.keys(properties).length; i++) {
      // @ts-ignore
      refs.current[i] = createRef();
    }
  }

  const handleClick = () => {
    if (properties) {
      for (let i = 0; i < Object.keys(properties).length; i++) {
        // @ts-ignore
        console.log(refs.current[i]?.value);
      }
    }
    alert("保存しました。");
  };

  return (
    <div className="main">
      <div className="container">
        <h1>編集</h1>
          <ul>
          {properties && Object.keys(properties).map((key, i) => {
            return key !== 'title' && key !== 'description' && (
              <li key={i}>
                {key}: <input ref={refs.current[i]} type="text" defaultValue={properties[key]} />
              </li>
            );
          })}
          </ul>
          <button onClick={handleClick}>保存</button>
      </div>
    </div>
  );
}

export default Component;
