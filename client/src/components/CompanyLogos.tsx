import React from 'react';

interface LogoProps {
  name: string;
  isMarquee?: boolean;
}

const logoMapping: Record<string, string> = {
  'What Clicks': '/logos_opt/1.webp',
  'VS Dental': '/logos_opt/2.webp',
  'Credia Mediations': '/logos_opt/3.webp',
  'Thoospot': '/logos_opt/4.webp',
  'Tetra Platfms': '/logos_opt/5.webp',
  'PRN Construction': '/logos_opt/6.webp',
  'P Inc.': '/logos_opt/7.webp',
  'Pharach': '/logos_opt/8.webp',
  'Car Decore': '/logos_opt/9.webp',
  'Pandiyan Agency': '/logos_opt/10.webp'
};

function resolveUrl(path: string | undefined): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const baseUrl = import.meta.env.BASE_URL || '/';
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  const finalBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${finalBaseUrl}${cleanPath}`;
}

export default function CompanyLogo({ name }: LogoProps) {
  const logoSrc = logoMapping[name] || logoMapping['What Clicks'];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      width: '100%'
    }}>
      <img 
        src={resolveUrl(logoSrc)} 
        alt={name} 
        width="128" 
        height="128" 
        loading="lazy" 
        style={{ width: 'auto', height: '100%', maxHeight: '128px', objectFit: 'contain' }}
      />
    </div>
  );
}
