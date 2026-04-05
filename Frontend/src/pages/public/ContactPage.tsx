import { Link } from 'react-router-dom';
import { MdSchool, MdEmail, MdPhone, MdLocationOn, MdArrowBack } from 'react-icons/md';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center"><MdSchool className="text-white text-xl" /></div>
            <span className="font-bold text-gray-800 text-lg">College CMS</span>
          </div>
          <Link to="/" className="btn-secondary text-sm"><MdArrowBack /> Back</Link>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-3">Contact Us</h1>
          <p className="text-gray-500 text-lg">Get in touch with our support team</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: MdEmail, label: 'Email', value: 'admin@college.edu', color: 'text-blue-600', bg: 'bg-blue-50' },
            { icon: MdPhone, label: 'Phone', value: '+91 9999999999', color: 'text-green-600', bg: 'bg-green-50' },
            { icon: MdLocationOn, label: 'Address', value: '123 College Road, City', color: 'text-red-600', bg: 'bg-red-50' },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className="card text-center">
              <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}><Icon className={`text-2xl ${color}`} /></div>
              <p className="font-bold text-gray-800 mb-1">{label}</p>
              <p className="text-gray-500 text-sm">{value}</p>
            </div>
          ))}
        </div>
        <div className="card max-w-lg mx-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Send a Message</h2>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div><label className="label">Name</label><input className="input" placeholder="Your name" /></div>
            <div><label className="label">Email</label><input type="email" className="input" placeholder="Your email" /></div>
            <div><label className="label">Message</label><textarea rows={4} className="input resize-none" placeholder="Your message..." /></div>
            <button className="btn-primary w-full justify-center">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}
