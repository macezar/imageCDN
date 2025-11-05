import { Cloud } from 'lucide-react';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="container header-content">
        <div className="logo">
          <Cloud size={32} />
          <h1>Image CDN</h1>
        </div>
        <p className="tagline">Cloudinary-powered image management</p>
      </div>
    </header>
  );
}

export default Header;
