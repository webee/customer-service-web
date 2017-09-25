import React from 'react';
import styles from './App.css';
import MainLayout from './MainLayout';


export default function App() {
  return (
    <div className={styles.normal}>
      <MainLayout />
    </div>
  );
};


export const urlNameMap = {
  '/': '首页',
  '/setting': '设置',
};
