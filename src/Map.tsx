import React from 'react';

declare global {
  interface Window {
    geolonia: any;
  }
}

interface Props {
    className: string;
    setmap: Function;
}

const Component = (props: Props) => {
  const mapContainer = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const map = new window.geolonia.Map({
      container: mapContainer.current,
      style: "geolonia/gsi",
      hash: true,
    })

    map.on("load", () => {
      props.setmap(map)
    })
  }, [mapContainer, props])

  return (
    <>
      <div className={props.className} ref={mapContainer} data-navigation-control="on" data-gesture-handling="off"></div>
    </>
  );
}

export default Component;
