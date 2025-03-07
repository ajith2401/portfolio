import React from 'react';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';

const Hero = () => {
  return (
    <div className="min-h-screen flex items-center">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
                Full Stack Developer
              </h1>
              <h2 className="text-xl md:text-2xl text-primary-600 dark:text-primary-400 font-medium">
                Ajithkumar Rangappan
              </h2>
            </div>

            <p className="text-lg md:text-xl text-secondary-600 dark:text-secondary-500 max-w-2xl">
              Award-winning developer specializing in innovative solutions. GovTechThon winner with expertise in building scalable applications and chatbots that make a real impact.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#contact" 
                className="clean-container inline-flex items-center gap-2 px-6 py-3 rounded-lg text-foreground hover:-translate-y-1 transition-all"
              >
                Get in Touch
                <ArrowRight className="w-4 h-4" />
              </a>
              
              <div className="flex gap-4 text-foreground">
                <a 
                  href="https://github.com/ajith2401" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="clean-container p-3 rounded-lg hover:-translate-y-1 transition-all"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a 
                  href="https://linkedin.com/in/ajithkumar-r-85b72016a" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="clean-container p-3 rounded-lg hover:-translate-y-1 transition-all"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href="mailto:Portfolioajith24ram@gmail.com" 
                  className="clean-container p-3 rounded-lg hover:-translate-y-1 transition-all"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="pt-8">
              <h3 className="text-sm font-medium text-secondary-600 dark:text-secondary-500 mb-4">
                Core Technologies
              </h3>
              <div className="flex flex-wrap gap-3">
                {['JavaScript', 'React.js', 'Next.js', 'Python', 'Flask', 'Node.js','Express.js', 'MongoDB','SQL'].map((tech) => (
                  <span 
                    key={tech}
                    className="clean-container px-4 py-2 rounded-full text-sm text-secondary-600 dark:text-secondary-500"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content - Achievements */}
          <div className="space-y-6">
            <div className="grid gap-6">
              <div className="clean-container p-6 rounded-xl space-y-4">
                <h3 className="text-xl font-bold text-foreground">GovTechThon Winner</h3>
                <p className="text-secondary-600 dark:text-secondary-600">
                  Led the development of Indias first WhatsApp bot for government scheme dissemination, beating 520+ teams.
                </p>
              </div>

              <div className="clean-container p-6 rounded-xl space-y-4">
                <h3 className="text-xl font-bold text-foreground">Full Stack Innovation</h3>
                <p className="text-secondary-600 dark:text-secondary-500">
                  Built comprehensive web and WhatsApp chatbot solutions with multilingual capabilities for banking and healthcare sectors.
                </p>
              </div>

              <div className="clean-container p-6 rounded-xl space-y-4">
                <h3 className="text-xl font-bold text-foreground">Proven Leadership</h3>
                <p className="text-secondary-600 dark:text-secondary-500">
                  Successfully managed large-scale data migration (19,000+ users) and mentored junior developers in chatbot development.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;