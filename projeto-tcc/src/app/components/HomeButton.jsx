import React from 'react';
import Link from 'next/link';

const buttonStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '140px',
    height: '140px',
    margin: '10px',
    padding: '10px',
    border: 'none',
    borderRadius: '10px',
    backgroundColor: '#4a90e2',
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
};

const iconStyle = {
    marginBottom: '10px',
};

const HomeButton = ({ href, icon: Icon, label }) => (
    <Link href={href} passHref>
        <button style={buttonStyle}>
            <Icon size={32} style={iconStyle} />
            {label}
        </button>
    </Link>
);

export default HomeButton;
