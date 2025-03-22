// components/ThemeToggle.js

import { useState, useEffect } from 'react'
import styled from '@emotion/styled'

const ToggleButton = styled.button`
  --toggle-width: 80px;
  --toggle-height: 38px;
  --toggle-padding: 5px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-around;
  font-size: 1.5rem;
  line-height: 1;
  width: var(--toggle-width);
  height: var(--toggle-height);
  padding: var(--toggle-padding);
  border: 0;
  border-radius: calc(var(--toggle-width) / 2);
  cursor: pointer;
  background: var(--color-bg-toggle);
  transition: background 0.25s ease-in-out, box-shadow 0.25s ease-in-out;
  &:focus {
    outline-offset: 5px;
  }
  &:focus:not(:focus-visible) {
    outline: none;
  }
  &:hover {
    box-shadow: 0 0 5px 2px var(--color-bg-toggle);
  },
`

const ToggleThumb = styled.span`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  height: 33px;
  display: flex;
  align-items: center;
  width: 33px;
  border-radius: 50%;
  background: white;
  transition: transform 0.25s ease-in-out;
  transform: ${p =>
    p.activeTheme === 'dark' ? 'translate3d(calc(var(--toggle-width) - var(--toggle-height)), 0, 0)' : 'none'};
`

const ThemeToggle = () => {
  const [activeTheme, setActiveTheme] = useState(document.body.dataset.theme)
  const inactiveTheme = activeTheme === 'light' ? 'dark' : 'light'

  useEffect(() => {
    document.body.dataset.theme = activeTheme
    window.localStorage.setItem('theme', activeTheme)
  }, [activeTheme])
  return (
    <ToggleButton
      className='toogle'
      aria-label={`Change to ${inactiveTheme} mode`}
      title={`Change to ${inactiveTheme} mode`}
      type='button'
      onClick={() => setActiveTheme(inactiveTheme)}
    >
      <ToggleThumb activeTheme={activeTheme} className='toogle_thumb' />
      <span className='moon'>🌙</span>
      <span className='sun'>☀️</span>
    </ToggleButton>
  )
}

export default ThemeToggle
