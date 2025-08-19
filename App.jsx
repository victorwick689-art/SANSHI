import { Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Branches from './pages/Branches'
import Projects from './pages/Projects'
import Donate from './pages/Donate'
import Contact from './pages/Contact'
function Nav() {
  const base = 'px-3 py-2 rounded hover:bg-red-50'
  const active = 'text-brandRed font-semibold'
  return (<nav className="flex items-center justify-between p-4 border-b">
    <div className="text-xl font-bold text-brandRed">SanShine</div>
    <div className="flex gap-3">
      <NavLink to="/" className={({isActive}) => (isActive? active: '') + ' ' + base}>Home</NavLink>
      <NavLink to="/about" className={({isActive}) => (isActive? active: '') + ' ' + base}>About</NavLink>
      <NavLink to="/branches" className={({isActive}) => (isActive? active: '') + ' ' + base}>Branches</NavLink>
      <NavLink to="/projects" className={({isActive}) => (isActive? active: '') + ' ' + base}>Projects</NavLink>
      <NavLink to="/donate" className={({isActive}) => (isActive? active: '') + ' ' + base}>Donate</NavLink>
      <NavLink to="/contact" className={({isActive}) => (isActive? active: '') + ' ' + base}>Contact</NavLink>
    </div></nav>)
}
export default function App(){ return (<div className="min-h-screen flex flex-col"><Nav/><div className="flex-1"><Routes>
  <Route path="/" element={<Home/>}/>
  <Route path="/about" element={<About/>}/>
  <Route path="/branches" element={<Branches/>}/>
  <Route path="/projects" element={<Projects/>}/>
  <Route path="/donate" element={<Donate/>}/>
  <Route path="/contact" element={<Contact/>}/>
</Routes></div><footer className="p-6 text-center border-t text-sm">© {new Date().getFullYear()} SanShine Organisation — We Rise in Him</footer></div>) }