import React from 'react';
import { 
  FiMousePointer, 
  FiActivity, 
  FiBriefcase, 
  FiCpu, 
  FiLayers, 
  FiHardDrive, 
  FiGlobe, 
  FiSliders, 
  FiTruck,
  FiShoppingBag
} from 'react-icons/fi';

interface LogoProps {
  name: string;
  isMarquee?: boolean;
}

export default function CompanyLogo({ name, isMarquee = false }: LogoProps) {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: isMarquee ? 'flex-start' : 'center',
    gap: '10px',
    color: '#1a1a1a',
    height: '100%',
    width: '100%',
    padding: isMarquee ? '0 8px' : '0'
  };

  switch (name) {
    case 'What Clicks':
      return (
        <div style={containerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(249, 115, 22, 0.1)', color: 'var(--orange)', flexShrink: 0 }}>
            <FiMousePointer size={14} style={{ transform: 'rotate(90deg)' }} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '13.5px', letterSpacing: '-0.3px', fontFamily: "'Syne', sans-serif" }}>What<span style={{ color: 'var(--orange)' }}>Clicks</span></span>
        </div>
      );
    case 'VS Dental':
      return (
        <div style={containerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9', flexShrink: 0 }}>
            <FiActivity size={14} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '13.5px', letterSpacing: '-0.3px', fontFamily: "'Syne', sans-serif" }}>VS <span style={{ color: '#0ea5e9', fontWeight: 600 }}>Dental</span></span>
        </div>
      );
    case 'Credia Mediations':
      return (
        <div style={containerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', flexShrink: 0 }}>
            <FiBriefcase size={14} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '13.5px', letterSpacing: '-0.3px', fontFamily: "'Syne', sans-serif" }}>Credia <span style={{ color: '#10b981', fontWeight: 600 }}>Mediations</span></span>
        </div>
      );
    case 'Thoospot':
      return (
        <div style={containerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', flexShrink: 0 }}>
            <FiCpu size={14} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '13.5px', letterSpacing: '-0.3px', fontFamily: "'Syne', sans-serif" }}>Thoo<span style={{ color: '#6366f1' }}>spot</span></span>
        </div>
      );
    case 'Tetra Platfms':
      return (
        <div style={containerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', flexShrink: 0 }}>
            <FiLayers size={14} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '13.5px', letterSpacing: '-0.3px', fontFamily: "'Syne', sans-serif" }}>Tetra <span style={{ color: '#ec4899', fontWeight: 600 }}>Platfms</span></span>
        </div>
      );
    case 'PRN Construction':
      return (
        <div style={containerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(107, 114, 128, 0.1)', color: '#4b5563', flexShrink: 0 }}>
            <FiHardDrive size={14} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '13.5px', letterSpacing: '-0.3px', fontFamily: "'Syne', sans-serif" }}>PRN <span style={{ color: '#4b5563', fontWeight: 600 }}>Const</span></span>
        </div>
      );
    case 'P Inc.':
      return (
        <div style={containerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', flexShrink: 0 }}>
            <FiGlobe size={14} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '13.5px', letterSpacing: '-0.3px', fontFamily: "'Syne', sans-serif" }}>P <span style={{ color: '#a855f7', fontWeight: 600 }}>Inc.</span></span>
        </div>
      );
    case 'Pharach':
      return (
        <div style={containerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(234, 179, 8, 0.1)', color: '#eab308', flexShrink: 0 }}>
            <FiSliders size={14} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '13.5px', letterSpacing: '-0.3px', fontFamily: "'Syne', sans-serif" }}>Pha<span style={{ color: '#eab308' }}>rach</span></span>
        </div>
      );
    case 'Car Decore':
      return (
        <div style={containerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', flexShrink: 0 }}>
            <FiTruck size={14} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '13.5px', letterSpacing: '-0.3px', fontFamily: "'Syne', sans-serif" }}>Car <span style={{ color: '#ef4444', fontWeight: 600 }}>Decore</span></span>
        </div>
      );
    case 'Pandiyan Agency':
      return (
        <div style={containerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(20, 184, 166, 0.1)', color: '#14b8a6', flexShrink: 0 }}>
            <FiShoppingBag size={14} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '13.5px', letterSpacing: '-0.3px', fontFamily: "'Syne', sans-serif" }}>Pandiyan <span style={{ color: '#14b8a6', fontWeight: 600 }}>Agency</span></span>
        </div>
      );
    default:
      return <span style={{ fontWeight: '700' }}>{name}</span>;
  }
}
