import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import ServiceDetails from './pages/ServiceDetails'
import CaseStudies from './pages/CaseStudies'
import CaseStudy from './pages/CaseStudy'
import Contact from './pages/Contact'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Pricing from './pages/Pricing'
import Careers from './pages/Careers'
import JobPost from './pages/JobPost'
import OurThemes from './pages/OurThemes'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:slug" element={<ServiceDetails />} />
          <Route path="case-studies" element={<CaseStudies />} />
          <Route path="case-studies/:slug" element={<CaseStudy />} />
          <Route path="contact" element={<Contact />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="careers" element={<Careers />} />
          <Route path="careers/:slug" element={<JobPost />} />
          <Route path="themes" element={<OurThemes />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
