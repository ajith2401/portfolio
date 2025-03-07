'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Github, ExternalLink, Search, X } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: "SEVAI BOT - Government Schemes Virtual Assistant",
    subtitle: "GovTechThon Winner (500+ participants)",
    description: "Led the development of India's first WhatsApp bot for government scheme dissemination. This AI-powered chatbot achieved significant impact, serving thousands of citizens with accurate scheme information.",
    longDescription: `The SEVAI BOT project revolutionized how citizens access government scheme information. Key achievements include:

    • Developed an intelligent chatbot using Python and NLP that understands queries in multiple Indian languages
    • Integrated with government databases to provide real-time scheme eligibility information
    • Built an admin dashboard for scheme management and analytics
    • Implemented secure user authentication and data protection measures
    • Achieved 95% accuracy in scheme recommendations`,
    image: "https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741200667/devfolio/woxbsuhep9cxv8ytzzr7.jpg",
    category: "AI/ML",
    stack: ["Python", "Flask", "React", "MongoDB", "NLP"],
    achievement: "₹1 lakh prize winner",
    links: {
      github: "https://github.com/ajith2401/sevai-bot",
      live: "https://demo.sevai-bot.com"
    },
    stats: {
      users: "5000+",
      accuracy: "95%",
      schemes: "100+"
    },
    features: [
      "Multi-language support",
      "Real-time eligibility checking",
      "Document verification",
      "Automated updates",
      "Analytics dashboard"
    ],
    challenges: [
      "Handling multiple Indian languages",
      "Ensuring accurate scheme matching",
      "Maintaining high uptime",
      "Data security compliance"
    ],
    date: "2023"
  },
  {
    id: 2,
    title: "KURAL BOT - Tamil Literature Assistant",
    subtitle: "Automated Thirukkural Learning Platform",
    description: "Developed an intelligent chatbot for accessing and learning Thirukkural verses. Features instant access to 1,330 verses with contextual explanations and modern interpretations.",
    longDescription: `The KURAL BOT makes ancient Tamil literature accessible to modern users through:

    • Instant access to all 1,330 Thirukkural verses
    • Smart search functionality for finding relevant verses
    • Daily verse notifications with explanations
    • Integration with Telegram for easy access
    • Multilingual support for broader reach`,
    image: "https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741201007/devfolio/i3t0920clpcgnuivugz2.jpg",
    category: "NLP",
    stack: ["Node.js", "MongoDB", "Python", "NLP", "Telegram API"],
    achievement: "1000+ daily active users",
    links: {
      github: "https://github.com/ajith2401/kural-bot",
      live: "https://t.me/kuralbot"
    },
    stats: {
      users: "10000+",
      verses: "1,330",
      languages: "3"
    },
    features: [
      "Verse search",
      "Daily notifications",
      "Contextual explanations",
      "Topic categorization",
      "User bookmarks"
    ],
    challenges: [
      "Tamil language processing",
      "Context preservation",
      "User engagement",
      "Performance optimization"
    ],
    date: "2023"
  },
  {
    id: 3,
    title: "Healthcare Chatbot",
    subtitle: "Automated Patient Support System",
    description: "Built a comprehensive healthcare WhatsApp chatbot that processed 5% of total appointment bookings, streamlining patient services and reducing manual scheduling overhead.",
    longDescription: `The Healthcare Chatbot revolutionized patient services through:

    • Automated appointment scheduling system
    • Real-time availability checking
    • Prescription renewal requests
    • Medical record access
    • Appointment reminders and follow-ups`,
    image: "https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741200546/devfolio/imp1o2apzgzrz4ryysjq.png",
    category: "Healthcare",
    stack: ["Python", "Flask", "MongoDB", "WhatsApp API", "JWT"],
    achievement: "40% reduction in manual work",
    links: {
      github: "https://github.com/ajith2401/healthcare-bot",
      demo: "https://demo.healthcare-bot.com"
    },
    stats: {
      appointments: "19K+",
      satisfaction: "90%",
      automation: "40%"
    },
    features: [
      "Appointment scheduling",
      "Record management",
      "Prescription renewals",
      "Doctor availability",
      "Emergency support"
    ],
    challenges: [
      "HIPAA compliance",
      "Data security",
      "System integration",
      "High availability"
    ],
    date: "2022"
  },
  {
    id: 4,
    title: "Recipe Hub",
    subtitle: "Social Cooking Platform",
    description: "Developed a full-stack social platform for recipe sharing with real-time features, social networking, and media management capabilities.",
    longDescription: `Recipe Hub connects food enthusiasts through:

    • Real-time recipe sharing and collaboration
    • Social networking features for foodies
    • Media upload and management
    • Interactive cooking guides
    • Community features and discussions`,
    image: "https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741200526/devfolio/prn0r3tfqgspfqeqmvo4.jpg",
    category: "Web Apps",
    stack: ["React", "Node.js", "MongoDB", "Socket.io", "AWS"],
    achievement: "5K+ active users",
    links: {
      github: "https://github.com/ajith2401/recipe-hub",
      live: "https://recipe-hub.com"
    },
    stats: {
      recipes: "10K+",
      users: "5000+",
      rating: "4.8"
    },
    features: [
      "Recipe sharing",
      "Real-time chat",
      "Media uploads",
      "Social networking",
      "Recipe search"
    ],
    challenges: [
      "Real-time updates",
      "Media optimization",
      "Search functionality",
      "User engagement"
    ],
    date: "2023"
  }
];

