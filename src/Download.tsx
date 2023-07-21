import React from 'react';
import Papa from 'papaparse';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { utils, write } from 'xlsx';

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

    const csvAtag = document.createElement('a');
    csvAtag.download = filename;
    csvAtag.href = `data:application/csv;charset=UTF-8,${encodeURIComponent(output)}`;

    document.body.appendChild(csvAtag);
    csvAtag.click();
    document.body.removeChild(csvAtag);

    const worksheet = utils.json_to_sheet(exportData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelAtag = document.createElement('a');
    const blob = new Blob([write(workbook, {type: 'binary', bookType: 'xlsx'})], {type: 'application/octet-stream'});
    excelAtag.href = URL.createObjectURL(blob);

    // filename の拡張子を削除して .xlsx にする
    const filenameArray = filename.split('.');
    filenameArray.pop();
    excelAtag.download = filenameArray.join('.') + '.xlsx';

    document.body.appendChild(excelAtag);
    excelAtag.click();
    document.body.removeChild(excelAtag);

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
