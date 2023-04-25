import React from 'react';
import Papa from 'papaparse';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

interface Feature {
  [key: string]: string;
}
interface Props {
  className?: string;
  features: Feature[];
  filename: string;
}

const Component = (props: Props) => {
  const ref = React.useRef<HTMLButtonElement>(null);

  const {
    features,
    filename,
  } = props;

  const onClick = React.useCallback((event: MouseEvent) => {
    event.preventDefault();

    const exportData = features.map((feature) => {
      const newFeature: Feature = {}
      for(let i = 0; i < Object.keys(feature).length; i++) {
        if (Object.keys(feature)[i] !== 'id' && Object.keys(feature)[i] !== 'title') {
          newFeature[Object.keys(feature)[i]] = Object.values(feature)[i];
        }
      }
      return newFeature;
    })

    const output = Papa.unparse(exportData);
    const el = document.createElement('a');
    el.download = filename;
    el.href = `data:application/csv;charset=UTF-8,${encodeURIComponent(output)}`;

    document.body.appendChild(el);
    el.click();

    document.body.removeChild(el);
  }, [features, filename]);


  React.useEffect(() => {
    if (ref.current) {
      ref.current.disabled = false;
      ref.current.style.cursor = 'pointer';
      ref.current.onclick = onClick;
    }
  }, [onClick]);

  return (
    <div className="download">
      {props.filename ? props.filename : ''}
      <button
        className="download-button"
        ref={ref}
        disabled={true}
      >
        <FontAwesomeIcon icon={faDownload} className="button-icon" />
        エクスポート
      </button>
    </div>
  );
}

export default Component;
