
'use client'

import Header from './Header';

export default function ClientWrapper({ children }) {
  return (
    <>
      <Header />
      <div className="app-container">
        {children}
      </div>
    </>
  );
}