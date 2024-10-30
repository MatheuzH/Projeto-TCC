import React from 'react';
import Link from 'next/link';
import './HomeButton.css';

const HomeButton = ({ href, icon: Icon, label }) => (
  <Link href={href} passHref>
    <button className="homeButton">
      <Icon size={32} className="iconStyle" />
      {label}
    </button>
  </Link>
);

export default HomeButton;
