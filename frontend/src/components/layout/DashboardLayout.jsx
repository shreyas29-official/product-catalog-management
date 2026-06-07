import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children, links }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Sidebar links={links} />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
