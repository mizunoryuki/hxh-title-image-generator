import { useEffect, useState } from 'react'
import './App.css'
import type { Title } from './types';

function App() {
  const [title, setTitle] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/example-title.json');
        const data: Title[] = await response.json();
        
        if (!data || data.length === 0) {
          setTitle('No titles available');
          return;
        }
        const id = Math.floor(Math.random() * data.length);
        setTitle(data[id].title);
      } catch (error) {
        console.error('Error fetching title:', error);
        setTitle('Error loading title');
      }
    }
    fetchData();
  }, [])

  const fontSizeStyle = {
    fontSize: title.length > 0 
      ? `calc(70cqw / ${title.length} * 1.1)` 
      : '1rem'
  };

  return (
    <div className='container'>
      <p className='title' style={fontSizeStyle}>
        {title}
      </p>
      <p className='subtitle'>ハンター語のタイトル</p>
    </div>
  )
}

export default App