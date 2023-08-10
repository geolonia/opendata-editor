import React from 'react';

import {useDropzone} from 'react-dropzone';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';
import { styled } from 'styled-components';
import { addIdToFeatures } from './utils/add-id-to-features';
import { csv2rows } from './utils/csv2geojson';

import { Buffer } from 'buffer';
import Encoding from 'encoding-japanese';
import { xlsParser } from './utils/xlsParser';

const Dropzone = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  width: 90%;
  height: 80%;
  box-sizing: border-box;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;

  flex: 1;
  flex-direction: column;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: #FFFFFF;
  border-style: dashed;
  background-color: rgba(0, 0, 0, 0.5);
  color: #FFFFFF;
  outline: none;
  transition: border .24s ease-in-out;
`;

let lastTarget: any = null; // cache the last target here

const showUploader = (event: DragEvent) => {
  lastTarget = event.target; // cache the last target here
  const el = document.querySelector('.uploader') as HTMLDivElement;
  el.style.display = 'block';
};

const hideUploader = (event: DragEvent) => {
  if (event.target === lastTarget || event.target === document) {
    const el = document.querySelector('.uploader') as HTMLElement;
    el.style.display = 'none';
  }
};

interface Props {
  className: string; // Required to apply styles by styled-components
  setFeatures: Function;
  filename: string;
  setFilename: Function;
  setFitBounds: Function;
}

const Component = (props: Props) => {
  React.useEffect(() => {
    window.addEventListener('dragenter', showUploader);
    if (props.filename) {
      window.addEventListener('dragleave', hideUploader);
    }
  });

  const onDrop = React.useCallback((acceptedFiles : any) => {
    acceptedFiles.forEach((file: any) => {
      props.setFilename(file.name);

      const reader = new FileReader();

      reader.onabort = () => () => {};
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = async () => {
        const data = reader.result as ArrayBuffer;

        let csvData;
        if (file.type === 'text/csv') {
          const buffer = Buffer.from(data);
          const unicodeData = Encoding.convert(buffer, {
            to: 'UNICODE',
            from: 'AUTO',
            type: 'string',
          });
          csvData = csv2rows(unicodeData);
        } else {
          csvData = await xlsParser(data);
        }

        const el = document.querySelector('.uploader') as HTMLElement;
        el.style.display = 'none';

        props.setFitBounds(true);
        props.setFeatures(addIdToFeatures(csvData));
      };

      reader.readAsArrayBuffer(file);
    });

  }, [props]);

  const {
    getRootProps,
    getInputProps,
  } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    onDrop,
    maxFiles: 1,
  });

  return (
    <div className={props.className}>
      <Dropzone {...getRootProps()}>
        <input {...getInputProps()} />
        <div>
          <p style={{ fontSize: '144px', margin: 0, lineHeight: '144px' }}><FontAwesomeIcon icon={ faCloudArrowUp } /></p>
          <p>位置情報データを含むCSVファイルまたはExcelファイルをドラッグ＆ドロップしてください。<br />
            ※ データをアップロードするとこれまでの作業内容は失われます。</p>
        </div>
      </Dropzone>
    </div>
  );
};

export default Component;
