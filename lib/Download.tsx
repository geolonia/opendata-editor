import { useCallback, type MouseEvent } from 'react';
import Papa from 'papaparse';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { write, read } from 'xlsx';
import { styled } from 'styled-components';
import Button from './Button';
import type { Feature } from './types';

const DownloadWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

interface Props {
  features: Feature[];
  filename: string;
}

const Component = (props: Props) => {
  const {
    features,
    filename,
  } = props;

  const onClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const exportData = features.map((feature) => {
      const newFeature: Feature = {};
      for (let i = 0; i < Object.keys(feature).length; i++) {
        if (Object.keys(feature)[i] !== 'id' && Object.keys(feature)[i] !== 'title') {
          newFeature[Object.keys(feature)[i]] = Object.values(feature)[i];
        }
      }
      return newFeature;
    });

    const output = Papa.unparse(exportData);

    // CSV ダウンロード
    const csvAtag = document.createElement('a');
    csvAtag.download = filename;
    csvAtag.href = `data:application/csv;charset=UTF-8,${encodeURIComponent(output)}`;

    document.body.appendChild(csvAtag);
    csvAtag.click();
    document.body.removeChild(csvAtag);

    // Excel ダウンロード
    const workbook = read(output, {type: 'binary'});
    const wbout = write(workbook, {bookType: 'xlsx', type: 'array'});

    const excelAtag = document.createElement('a');
    const blob = new Blob([wbout], {type: 'application/octet-stream'});
    excelAtag.href = URL.createObjectURL(blob);

    // filename の拡張子を削除して .xlsx にする
    const filenameArray = filename.split('.');
    filenameArray.pop();
    excelAtag.download = `${filenameArray.join('.')}.xlsx`;

    document.body.appendChild(excelAtag);
    excelAtag.click();
    document.body.removeChild(excelAtag);

  }, [features, filename]);

  return (
    <DownloadWrapper>
      {props.filename ? props.filename : ''}
      <Button
        icon={faDownload}
        onClick={onClick}
      >
        エクスポート
      </Button>
    </DownloadWrapper>
  );
};

export default Component;
