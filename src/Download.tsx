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
  const ref = React.useRef<HTMLButtonElement>(null)

  const onClick = React.useCallback((event: MouseEvent) => {
    const output = Papa.unparse(props.features);
    const el = document.createElement('a')
    el.download = props.filename;
    el.href = `data:application/csv;charset=UTF-8,${encodeURIComponent(output)}`

    document.body.appendChild(el)
    el.click()

    document.body.removeChild(el)
  }, [props])


  React.useEffect(() => {
    if (ref.current) {
      ref.current.disabled = false
      ref.current.style.cursor = 'pointer'
      ref.current.onclick = onClick
    }
  }, [onClick])

  return (
    <button className="download-button" ref={ref} disabled={true}><FontAwesomeIcon icon={faDownload} className="button-icon" />エクスポート</button>
  );
}

export default Component;
