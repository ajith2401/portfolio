// src/app/devfolio/[id]/ProjectDetailClient.js
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Github, ExternalLink, ArrowLeft, Instagram, Facebook, MessageCircle, Mail, Copy } from 'lucide-react';
import DecorativeLine from '@/components/ui/DecorativeLine';
import ShareButtons from '@/components/layout/ShareButtons';
import ProjectSchema from '@/components/schema/ProjectSchema';
import { getSafeUrl } from '@/utils/slugGenerator';

// Replace the MarkdownRenderer component in ProjectDetailClient.js

import MarkdownRenderer from '@/components/MarkdownRenderer';

export default function ProjectDetailClient({ project, projectId }) {
  const [relatedProjects, setRelatedProjects] = useState([]);

  useEffect(() => {
    // Fetch related projects based on category
    async function fetchRelatedProjects() {
      try {
        const res = await fetch(`/api/projects/${projectId}/related`);
        if (res.ok) {
          const data = await res.json();
          setRelatedProjects(data.data.projects || []);
        }
      } catch (error) {
        console.error('Error fetching related projects:', error);
      }
    }
    
    fetchRelatedProjects();
  }, [projectId]);
  
  return (
    <div className="min-h-screen text-foreground">
    <ProjectSchema project={project} />
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Back Button */}
        <div className="py-4 sm:py-6 md:py-8">
          <Link href="/devfolio" className="inline-flex items-center text-xs sm:text-sm hover:text-primary">
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Back to Projects
          </Link>
        </div>
        
        {/* Header Section */}
        <div className="w-full max-w-[1064px] mx-auto mb-8 sm:mb-10 md:mb-16">
          <div className="relative h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden mb-6">
            <Image
              src={project.images?.large || project.images?.medium || '/placeholder.jpg'}
              alt={project.title}
              fill
              className="object-cover"
              priority
              quality={90}
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 text-sm font-medium text-primary-600 bg-primary-100 rounded-full">
                {project.category}
              </span>
              {project.achievement && (
                <span className="text-sm text-secondary-500">{project.achievement}</span>
              )}
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-2">{project.title}</h1>
            {project.subtitle && (
              <p className="text-xl text-secondary-600">{project.subtitle}</p>
            )}
            
            <div className="flex flex-wrap gap-2 my-4">
              {project.stack && project.stack.map((tech) => (
                <span 
                  key={tech}
                  className="px-3 py-1 text-sm bg-secondary-100 text-secondary-600 rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="my-6">
              <div className="flex flex-wrap gap-4 mb-4">
                {project.links?.github && (
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
                {project.links?.live && (
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
                {project.links?.demo && !project.links?.live && (
                  <a
                    href={project.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    <ExternalLink size={18} />
                    <span>View Demo</span>
                  </a>
                )}
              </div>
              
          <div className="self-start sm:self-end">
              <ShareButtons />
            </div>
            </div>
           </div>
        </div>
        
        {/* Decorative Line */}
        <div className="w-full mx-auto md:mt-8 mb-8 sm:mb-12 md:mb-16">
          <DecorativeLine />
        </div>
        
        {/* Content Section */}
        <div className="w-full max-w-[1064px] mx-auto mb-16 md:mb-36 px-4 sm:px-6 relative">
          {/* Use MarkdownRenderer for the content */}
          <MarkdownRenderer content={project.longDescription} />
          
          {/* Project Stats */}
          {project.stats && Object.keys(project.stats).length > 0 && (
            <div className="my-12">
              <h2 className="text-2xl font-semibold text-foreground mb-6">Project Impact</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(project.stats).map(([key, value]) => (
                  <div key={key} className="text-center p-4 clean-container rounded-lg">
                    <div className="text-xl font-semibold text-primary-500">{value}</div>
                    <div className="text-sm text-secondary-500 capitalize">{key}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Features Section */}
          {project.features && project.features.length > 0 && (
            <div className="my-12">
              <h2 className="text-2xl font-semibold text-foreground mb-6">Key Features</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {project.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-secondary-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Challenges Section */}
          {project.challenges && project.challenges.length > 0 && (
            <div className="my-12">
              <h2 className="text-2xl font-semibold text-foreground mb-6">Challenges Overcome</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {project.challenges.map((challenge, index) => (
                  <li key={index} className="flex items-center gap-2 text-secondary-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                    {challenge}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="w-full border-b border-dashed border-[#949494] opacity-50 my-8 md:my-12" />
        
        {/* Related Projects */}
        {Array.isArray(relatedProjects) && relatedProjects.length > 0 ? (
          <section className="mb-8 md:mb-16 mt-16 md:mt-28">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8">Similar Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {relatedProjects.map((relatedProject) => (
                <Link 
                  href={getSafeUrl(relatedProject, 'devfolio')} 
                  key={relatedProject._id || Math.random()}
                  className="w-full group"
                >
                  <div className="flex flex-col gap-4 sm:gap-6 p-4 rounded-lg transition-all duration-300 ease-in-out 
                    hover:shadow-[var(--card-hover-shadow)] 
                    hover:translate-y-[var(--card-hover-transform)] 
                    hover:bg-[var(--card-hover-bg)]"
                  >
                    {/* Image Container */}
                    <div className="relative w-full aspect-[16/9] sm:h-[231.38px] rounded-lg overflow-hidden">
                      <Image
                        src={relatedProject?.images?.medium || '/placeholder.jpg'}
                        alt={relatedProject?.title || 'Project image'}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        priority={false}
                        quality={75}
                      />
                    </div>

                    <h3 className="font-work-sans text-base sm:text-lg font-medium leading-tight sm:leading-[21px] transition-colors duration-300 group-hover:text-primary">
                      {relatedProject?.title || 'Untitled Project'}
                    </h3>
                  
                    <p className="font-merriweather text-sm text-foreground leading-relaxed sm:leading-[21px] line-clamp-3">
                      {relatedProject?.shortDescription || ''}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {Array.isArray(relatedProject?.stack) && relatedProject.stack.slice(0, 3).map((tech) => (
                        <span 
                          key={tech}
                          className="px-2 py-1 text-xs bg-secondary-100 text-secondary-600 rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : (
          <section className="mb-8 md:mb-16 mt-16 md:mt-28">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8">Similar Projects</h2>
            <div className="text-secondary-500 text-center py-8">No similar projects found.</div>
          </section>
        )}
      </div>
    </div>
  );
}