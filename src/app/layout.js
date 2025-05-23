
import './globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import  Header  from './components/Header';

import {Gabarito} from 'next/font/google'

const prompt = Gabarito({
  weight: '400',
  subsets: ['latin']
})




export const metadata = {
  title: "Patinha do Bem",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br" className={prompt.className}>
      <body>
        <div className='app-container'>
          
        <Header/>
        {children}
       
        
        </div>  
       
      </body>
    </html>
  );
}
