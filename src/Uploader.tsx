import React from 'react'

import {useDropzone} from 'react-dropzone'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons"
import { addIdToFeatures } from "./lib/add-id-to-features";
import Papa from 'papaparse';

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column' as 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '##FFFFFF',
  borderStyle: 'dashed',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: '#FFFFFF',
  outline: 'none',
  transition: 'border .24s ease-in-out',
}

const focusedStyle = {
  // borderColor: '#FF0000'
}

const acceptStyle = {
  // borderColor: '#FF0000'
}

const rejectStyle = {
  // borderColor: '#FF0000',
}

let lastTarget: any = null; // cache the last target here

const showUploader = (event: DragEvent) => {
  lastTarget = event.target; // cache the last target here
  const el = document.querySelector('.uploader') as HTMLDivElement
  el.style.display = "block"
}

const hideUploader = (event: DragEvent) => {
  if(event.target === lastTarget || event.target === document) {
    const el = document.querySelector('.uploader') as HTMLElement
    el.style.display = "none"
  }
}

interface Props {
  className: string;
  setFeatures: Function;
  setFilename: Function;
}

const Component = (props: Props) => {
  React.useEffect(() => {
    window.addEventListener('dragenter', showUploader)
    window.addEventListener('dragleave', hideUploader)
  })

  const onDrop = React.useCallback((acceptedFiles : any) => {
    acceptedFiles.forEach((file: any) => {
      props.setFilename(file.name)

      const reader = new FileReader()

      reader.onabort = () => () => {}
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        const data = reader.result as string

        const el = document.querySelector('.uploader') as HTMLElement
        el.style.display = "none"

        const csvData = Papa.parse(data, {
          header: true,
          skipEmptyLines: true,
        }).data;

        props.setFeatures(addIdToFeatures(csvData))
      }

      reader.readAsText(file)
    })

  }, [props])

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject
  } = useDropzone({ accept: {
    'text/plain': ['.csv', '.txt'],
  }, onDrop, maxFiles: 1, });

  const style = React.useMemo(() => ({
    ...baseStyle,
    ...(isFocused ? focusedStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isFocused,
    isDragAccept,
    isDragReject
  ]);

  return (
    <div className={props.className}>
      <div {...getRootProps({className: 'dropzone', style})}>
        <input {...getInputProps()} />
        <div>
          <p style={{ fontSize: '144px', margin: 0, lineHeight: '144px' }}><FontAwesomeIcon icon={ faCloudArrowUp } /></p>
          <p>CSV または GeoJSON フォーマットの位置情報データをドラッグ＆ドロップしてください。<br />
            ※ データをアップロードするとこれまでの作業内容は失われます。</p>
        </div>
      </div>
    </div>
  );
}

export default Component;
