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

    const output = Papa.unparse(features);
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
      {props.filename ? props.filename : 'CSVファイルを地図上にドラッグ&ドロップしてください'}
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
