import { createGlobalStyle } from 'styled-components';

export const lightTheme = {
  body: '#f4f7fb',
  text: '#1e293b',
  textLight: '#64748b',
  cardBg: '#ffffff',
  cardBorder: '#e2e8f0',
  sidebarBg: 'rgba(255, 255, 255, 0.85)',
  sidebarActiveBg: '#eff6ff',
  sidebarActiveText: '#2563eb',
  shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
  glassBlur: '12px',
  primary: '#2563eb',
  primaryHover: '#1d4ed8',
  primaryText: '#ffffff',
  danger: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',
  borderColor: '#e2e8f0',
  inputBg: '#ffffff',
  scrollTrack: '#f8fafc',
  scrollThumb: '#cbd5e1'
};

export const darkTheme = {
  body: '#0b1121',
  text: '#f8fafc',
  textLight: '#94a3b8',
  cardBg: '#1e293b',
  cardBorder: '#334155',
  sidebarBg: 'rgba(15, 23, 42, 0.85)',
  sidebarActiveBg: '#334155',
  sidebarActiveText: '#60a5fa',
  shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.5)',
  glassBlur: '12px',
  primary: '#3b82f6',
  primaryHover: '#60a5fa',
  primaryText: '#ffffff',
  danger: '#f87171',
  success: '#34d399',
  warning: '#fbbf24',
  borderColor: '#334155',
  inputBg: '#0f172a',
  scrollTrack: '#0f172a',
  scrollThumb: '#475569'
};

export const GlobalStyles = createGlobalStyle<{ theme?: typeof lightTheme | typeof darkTheme }>`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }

  body {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: background 0.3s ease, color 0.3s ease;
    overflow-x: hidden;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.scrollTrack};
  }
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.scrollThumb};
    border-radius: 6px;
    border: 2px solid ${({ theme }) => theme.scrollTrack};
  }
  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.textLight};
  }

  /* Smooth fading animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animated-fade {
    animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
`;
