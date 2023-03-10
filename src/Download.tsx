import React from 'react';
import Papa from 'papaparse';

interface Feature {
  [key: string]: string;
}
interface Props {
  className?: string;
  features: Feature[];
}

const Component = (props: Props) => {
  const ref = React.useRef<HTMLButtonElement>(null)

  const onClick = React.useCallback((event: MouseEvent) => {
    const output = Papa.unparse(props.features);
    const el = document.createElement('a')
    el.download = 'data.csv'
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
    <div className="main">
      <div className="container">
        <h1>ダウンロード</h1>
        <button className="download-button" ref={ref} disabled={true}>ダウンロード</button>
      </div>
    </div>
  );
}

export default Component;
