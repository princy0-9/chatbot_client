import React from 'react';
import { useTheme } from '../utils/ThemeContext';

const Themes = () => {
  const { theme, toggleTheme } = useTheme(); 

  return (
    <div style={{ display: 'flex', marginLeft: '100px' }}>
      <span style={{ marginRight: '10px', marginTop: '10px' }}>Light</span>
      <div
        onClick={toggleTheme}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '5px',
          borderRadius: '20px',
          backgroundColor: theme === 'light' ? '#ccc' : '#0056ff',
          cursor: 'pointer',
          color: theme === 'light' ? '#000' : '#fff',
          width: '66px',
          height: '33px',
          marginTop: '2px'
        }}
      >
        <div
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            transform: theme === 'dark' ? 'translateX(30px)' : 'translateX(0)',
            transition: 'transform 0.3s ease',
          }}
        ></div>
      </div>
      <span style={{ marginLeft: '10px', marginTop: '10px' }}>Dark</span>
    </div>
  );
};

export default Themes;
