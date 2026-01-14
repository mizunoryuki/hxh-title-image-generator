import {  useEffect, useState, type ReactNode } from 'react'
import './App.css'
import type { Title } from './types';

function App() {
  const [title, setTitle] = useState({title_full: '', title_half: ''})

  const formatTitle = (value: string,option: 'title' | 'subtitle'): ReactNode[] => {
    const parts = value.split('×')

    return parts.reduce<ReactNode[]>((nodes, part, index) => {
      nodes.push(<span key={`part-${index}`}>{part}</span>)

      if (index < parts.length - 1) {
        nodes.push(
          <span key={`sep-${index}`} className={`${option}-separator`}>
            ×
          </span>
        )
      }

      console.log(nodes)

      return nodes
    }, [])
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/example-title.json');
        const data: Title[] = await response.json();
        
        if (!data || data.length === 0) {
          setTitle({title_full: 'No titles available', title_half: ''});
          return;
        }
        const id = Math.floor(Math.random() * data.length);
        setTitle({title_full: data[id].title_full, title_half: data[id].title_half});
      } catch (error) {
        console.error('Error fetching title:', error);
        setTitle({title_full: 'Error loading title', title_half: ''});
      }
    }
    fetchData();
  }, [])

  return (
    <div className='container'>
      <p className='title'>
        {title && formatTitle(title.title_half, 'title')}
      </p>
      <p className='subtitle'>{title && formatTitle(title.title_full, 'subtitle')}</p>
    </div>
  )
}

export default App