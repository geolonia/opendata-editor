import React from 'react';

import { Link, useLocation } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faTable, faDownload } from "@fortawesome/free-solid-svg-icons";

interface Props {
  className?: string;
}

const Component = (props: Props) => {
  const location = useLocation();

  const menu = [
    {
      path: '/',
      icon: faHome,
    },
    {
      path: '/table',
      icon: faTable,
    },
    {
      path: '/download',
      icon: faDownload,
    },
  ]

  return (
    <ul className={props.className}>
      {menu.map((item, i) => {
        if (item.path === location.pathname) {
          return <li key={i}><Link to={item.path}><FontAwesomeIcon icon={item.icon} className="icons active" /></Link></li>
        } else {
          return <li key={i}><Link to={item.path}><FontAwesomeIcon icon={item.icon} className="icons" /></Link></li>
        }
      })}
    </ul>
  );
}

export default Component;
