import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
  const [isVisible, setIsVisible] = useState({
    hero: false,
    about: false,
    features: false,
    workflow: false,
    whyChoose: false,
    vision: false,
    contact: false
  });

  const [activeSection, setActiveSection] = useState('hero');
  const observerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const navigate = useNavigate();

  // Advanced color palette with gradients
  const colors = {
    primary: '#2563eb',
    primaryDark: '#1d4ed8',
    primaryLight: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#06b6d4',
    success: '#10b981',
    warning: '#f59e0b',
    light: '#f8fafc',
    dark: '#1e293b',
    white: '#ffffff',
    gray: '#64748b',
    gradientHero: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    gradientNav: 'linear-gradient(90deg, #1e293b 0%, #334155 100%)',
    gradientCard: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    gradientAccent: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)'
  };

  // Particle system for hero background
  const ParticleBackground = () => {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);

    useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      let animationId;

      const resizeCanvas = () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      };

      class Particle {
        constructor() {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.size = Math.random() * 2 + 1;
          this.speedX = Math.random() * 0.5 - 0.25;
          this.speedY = Math.random() * 0.5 - 0.25;
          this.color = `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`;
        }

        update() {
          this.x += this.speedX;
          this.y += this.speedY;

          if (this.x > canvas.width) this.x = 0;
          if (this.x < 0) this.x = canvas.width;
          if (this.y > canvas.height) this.y = 0;
          if (this.y < 0) this.y = canvas.height;
        }

        draw() {
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const initParticles = () => {
        particlesRef.current = [];
        for (let i = 0; i < 50; i++) {
          particlesRef.current.push(new Particle());
        }
      };

      const animateParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particlesRef.current.forEach(particle => {
          particle.update();
          particle.draw();
        });

        // Draw connections
        particlesRef.current.forEach((a, i) => {
          particlesRef.current.slice(i + 1).forEach(b => {
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
              ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * (1 - distance / 100)})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          });
        });

        animationId = requestAnimationFrame(animateParticles);
      };

      resizeCanvas();
      initParticles();
      animateParticles();

      window.addEventListener('resize', resizeCanvas);

      return () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener('resize', resizeCanvas);
      };
    }, []);

    return (
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      />
    );
  };

  // Enhanced scroll animations
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[data-section]');
      const scrollPos = window.scrollY + 100;

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          setActiveSection(sectionId);
        }
      });
    };

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.dataset.section]: true
            }));
          }
        });
      },
      { 
        threshold: 0.3,
        rootMargin: '-50px 0px -50px 0px'
      }
    );

    const sections = document.querySelectorAll('[data-section]');
    sections.forEach(section => observerRef.current.observe(section));

    window.addEventListener('scroll', handleScroll);
    return () => {
      observerRef.current?.disconnect();
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Smooth scroll with offset for fixed navbar
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  // Advanced animation styles
  const styles = {
    hero: {
      background: colors.gradientHero,
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden'
    },
    navbar: {
      background: colors.gradientNav,
      backdropFilter: 'blur(20px)',
      borderBottom: `1px solid rgba(255,255,255,0.1)`,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
    },
    card: {
      background: colors.gradientCard,
      border: `1px solid rgba(255,255,255,0.2)`,
      borderRadius: '20px',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)'
    },
    cardHover: {
      transform: 'translateY(-15px) scale(1.02)',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
      borderColor: 'rgba(255,255,255,0.3)'
    },
    gradientText: {
      background: 'linear-gradient(135deg, #fff 0%, #f0f0f0 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    floatingAnimation: {
      animation: 'float 6s ease-in-out infinite'
    },
    glowEffect: {
      filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))'
    }
  };

  // Enhanced feature data with icons and colors
  const features = [
    {
      icon: '⚡',
      title: 'Automated Claim Processing',
      description: 'Reduce manual workload and turnaround time with intelligent automation',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      stats: '90% Faster'
    },
    {
      icon: '🧠',
      title: 'Smart Policy Management',
      description: 'Centralized control for HR and administrators with real-time updates',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      stats: 'AI Powered'
    },
    {
      icon: '👁️',
      title: 'Employee Transparency',
      description: 'Real-time claim tracking and instant notifications for all stakeholders',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      stats: '100% Visible'
    },
    {
      icon: '🛡️',
      title: 'AI-Powered Fraud Detection',
      description: 'Identify anomalies before they impact finances with machine learning',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      stats: '99% Accurate'
    },
    {
      icon: '📊',
      title: 'Analytics & Insights',
      description: 'Data-driven decisions with comprehensive visual dashboards',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      stats: 'Real-time Data'
    },
    {
      icon: '🔧',
      title: 'Custom Workflows',
      description: 'Tailored processes that match your organizational structure',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      stats: 'Flexible'
    }
  ];

  return (
    <div style={{ width: '100%', overflowX: 'hidden', background: colors.light }}>
      {/* Enhanced Navigation Bar */}
 {/* ✨ Enhanced Navigation Bar with Distinct Branding and Contrast */}
<nav 
  className="navbar navbar-expand-lg fixed-top shadow-sm"
  style={{
    background: 'rgba(17, 25, 40, 0.85)', // darker translucent base for contrast
    backdropFilter: 'blur(15px)',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    transition: 'all 0.4s ease',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    zIndex: 1000
  }}
>
  <div className="container-fluid px-4">
    {/* 🔹 Brand Logo / Title */}
    <a 
      className="navbar-brand fw-bold fs-3 d-flex align-items-center"
      href="#"
      style={{
        textDecoration: 'none',
        fontWeight: '700',
        letterSpacing: '0.5px',
      }}
    >
      <span style={{
        background: 'linear-gradient(90deg, #00f5d4, #00b4d8, #3b82f6, #ffffff)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        filter: 'drop-shadow(0 0 8px rgba(59,130,246,0.5))',
        transition: 'all 0.3s ease'
      }}>
        🏠 Insur<span style={{ color: '#00f5d4', WebkitTextFillColor: 'unset' }}>AI</span>
      </span>
    </a>

    {/* 🔸 Toggler for Mobile */}
    <button 
      className="navbar-toggler" 
      type="button" 
      data-bs-toggle="collapse" 
      data-bs-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
      style={{ border: 'none' }}
    >
      <span className="navbar-toggler-icon"></span>
    </button>

    {/* 🔸 Navigation Links */}
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav ms-auto gap-2">
        {['about', 'features', 'workflow', 'why-choose', 'vision', 'contact'].map((section) => (
          <li key={section} className="nav-item">
            <button
              className="nav-link btn btn-link position-relative px-3"
              onClick={() => scrollToSection(section)}
              style={{
                color: activeSection === section ? '#ffffff' : 'rgba(255,255,255,0.65)',
                border: 'none',
                background: 'none',
                fontWeight: activeSection === section ? '600' : '400',
                letterSpacing: '0.5px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#00f5d4';
                e.target.style.textShadow = '0 0 10px rgba(0,245,212,0.8)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = activeSection === section ? '#ffffff' : 'rgba(255,255,255,0.65)';
                e.target.style.textShadow = 'none';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              {section
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}

              {/* Active Underline */}
              <div style={{
                position: 'absolute',
                bottom: '0px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: activeSection === section ? '40%' : '0%',
                height: '2px',
                background: 'linear-gradient(90deg, #00f5d4, #3b82f6)',
                borderRadius: '2px',
                boxShadow: '0 0 8px rgba(59,130,246,0.6)',
                transition: 'width 0.3s ease'
              }} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  </div>
</nav>


 {/* Enhanced Hero Section with Particles */}
<section 
  id="hero"
  data-section="hero"
  style={styles.hero}
  className="d-flex align-items-center justify-content-center text-white position-relative"
>
  <ParticleBackground />
  <div className="container-fluid px-4 position-relative" style={{ zIndex: 2 }}>
    <div className="row align-items-center min-vh-100">
      {/* Left Side - Hero Text */}
      <div className="col-lg-6" style={{
        transform: isVisible.hero ? 'translateX(0) rotateY(0)' : 'translateX(-100px) rotateY(-10deg)',
        opacity: isVisible.hero ? 1 : 0,
        transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
        perspective: '1000px'
      }}>
        <h1 className="display-4 fw-bold mb-4" style={{
          ...styles.gradientText,
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          lineHeight: '1.2',
          textShadow: '0 4px 8px rgba(0,0,0,0.25)'
        }}>
          Smarter Insurance Management for Modern Enterprises
        </h1>

        <p className="lead mb-4" style={{ 
          fontSize: '1.25rem', 
          lineHeight: '1.6',
          opacity: 0.9,
          textShadow: '0 2px 4px rgba(0,0,0,0.15)'
        }}>
          Empower your organization with automation, analytics, and transparency in corporate insurance operations.
        </p>

        {/* Get Started Button */}
        <div className="d-flex gap-3 flex-wrap">
          <button
            onClick={() => navigate('/employee/register')}
            className="btn btn-lg px-5 py-3 rounded-pill fw-semibold position-relative overflow-hidden shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
              color: '#fff',
              border: 'none',
              minWidth: '180px',
              letterSpacing: '0.5px',
              transition: 'all 0.4s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-5px) scale(1.05)';
              e.target.style.boxShadow = '0 15px 30px rgba(6,182,212,0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <span className="position-relative z-2">🚀 Get Started</span>
            <div style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.25), transparent)',
              transform: 'rotate(45deg)',
              transition: 'all 0.6s ease'
            }}></div>
          </button>
        </div>
      </div>

      {/* Right Side - Floating Feature Icons */}
      <div className="col-lg-6 text-center" style={{
        transform: isVisible.hero ? 'translateX(0) rotateY(0)' : 'translateX(100px) rotateY(10deg)',
        opacity: isVisible.hero ? 1 : 0,
        transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.3s',
        perspective: '1000px'
      }}>
        <div style={{
          ...styles.floatingAnimation,
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '25px',
          padding: '3rem 2rem',
          backdropFilter: 'blur(25px)',
          border: '1px solid rgba(255,255,255,0.2)',
          maxWidth: '500px',
          margin: '0 auto',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
          <div className="row text-center">
            {[
              { icon: '🚀', name: 'Automated Claims' },
              { icon: '🎯', name: 'Smart Policies' },
              { icon: '⚡', name: 'Real-time Analytics' },
              { icon: '🔒', name: 'Fraud Detection' }
            ].map((item, index) => (
              <div key={index} className="col-6 mb-4">
                <div style={{
                  fontSize: '3.5rem',
                  animation: `float 4s ease-in-out infinite ${index * 0.5}s`,
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.25))'
                }}>
                  {item.icon}
                </div>
                <small style={{ 
                  color: 'rgba(255,255,255,0.9)',
                  fontWeight: '500',
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  fontSize: '0.9rem'
                }}>
                  {item.name}
                </small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>


  {/* Scroll indicator */}
  <div style={{
    position: 'absolute',
    bottom: '30px',
    left: '50%',
    transform: 'translateX(-50%)',
    textAlign: 'center',
    color: 'rgba(255,255,255,0.7)',
    animation: 'bounce 2s infinite'
  }}>
    <div>Scroll to Explore</div>
    <div style={{ fontSize: '1.5rem' }}>↓</div>
  </div>
</section>

      {/* Enhanced About Section */}
      <section 
        id="about" 
        data-section="about"
        className="py-5 position-relative"
        style={{ background: colors.light }}
      >
        <div className="container-fluid px-4">
          <div className="row align-items-center">
            <div className="col-lg-6" style={{
              transform: isVisible.about ? 'translateY(0)' : 'translateY(50px)',
              opacity: isVisible.about ? 1 : 0,
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
              <h2 className="fw-bold mb-4 display-5" style={{ color: colors.primary }}>
                About InsurAI
              </h2>
              <p className="mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.8', color: colors.dark }}>
                InsurAI is an enterprise-grade insurance automation platform designed for organizations 
                to simplify policy management, accelerate claim approvals, and improve employee satisfaction.
              </p>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: colors.dark }}>
                It bridges the gap between HR, agents, and employees — ensuring every process is faster, 
                transparent, and intelligent.
              </p>
            </div>
            <div className="col-lg-6" style={{
              transform: isVisible.about ? 'scale(1) rotateY(0)' : 'scale(0.8) rotateY(-10deg)',
              opacity: isVisible.about ? 1 : 0,
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s'
            }}>
              <div className="row g-4">
                {[
                  { icon: '🚀', title: 'Fast Processing', desc: '90% faster approvals', color: colors.success },
                  { icon: '🎯', title: 'AI Powered', desc: 'Smart automation', color: colors.secondary },
                  { icon: '🔒', title: 'Secure', desc: 'Enterprise-grade security', color: colors.primary },
                  { icon: '📈', title: 'Scalable', desc: 'Grows with your business', color: colors.accent }
                ].map((item, index) => (
                  <div key={index} className="col-6">
                    <div 
                      style={{
                        ...styles.card,
                        padding: '2rem 1.5rem',
                        textAlign: 'center',
                        height: '100%'
                      }}
                      onMouseEnter={(e) => {
                        Object.assign(e.currentTarget.style, styles.cardHover);
                      }}
                      onMouseLeave={(e) => {
                        Object.assign(e.currentTarget.style, styles.card);
                      }}
                    >
                      <div style={{ 
                        fontSize: '3rem', 
                        marginBottom: '1rem',
                        background: item.color,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}>
                        {item.icon}
                      </div>
                      <h5 className="fw-bold mb-2" style={{ color: colors.dark, fontSize: '1.1rem' }}>
                        {item.title}
                      </h5>
                      <small style={{ color: colors.gray, fontSize: '0.9rem' }}>
                        {item.desc}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section 
        id="features" 
        data-section="features"
        className="py-5 position-relative"
        style={{ background: colors.white }}
      >
        <div className="container-fluid px-4">
          <div className="text-center mb-5" style={{
            transform: isVisible.features ? 'translateY(0)' : 'translateY(30px)',
            opacity: isVisible.features ? 1 : 0,
            transition: 'all 0.6s ease'
          }}>
            <h2 className="fw-bold mb-3 display-5" style={{ color: colors.primary }}>
              What InsurAI Does
            </h2>
            <p className="lead" style={{ 
              maxWidth: '600px', 
              margin: '0 auto', 
              color: colors.gray,
              fontSize: '1.1rem'
            }}>
              We help corporates streamline the entire insurance lifecycle through automation and intelligence.
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            {features.map((feature, index) => (
              <div key={index} className="col-xl-4 col-lg-6 col-md-6">
                <div 
                  style={{
                    transform: isVisible.features ? 
                      `translateY(0) rotateX(0)` : 
                      `translateY(50px) rotateX(10deg)`,
                    opacity: isVisible.features ? 1 : 0,
                    transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`
                  }}
                >
                  <div 
                    style={{
                      ...styles.card,
                      background: feature.gradient,
                      color: colors.white,
                      padding: '2.5rem 2rem',
                      textAlign: 'center',
                      height: '100%',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      Object.assign(e.currentTarget.style, styles.cardHover);
                      e.currentTarget.style.background = `linear-gradient(135deg, ${feature.gradient.split(' ')[2]} 0%, ${feature.gradient.split(' ')[5]} 100%)`;
                    }}
                    onMouseLeave={(e) => {
                      Object.assign(e.currentTarget.style, styles.card);
                      e.currentTarget.style.background = feature.gradient;
                    }}
                  >
                    <div style={{
                      fontSize: '4rem',
                      marginBottom: '1.5rem',
                      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                    }}>
                      {feature.icon}
                    </div>
                    <h4 className="fw-bold mb-3" style={{ 
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      fontSize: '1.3rem'
                    }}>
                      {feature.title}
                    </h4>
                    <p style={{ 
                      fontSize: '1rem', 
                      lineHeight: '1.6',
                      opacity: 0.9,
                      marginBottom: '1.5rem'
                    }}>
                      {feature.description}
                    </p>
                    <div style={{
                      background: 'rgba(255,255,255,0.2)',
                      color: colors.white,
                      padding: '0.5rem 1.5rem',
                      borderRadius: '25px',
                      display: 'inline-block',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)'
                    }}>
                      {feature.stats}
                    </div>
                    
                    {/* Animated background element */}
                    <div style={{
                      position: 'absolute',
                      top: '-50%',
                      left: '-50%',
                      width: '200%',
                      height: '200%',
                      background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                      transform: 'rotate(45deg)',
                      transition: 'all 0.6s ease',
                      opacity: 0
                    }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Target Audience Section */}
      <section className="py-5 position-relative" style={{ 
        background: colors.gradientHero 
      }}>
        <div className="container-fluid px-4">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3 display-5 text-white">Who We Empower</h2>
          </div>
          <div className="row g-4 justify-content-center">
            {[
              { icon: '👨‍💼', title: 'Employees', desc: 'Manage claims and policies with ease', delay: 0 },
              { icon: '👥', title: 'HR Teams', desc: 'Automate reporting and approvals', delay: 0.1 },
              { icon: '🤝', title: 'Agents', desc: 'Deliver faster responses and better support', delay: 0.2 },
              { icon: '🏢', title: 'Enterprises', desc: 'Gain visibility, control, and compliance', delay: 0.3 }
            ].map((audience, index) => (
              <div key={index} className="col-xl-3 col-lg-4 col-md-6">
              <div style={{
                background: 'rgba(255,255,255,0.1)',
                padding: '2.5rem 2rem',
                borderRadius: '20px',
                textAlign: 'center',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255,255,255,0.2)',
                transform: `translateY(${isVisible.features ? '0' : '30px'}) scale(${isVisible.features ? 1 : 0.9})`,
                opacity: isVisible.features ? 1 : 0,
                transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${audience.delay}s`
              }}

                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                  e.currentTarget.style.transform = 'translateY(-10px) scale(1.05)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                }}
                >
                  <div style={{ 
                    fontSize: '3.5rem', 
                    marginBottom: '1.5rem',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                  }}>
                    {audience.icon}
                  </div>
                  <h5 className="fw-bold mb-3 text-white">{audience.title}</h5>
                  <p className="mb-0" style={{ opacity: 0.9, color: 'rgba(255,255,255,0.9)' }}>
                    {audience.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced How It Works Section */}
      <section 
        id="workflow" 
        data-section="workflow"
        className="py-5 position-relative"
        style={{ background: colors.light }}
      >
        <div className="container-fluid px-4">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3 display-5" style={{ color: colors.primary }}>
              How It Works
            </h2>
          </div>
          <div className="row justify-content-center position-relative">
            {/* Connecting line */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '10%',
              right: '10%',
              height: '3px',
              background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
              transform: 'translateY(-50%)',
              opacity: isVisible.workflow ? 1 : 0,
              transition: 'all 0.8s ease 0.5s',
              zIndex: 1
            }}></div>
            
            {[
              { step: '1', title: 'Submit Claims', desc: 'Employees submit claims online', icon: '📝' },
              { step: '2', title: 'Auto Verification', desc: 'System verifies eligibility using AI', icon: '🤖' },
              { step: '3', title: 'HR Approval', desc: 'HR reviews and approves digitally', icon: '✅' },
              { step: '4', title: 'Instant Updates', desc: 'Real-time status notifications', icon: '🔔' },
              { step: '5', title: 'Complete', desc: 'No paperwork. Complete transparency.', icon: '🎉' }
            ].map((step, index) => (
              <div key={index} className="col-lg-2 col-md-4 col-6 mb-4 position-relative" style={{ zIndex: 2 }}>
                <div style={{
                  transform: isVisible.workflow ? 
                    `translateY(0) scale(1) rotateY(0)` : 
                    `translateY(50px) scale(0.5) rotateY(90deg)`,
                  opacity: isVisible.workflow ? 1 : 0,
                  transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.2}s`
                }}>
                  <div 
                    style={{
                      ...styles.card,
                      padding: '2rem 1rem',
                      textAlign: 'center',
                      height: '100%',
                      background: colors.white
                    }}
                    onMouseEnter={(e) => {
                      Object.assign(e.currentTarget.style, styles.cardHover);
                      e.currentTarget.style.background = colors.gradientAccent;
                      e.currentTarget.style.color = colors.white;
                    }}
                    onMouseLeave={(e) => {
                      Object.assign(e.currentTarget.style, styles.card);
                      e.currentTarget.style.background = colors.white;
                      e.currentTarget.style.color = 'inherit';
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: '-20px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: colors.gradientAccent,
                      color: colors.white,
                      width: '45px',
                      height: '45px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
                    }}>
                      {step.step}
                    </div>
                    <div style={{ 
                      fontSize: '3rem', 
                      marginBottom: '1rem',
                      marginTop: '0.5rem'
                    }}>
                      {step.icon}
                    </div>
                    <h6 className="fw-bold mb-2" style={{ fontSize: '1rem' }}>{step.title}</h6>
                    <small style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                      {step.desc}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Why Choose Us Section */}
      <section 
        id="why-choose" 
        data-section="whyChoose"
        className="py-5 position-relative"
        style={{ background: colors.white }}
      >
        <div className="container-fluid px-4">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3 display-5" style={{ color: colors.primary }}>
              Why Choose InsurAI
            </h2>
          </div>
          <div className="row g-4 justify-content-center">
            {[
              {
                title: 'Faster Processing',
                description: 'Automated workflows reduce claim cycle time by up to 80%',
                icon: '⚡',
                stats: '80% Faster',
                color: colors.success
              },
              {
                title: 'Complete Transparency',
                description: 'Employees track everything in real time with full visibility',
                icon: '👁️',
                stats: '100% Transparent',
                color: colors.primary
              },
              {
                title: 'AI Intelligence',
                description: 'Early fraud detection and predictive insights with machine learning',
                icon: '🧠',
                stats: 'AI Powered',
                color: colors.secondary
              },
              {
                title: 'Scalable & Secure',
                description: 'Built for enterprises of any size with enterprise-grade security',
                icon: '🏢',
                stats: 'Enterprise Ready',
                color: colors.accent
              },
              {
                title: 'Data-Driven Decisions',
                description: 'Advanced reports and dashboards for strategic insights',
                icon: '📈',
                stats: 'Smart Analytics',
                color: colors.warning
              },
              {
                title: '24/7 Support',
                description: 'Round-the-clock customer support and technical assistance',
                icon: '🛡️',
                stats: 'Always Available',
                color: colors.primaryLight
              }
            ].map((reason, index) => (
              <div key={index} className="col-xl-4 col-lg-6 col-md-6">
                <div 
                  style={{
                    transform: isVisible.whyChoose ? 
                      `translateY(0) rotateZ(0)` : 
                      `translateY(50px) rotateZ(5deg)`,
                    opacity: isVisible.whyChoose ? 1 : 0,
                    transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`
                  }}
                >
                  <div 
                    style={{
                      ...styles.card,
                      padding: '2.5rem 2rem',
                      textAlign: 'center',
                      height: '100%',
                      borderLeft: `4px solid ${reason.color}`
                    }}
                    onMouseEnter={(e) => {
                      Object.assign(e.currentTarget.style, styles.cardHover);
                      e.currentTarget.style.borderLeft = `4px solid ${reason.color}`;
                    }}
                    onMouseLeave={(e) => {
                      Object.assign(e.currentTarget.style, styles.card);
                      e.currentTarget.style.borderLeft = `4px solid ${reason.color}`;
                    }}
                  >
                    <div style={{ 
                      fontSize: '3rem', 
                      marginBottom: '1.5rem',
                      background: `linear-gradient(135deg, ${reason.color} 0%, ${colors.primary} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      {reason.icon}
                    </div>
                    <h5 className="fw-bold mb-3" style={{ color: colors.dark, fontSize: '1.2rem' }}>
                      {reason.title}
                    </h5>
                    <p className="mb-4" style={{ 
                      lineHeight: '1.6', 
                      color: colors.gray,
                      fontSize: '0.95rem'
                    }}>
                      {reason.description}
                    </p>
                    <div style={{
                      background: reason.color,
                      color: colors.white,
                      padding: '0.6rem 1.5rem',
                      borderRadius: '25px',
                      display: 'inline-block',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      boxShadow: `0 4px 15px ${reason.color}40`
                    }}>
                      {reason.stats}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Vision Section */}
      <section 
        id="vision" 
        data-section="vision"
        className="py-5 text-white position-relative"
        style={{ 
          background: `linear-gradient(135deg, ${colors.dark} 0%, ${colors.primaryDark} 100%)`,
          overflow: 'hidden'
        }}
      >
        {/* Animated background elements */}
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'pulse 8s infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '15%',
          left: '5%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'pulse 6s infinite 2s'
        }}></div>

        <div className="container-fluid px-4 position-relative" style={{ zIndex: 2 }}>
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <div style={{
                transform: isVisible.vision ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(50px)',
                opacity: isVisible.vision ? 1 : 0,
                transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
              }}>
                <h2 className="fw-bold mb-4 display-5">Our Vision</h2>
                <p className="lead mb-4" style={{ 
                  fontSize: '1.3rem', 
                  lineHeight: '1.8',
                  opacity: 0.9
                }}>
                  To redefine how organizations handle corporate insurance — making it fully automated, 
                  transparent, and intelligent. We envision a future where insurance management is 
                  seamless, predictive, and empowers every stakeholder in the ecosystem.
                </p>
                <div style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  height: '2px',
                  width: '100%',
                  margin: '2rem auto',
                  animation: 'shimmer 3s infinite'
                }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Contact Section */}
      <section 
        id="contact" 
        data-section="contact"
        className="py-5 position-relative"
        style={{ background: colors.light }}
      >
        <div className="container-fluid px-4">
          <div className="row justify-content-center">
            <div className="col-lg-6 text-center">
              <div style={{
                transform: isVisible.contact ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.9)',
                opacity: isVisible.contact ? 1 : 0,
                transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
              }}>
                <h2 className="fw-bold mb-4 display-5" style={{ color: colors.primary }}>
                  Get in Touch
                </h2>
                <p className="mb-5" style={{ 
                  fontSize: '1.1rem', 
                  color: colors.gray,
                  lineHeight: '1.6'
                }}>
                  Interested in modernizing your organization's insurance operations?<br />
                  Let's build a smarter future together.
                </p>
                <button 
                  className="btn btn-primary btn-lg px-5 py-3 rounded-pill fw-semibold position-relative overflow-hidden"
                  style={{
                    background: colors.gradientAccent,
                    border: 'none',
                    fontSize: '1.1rem',
                    transition: 'all 0.4s ease',
                    minWidth: '180px',
                    boxShadow: `0 8px 25px ${colors.primaryLight}40`
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-3px) scale(1.05)';
                    e.target.style.boxShadow = `0 15px 35px ${colors.primaryLight}60`;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = `0 8px 25px ${colors.primaryLight}40`;
                  }}
                >
                  <span className="position-relative z-2">Contact Us</span>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                    transition: 'left 0.6s ease'
                  }}></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="py-4 text-white position-relative" style={{ background: colors.dark }}>
        <div className="container-fluid px-4 text-center">
          <p className="mb-0" style={{ fontSize: '0.95rem', opacity: 0.8 }}>
            &copy; 2024 InsurAI. All rights reserved. Corporate Policy Automation and Intelligence System.
          </p>
        </div>
      </footer>

      {/* Advanced Global Styles */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.7; }
          }
          
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0) translateX(-50%); }
            40% { transform: translateY(-10px) translateX(-50%); }
            60% { transform: translateY(-5px) translateX(-50%); }
          }
          
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          html {
            scroll-behavior: smooth;
          }
          
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 0;
            width: 100%;
            overflow-x: hidden;
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          
          section {
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          .container-fluid {
            width: 100%;
            margin: 0 auto;
          }
          
          .btn-link {
            text-decoration: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .btn-link:hover {
            transform: translateY(-2px);
          }
          
          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: ${colors.light};
          }
          
          ::-webkit-scrollbar-thumb {
            background: ${colors.primary};
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: ${colors.primaryDark};
          }
          
          @media (max-width: 768px) {
            .display-4 {
              font-size: 2.5rem !important;
            }
            .display-5 {
              font-size: 2rem !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Homepage;