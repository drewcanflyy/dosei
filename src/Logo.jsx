import React from 'react';

const Logo = ({ size = 64, className = "", style = {} }) => {
    return (
        <img
            src="/logo.png"
            alt="DOSEI Logo"
            style={{ width: size, height: size, objectFit: 'contain', ...style }}
            className={className}
        />
    );
};

export default Logo;