const ProjectModal = ({ project, onClose, projectOpen }) => {
  if (!project || !projectOpen) return null;

  // Stop propagation for the modal content
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 overflow-y-auto"
    onClick={onClose}
  >
      <div className="min-h-screen px-4 flex items-center justify-center">
        <div 
          className="clean-container rounded-lg w-full max-w-4xl my-8 relative"
          onClick={handleContentClick}  // Prevent closing when clicking modal content
        >
        <button 
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-4 right-4 p-2 rounded-full 
          bg-background/50 hover:bg-background/80 
          focus:outline-none focus:ring-2 focus:ring-primary-500
          transition-all duration-200 ease-in-out
          z-50"
        aria-label="Close modal"
      >
        <X className="w-6 h-6 text-foreground" />
      </button>

          <div className="p-6">
            <div className="relative h-64 rounded-lg overflow-hidden mb-6">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                priority
                quality={90}
              />
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 text-sm font-medium text-primary-600 bg-primary-100 rounded-full">
                    {project.category}
                  </span>
                  <span className="text-sm text-secondary-500">{project.achievement}</span>
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">{project.title}</h2>
                <p className="text-secondary-600">{project.subtitle}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <span 
                      key={tech}
                      className="px-3 py-1 text-sm bg-secondary-100 text-secondary-600 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">About the Project</h3>
                <p className="text-secondary-600 whitespace-pre-line">{project.longDescription}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Key Features</h3>
                <ul className="grid grid-cols-2 gap-2">
                  {project.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-secondary-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Challenges Overcome</h3>
                <ul className="grid grid-cols-2 gap-2">
                  {project.challenges.map((challenge, index) => (
                    <li key={index} className="flex items-center gap-2 text-secondary-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                      {challenge}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Impact</h3>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(project.stats).map(([key, value]) => (
                    <div key={key} className="text-center p-4 clean-container rounded-lg">
                      <div className="text-xl font-semibold text-primary-500">{value}</div>
                      <div className="text-sm text-secondary-500 capitalize">{key}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-secondary-200">
                {project.links.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors"
                  >
                    <Github size={18} />
                    <span>View Code</span>
                  </a>
                )}
                {project.links.live && (
                  <a
                    href={project.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    <ExternalLink size={18} />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const DevfolioPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectOpen, setProjectOpen] = useState(false)

  const handleCloseModal = () => {
    setSelectedProject(null);
    setProjectOpen(false);
  };

  const handleOpenModal = (project) => {
    setSelectedProject(project);
    setProjectOpen(true);
  };

  useEffect(() => {
    let result = [...projects];
    
    if (selectedCategory !== 'All Projects') {
      result = result.filter(project => project.category === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(project => 
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.stack.some(tech => tech.toLowerCase().includes(query)) ||
        project.category.toLowerCase().includes(query)
      );
    }
    
    setFilteredProjects(result);
  }, [selectedCategory, searchQuery]);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="w-full py-8 sm:py-12 lg:py-16 px-4 mb-4 sm:mb-6 lg:mb-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-custom-56 font-dm-sans font-semibold text-foreground mb-3 sm:mb-4 lg:mb-6 px-2 sm:px-4">
            My <span className="text-primary-500">Creative</span> Universe of{' '}
            <span className="text-primary-500">Projects</span>
          </h1>
          <p className="w-full max-w-[874px] mx-auto px-4 sm:px-6 lg:px-8 
             text-center font-work-sans 
             text-base sm:text-lg lg:text-[22px] 
             leading-[20px] sm:leading-[24px] lg:leading-[26px] 
             font-normal text-secondary-600">
            A showcase of my journey through code, featuring award-winning projects 
            and innovative solutions that make a real impact.
          </p>
        </div>
      </div>

      <div className="w-full border-b border-dashed border-decorative-line opacity-20" />

      {/* Projects Section */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="w-full md:w-auto">
            <select 
              className="glass-input px-4 py-2 rounded-md w-full md:w-48"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option>All Projects</option>
              <option>AI/ML</option>
              <option>NLP</option>
              <option>Healthcare</option>
              <option>Web Apps</option>
            </select>
          </div>

          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search projects..."
              className="glass-input w-full pl-10 pr-4 py-2 rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <article 
            key={project.id} 
            onClick={() => handleOpenModal(project)}
            
            className="clean-container rounded-lg overflow-hidden group transition-all duration-300
              hover:shadow-[var(--card-hover-shadow)] 
              hover:translate-y-[var(--card-hover-transform)]
              cursor-pointer"
          >
            <div className="relative w-full h-48 overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority={false}
                quality={75}
              />
              <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-sm font-work-sans text-foreground">
                  {project.date}
                </span>
              </div>
            </div>
        
            <div className="p-6 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 text-xs font-medium text-primary-600 bg-primary-100 rounded-full">
                    {project.category}
                  </span>
                  <span className="text-sm text-secondary-500">{project.achievement}</span>
                </div>
                <h3 className="font-work-sans text-lg font-medium text-foreground group-hover:text-primary-500 transition-colors">
                  {project.title}
                </h3>
                <p className="text-secondary-600 text-sm mt-1">{project.subtitle}</p>
              </div>
        
              <p className="text-secondary-600 text-sm line-clamp-3">
                {project.description}
              </p>
        
              <div className="flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span 
                    key={tech}
                    className="px-2 py-1 text-xs bg-secondary-100 text-secondary-600 rounded-md"
                  >
                    {tech}
                  </span>
                ))}
              </div>
        
              <div className="grid grid-cols-3 gap-4 py-4 border-t border-dashed border-decorative-line opacity-20">
                {Object.entries(project.stats).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-primary-500 font-semibold">{value}</div>
                    <div className="text-xs text-secondary-500 capitalize">{key}</div>
                  </div>
                ))}
              </div>
        
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-secondary-600 hover:text-primary-500 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Github size={16} />
                      <span className="text-sm">Code</span>
                    </a>
                  )}
                  {(project.links.live || project.links.demo) && (
                    <a
                      href={project.links.live || project.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-secondary-600 hover:text-primary-500 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={16} />
                      <span className="text-sm">Demo</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
        </div>

        {/* No results message */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-secondary-600">No projects found matching your criteria.</p>
          </div>
        )}
      </section>

      {/* Project Details Modal */}
      {selectedProject && projectOpen && (
        <ProjectModal 
          project={selectedProject} 
          onClose={handleCloseModal} 
          projectOpen={projectOpen}
        />
      )}
    </main>
  );
};

export default DevfolioPage;