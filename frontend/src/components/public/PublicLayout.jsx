import PublicNavbar from './PublicNavbar';
import PublicFooter from './PublicFooter';

export default function PublicLayout({ children }) {
  return (
    <div className="public-layout">
      <PublicNavbar />
      <main className="public-main">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}