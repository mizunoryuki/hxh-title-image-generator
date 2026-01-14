import { useEffect, useRef, useState, type ReactNode } from 'react'
import html2canvas from 'html2canvas'
import './App.css'
import type { Title } from './types';

function App() {
  const [titles, setTitles] = useState<Title[]>([])
  const [title, setTitle] = useState({ title_full: '', title_half: '' })
  const captureRef = useRef<HTMLDivElement | null>(null)

  const pickRandomTitle = (list: Title[]) => {
    if (!list.length) return { title_full: 'No titles available', title_half: '' }
    const id = Math.floor(Math.random() * list.length)
    const chosen = list[id]
    return { title_full: chosen.title_full, title_half: chosen.title_half }
  }

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

      return nodes
    }, [])
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/example-title.json')
        const data: Title[] = await response.json()

        if (!data || data.length === 0) {
          setTitle({ title_full: 'No titles available', title_half: '' })
          return
        }

        setTitles(data)
        setTitle(pickRandomTitle(data))
      } catch (error) {
        console.error('Error fetching title:', error)
        setTitle({ title_full: 'Error loading title', title_half: '' })
      }
    }
    fetchData()
  }, [])

  const handleReroll = () => {
    if (!titles.length) return
    setTitle(pickRandomTitle(titles))
  }

  const handleScreenshot = async () => {
    if (!captureRef.current) return

    try {
      const links = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'))
      const pendingCss = links.filter((link) => !link.sheet)

      if (pendingCss.length) {
        console.warn('Stylesheets are still loading; screenshot may miss styles:', pendingCss.map((l) => l.href))
      }
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready
      }
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))

      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: '#ffffff',
        scale: 1,
      })

      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `${title.title_full}.png`
      link.click()
    } catch (error) {
      console.error('Error taking screenshot:', error)
    }
  }

  return (
    <div className='container'>
      <div className='capture-area' ref={captureRef}>
        <p className='title'>
          {title && formatTitle(title.title_half, 'title')}
        </p>
        <p className='subtitle'>{title && formatTitle(title.title_full, 'subtitle')}</p>
      </div>

      <div className='actions'>
        <button className='button' onClick={handleScreenshot}>
          スクショ
        </button>
        <button className='button' onClick={handleReroll}>
          リロール
        </button>
      </div>
    </div>
  )
}

export default App