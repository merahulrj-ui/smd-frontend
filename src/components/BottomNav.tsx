"use client";
import Link from 'next/link';
import { useUI } from '@/context/UIContext';
import { usePathname } from 'next/navigation';

const navStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  height: 68,
  background: '#fff',
  borderTop: '1px solid #e2e8f0',
  zIndex: 90,
  display: 'flex',
  alignItems: 'stretch',
  boxShadow: '0 -4px 16px rgba(0,0,0,0.05)',
  WebkitTapHighlightColor: 'transparent',
  userSelect: 'none',
};

const itemStyle: React.CSSProperties = {
  flex: '1 1 0%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 3,
  textDecoration: 'none',
  outline: 'none',
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  padding: 0,
  color: '#64748b',
};

const activeColor = '#2563eb';

const iconStyle: React.CSSProperties = {
  fontSize: 21,
  lineHeight: 1,
};

const labelStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 500,
  whiteSpace: 'nowrap',
  lineHeight: 1,
};

const activeLabelStyle: React.CSSProperties = {
  ...labelStyle,
  fontWeight: 700,
};

const searchContainerStyle: React.CSSProperties = {
  flex: '1 1 0%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-end',
  position: 'relative',
  paddingBottom: 9,
};

const fabStyle: React.CSSProperties = {
  position: 'absolute',
  top: -16,
  width: 52,
  height: 52,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '4px solid #fff',
  boxShadow: '0 6px 16px rgba(37,99,235,0.25)',
  cursor: 'pointer',
  outline: 'none',
  fontSize: 19,
};

export default function BottomNav() {
  const { setMobileDrawerOpen, setSearchOpen } = useUI();
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <nav style={navStyle} className="lg:hidden">
      {/* Home */}
      <Link href="/" prefetch={true} style={{ ...itemStyle, color: isActive('/') ? activeColor : '#64748b' }}>
        <i className="fas fa-home" style={iconStyle}></i>
        <span style={isActive('/') ? activeLabelStyle : labelStyle}>Home</span>
      </Link>

      {/* Categories */}
      <Link href="/categories" prefetch={true} style={{ ...itemStyle, color: isActive('/categories') ? activeColor : '#64748b' }}>
        <i className="fas fa-layer-group" style={iconStyle}></i>
        <span style={isActive('/categories') ? activeLabelStyle : labelStyle}>Categories</span>
      </Link>

      {/* Search */}
      <div style={searchContainerStyle}>
        <button style={fabStyle} onClick={() => setSearchOpen(true)} aria-label="Search">
          <i className="fas fa-search"></i>
        </button>
        <span style={{ ...labelStyle, color: '#64748b' }}>Search</span>
      </div>

      {/* Contact */}
      <Link href="/contact" prefetch={true} style={{ ...itemStyle, color: isActive('/contact') ? activeColor : '#64748b' }}>
        <i className="fas fa-headset" style={iconStyle}></i>
        <span style={isActive('/contact') ? activeLabelStyle : labelStyle}>Contact</span>
      </Link>

      {/* Menu */}
      <button style={itemStyle} onClick={() => setMobileDrawerOpen(true)} aria-label="Menu">
        <i className="fas fa-bars" style={iconStyle}></i>
        <span style={labelStyle}>Menu</span>
      </button>
    </nav>
  );
}
