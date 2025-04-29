'use client'
import React, { useState, useEffect } from 'react';
import { ArrowRight, Github, Linkedin, Mail, FolderOpen, ChevronDown } from 'lucide-react';
import ContactForm from '@/components/ui/ContactForm';
import Link from 'next/link';
import Image from 'next/image';
import TechnicalKeywords from '@/components/SEO/TechnicalKeywords';
import DeveloperSchema from '@/components/schema/DeveloperSchema';
import PersonSchema from '@/components/schema/PersonSchema';

// Writer-focused homepage with enhanced SEO
const Hero = () => {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const openContactForm = () => {
    setIsContactFormOpen(true);
  };

  const scrollToContent = () => {
    const contentSection = document.getElementById('content-section');
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Add mouse follow effect for the image
    const handleMouseMove = (e) => {
      const profileImage = document.querySelector('.profile-image-container');
      if (!profileImage) return;

      const { left, top, width, height } = profileImage.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      
      // Calculate rotation based on mouse position
      // Limit the rotation to a subtle amount
      const rotateX = ((y - height / 2) / height) * 5; // 5 degrees max
      const rotateY = ((x - width / 2) / width) * -5; // 5 degrees max
      
      profileImage.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
      const profileImage = document.querySelector('.profile-image-container');
      if (!profileImage) return;
      
      // Reset the rotation when mouse leaves
      profileImage.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    };

    document.addEventListener('mousemove', handleMouseMove);
    const profileImage = document.querySelector('.profile-image-container');
    if (profileImage) {
      profileImage.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (profileImage) {
        profileImage.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  // Enhanced writer persona description with SEO-focused keywords & developer credentials
  const writerDescription = "Published author of 5 Tamil poetry books exploring social justice, feminist themes, and human emotion. I balance my literary creativity with my technical expertise as a Full Stack MERN Developer, bringing the best of both worlds to everything I create.";

  return (
    <>
      {/* Writer Schema.org structured data for homepage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "@id": "https://ajithkumarr.com/#ajithkumar",
            "name": "Ajithkumar",
            "alternateName": "Ajith Kumar",
            "description": "Tamil writer with 5 published poetry books and Full Stack MERN Developer, creating compelling literature that explores themes of feminism, social justice, and human emotions.",
            "image": "https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741809430/techblog/ujikvc0er4tebs8mps0d.jpg",
            "url": "https://ajithkumarr.com",
            "sameAs": [
              "https://github.com/ajith2401",
              "https://www.linkedin.com/in/ajithkumar-r-a6531a232/",
              "https://www.instagram.com/ajithkumarr"
            ],
            "knowsLanguage": ["Tamil", "English"],
            "jobTitle": ["Full Stack Developer", "Writer and Poet"],
            "alumniOf": {
              "@type": "CollegeOrUniversity",
              "name": "University Name"
            },
            "publishingPrinciples": "https://ajithkumarr.com/about",
            "workLocation": {
              "@type": "Place",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "India"
              }
            },
            "worksFor": {
              "@type": "Organization",
              "name": "Current Employer"
            },
            "hasOccupation": [
              {
                "@type": "Occupation",
                "name": "Full Stack Developer",
                "occupationCategory": "Software Developer",
                "skills": "MERN Stack, JavaScript, React, Node.js, MongoDB, Express"
              },
              {
                "@type": "Occupation",
                "name": "Writer",
                "occupationCategory": "Author",
                "skills": "Tamil Poetry, Essays, Lyrics"
              }
            ],
            "hasCredential": {
              "@type": "EducationalOccupationalCredential",
              "name": "Published Author",
              "description": "Author of 5 published Tamil poetry books"
            }
          })
        }}
      />
      <>
      {/* Schema for "ajithkumar writer" searches */}
      <PersonSchema includeFullBio={true} />
      
      {/* Schema for "ajithkumar developer" searches */}
      <DeveloperSchema includedSkills={[
        'JavaScript',
        'React.js',
        'Node.js',
        'Express.js',
        'MongoDB',
        'MERN Stack',
        'Full Stack Development',
        'Web Application Development'
      ]} />
      
      {/* Additional technical keywords targeting */}
      <TechnicalKeywords />
      
      {/* Hidden SEO content for search engines */}
      <div className="sr-only">
        <h1>Ajithkumar - Tamil Writer & Full Stack MERN Developer</h1>
        <p>
          Published Tamil author with 5 poetry books and experienced Full Stack Developer specializing in 
          MERN stack (MongoDB, Express.js, React.js, Node.js). Combining literary creativity with 
          technical expertise in JavaScript, React.js, and Node.js development.
        </p>
        <div>
          <h2>Published Tamil Writer</h2>
          <p>Author of 5 acclaimed Tamil poetry books exploring themes of feminism, social justice, and cultural identity.</p>
        </div>
        <div>
          <h2>Full Stack MERN Developer</h2>
          <p>
            Specializing in JavaScript, React.js, Node.js, MongoDB, and Express.js development.
            Creating responsive, scalable web applications and RESTful APIs.
          </p>
        </div>
        <div>
          <h2>Technical Skills</h2>
          <ul>
            <li>MERN Stack Development</li>
            <li>JavaScript Development</li>
            <li>React.js Development</li>
            <li>Node.js Development</li>
            <li>MongoDB</li>
            <li>Express.js</li>
            <li>RESTful APIs</li>
            <li>Full Stack Development</li>
          </ul>
        </div>
        <div>
          <h2>Published Works</h2>
          <ul>
            <li>Tamil Poetry Book 1</li>
            <li>Tamil Poetry Book 2</li>
            <li>Tamil Poetry Book 3</li>
            <li>Tamil Poetry Book 4</li>
            <li>Tamil Poetry Book 5</li>
          </ul>
        </div>
      </div>
    </>
      {/* Hero Section with auto height instead of min-h-screen */}
      <div className="min-h-[calc(100vh-80px)] flex flex-col justify-between">
        {/* Main Hero Content */}
        <div className="flex-grow flex items-center py-8">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-6">
                {/* Image with animation - mobile only */}
                <div className="lg:hidden flex justify-center mb-8">
                  <div className="relative w-48 h-48 overflow-hidden rounded-full border-4 border-white shadow-xl animate-float">
                    <Image 
                      src="https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741809430/techblog/ujikvc0er4tebs8mps0d.jpg"
                      alt="Ajithkumar - Tamil Writer and Poet"    
                      fill
                      sizes="(max-width: 768px) 192px, 256px"
                      className="object-cover"
                      onLoad={() => setIsImageLoaded(true)}
                      priority
                    />
                  </div>
                </div>
      
                <div className="space-y-2">
                  <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
                    Full Stack Developer
                  </h1>
                  <h2 className="text-xl md:text-2xl text-primary-600 dark:text-primary-400 font-medium">
                    Ajithkumar
                  </h2>
                </div>
      
                <p className="text-lg md:text-xl text-secondary-700 max-w-2xl">
                  {writerDescription}
                </p>
      
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={openContactForm}
                    className="clean-container inline-flex items-center gap-2 px-6 py-3 rounded-lg text-primary-600 dark:text-primary-400 hover:-translate-y-1 transition-all"
                    aria-label="Contact Ajithkumar"
                  >
                    Get in Touch
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  
                  <div className="flex gap-4 text-primary-600 dark:text-primary-400">
                    <a 
                      href="https://github.com/ajith2401" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="clean-container p-3 rounded-lg hover:-translate-y-1 transition-all"
                      aria-label="Ajithkumar on GitHub"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                    <a 
                      href="https://www.linkedin.com/in/ajithkumar-r-a6531a232/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="clean-container p-3 rounded-lg hover:-translate-y-1 transition-all"
                      aria-label="Ajithkumar on LinkedIn"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a 
                      href="mailto:Portfolioajith24ram@gmail.com" 
                      className="clean-container p-3 rounded-lg hover:-translate-y-1 transition-all"
                      aria-label="Email Ajithkumar"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
      
              {/* Right Content - Just the Image */}
              <div className="relative hidden lg:flex justify-center items-center">
                <div className="profile-image-container relative w-64 h-64 overflow-hidden rounded-full border-4 border-white shadow-lg transition-transform duration-300" style={{transform: 'perspective(1000px)'}}>
                  <Image 
                    src="https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741809430/techblog/ujikvc0er4tebs8mps0d.jpg"
                    alt="Ajithkumar - Tamil Writer and Poet"
                    fill
                    sizes="256px"
                    className="object-cover"
                    onLoad={() => setIsImageLoaded(true)}
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      
        {/* Divider and Scroll Indicator - Now visible without scrolling */}
        <div className="w-full flex flex-col items-center mb-4">
          <div className="w-full max-w-4xl px-4">
            <div className="divider-container relative py-4">
              <div className="divider h-px w-full bg-gradient-to-r from-transparent via-primary-400 to-transparent"></div>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4">
                <button 
                  onClick={scrollToContent}
                  className="flex flex-col items-center text-primary-600 hover:text-primary-400 transition-colors duration-300"
                  aria-label="Scroll to content"
                >
                  <span className="text-sm font-medium mb-1">Explore More</span>
                  <ChevronDown className="w-5 h-5 animate-bounce" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section Below Hero */}
      <div id="content-section" className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column - Writer Works */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <FolderOpen className="w-6 h-6 text-primary-600" />
                <h2 className="text-2xl font-bold text-foreground">Featured Works</h2>
              </div>
              
              <Link 
                href="/quill" 
                className="group block"
              >
                <div className="clean-container p-5 rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative overflow-hidden">
                  {/* Background animation element */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
                  
                  {/* Content with animations */}
                  <div className="relative z-10">
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary-600 transition-colors duration-300">
                      Tamil Poetry Collection
                    </h3>
                    
                    <p className="text-secondary-700 mb-2 transition-all duration-300 group-hover:translate-x-1">
                      Explore my collection of published Tamil poetry addressing themes of feminism, social justice, and personal reflection – with five published books to my name.
                    </p>
                    
                    <span className="inline-flex items-center text-primary-600 text-sm font-medium transition-all duration-300 group-hover:translate-x-2 relative">
                      Browse poetry collection
                      <ArrowRight className="w-3 h-3 ml-1 transition-all duration-300 group-hover:ml-2" />
                      
                      {/* Animated underline */}
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-primary-600 group-hover:w-full transition-all duration-500"></span>
                    </span>
                  </div>
                </div>
              </Link>

              <Link 
                href="/devfolio" 
                className="group block"
              >
                <div className="clean-container p-5 rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
                  
                  <div className="relative z-10">
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary-600 transition-colors duration-300">
                      Developer Portfolio
                    </h3>
                    
                    <p className="text-secondary-700 mb-2 transition-all duration-300 group-hover:translate-x-1">
                      View my technical projects and applications built with MERN stack (MongoDB, Express.js, React, Node.js) showcasing my skills as a Full Stack Developer.
                    </p>
                    
                    <span className="inline-flex items-center text-primary-600 text-sm font-medium transition-all duration-300 group-hover:translate-x-2 relative">
                      Explore development work
                      <ArrowRight className="w-3 h-3 ml-1 transition-all duration-300 group-hover:ml-2" />
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-primary-600 group-hover:w-full transition-all duration-500"></span>
                    </span>
                  </div>
                </div>
              </Link>
              
              <Link 
                href="/spotlight" 
                className="group block"
              >
                <div className="clean-container p-5 rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
                  
                  <div className="relative z-10">
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary-600 transition-colors duration-300">
                      Published Books
                    </h3>
                    
                    <p className="text-secondary-700 mb-2 transition-all duration-300 group-hover:translate-x-1">
                      Browse my five published Tamil poetry books that explore contemporary social themes, feminist perspectives, and human emotions.
                    </p>
                    
                    <span className="inline-flex items-center text-primary-600 text-sm font-medium transition-all duration-300 group-hover:translate-x-2 relative">
                      View published books
                      <ArrowRight className="w-3 h-3 ml-1 transition-all duration-300 group-hover:ml-2" />
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-primary-600 group-hover:w-full transition-all duration-500"></span>
                    </span>
                  </div>
                </div>
              </Link>

              <div className="pt-8">
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Expertise
                </h3>
                <div className="flex flex-wrap gap-3">
                  {['React.js', 'Node.js', 'MongoDB', 'Express.js', 'Full Stack Development', 'JavaScript','Tamil Poetry', 'Published Author', 'Feminism', 'Social Justice', 'MERN Stack'].map((skill) => (
                    <span 
                      key={skill}
                      className="clean-container px-4 py-2 rounded-full text-sm text-secondary-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Achievements & Background */}
            <div className="space-y-6">
              <div className="clean-container p-6 rounded-xl space-y-4">
                <h3 className="text-xl font-bold text-foreground">Published Tamil Poet</h3>
                <p className="text-secondary-700">
                  Author of five acclaimed Tamil poetry books exploring themes of social justice, feminism, and cultural identity. My writing has been recognized for its authentic voice and thematic depth within Tamil literary circles.
                </p>
              </div>

              <div className="clean-container p-6 rounded-xl space-y-4">
                <h3 className="text-xl font-bold text-foreground">Full Stack Developer</h3>
                <p className="text-secondary-700">
                  Currently working as a Full Stack Developer, specializing in MERN stack (MongoDB, Express.js, React, Node.js) to create scalable and innovative web applications.
                </p>
              </div>

              <div className="clean-container p-6 rounded-xl space-y-4">
                <h3 className="text-xl font-bold text-foreground">Bridging Two Worlds</h3>
                <p className="text-secondary-700">
                  I bring a unique perspective that combines the creative depth of a published poet with the technical precision of a developer, creating solutions that are both innovative and meaningfully crafted.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ContactForm 
        isOpen={isContactFormOpen} 
        onClose={() => setIsContactFormOpen(false)} 
      />
    </>
  );
};

export default Hero;