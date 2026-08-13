import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Sparkles, Download } from "lucide-react";
import apiClient, { getMediaUrl } from "../utils/apiClient";
import PublicNavbar from "./PublicNavbar";
import PublicFooter from "./PublicFooter";

const Home = () => {
  const [about, setAbout] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  // Interactive state for Services preview card switcher
  const [activeServiceTab, setActiveServiceTab] = useState({
    "001": 0,
    "002": 0,
    "003": 0,
  });

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    setLoading(true);
    try {
      const [aboutRes, projRes, skillsRes, resumeRes] =
        await Promise.allSettled([
          apiClient.get("/api/about"),
          apiClient.get("/api/projects"),
          apiClient.get("/api/skills"),
          apiClient.get("/api/resume"),
        ]);

      if (aboutRes.status === "fulfilled" && aboutRes.value.data) {
        const d = aboutRes.value.data;
        const aboutObj = d.data
          ? Array.isArray(d.data)
            ? d.data[0]
            : d.data
          : Array.isArray(d)
          ? d[0]
          : d;
        setAbout(aboutObj);
      }

      if (projRes.status === "fulfilled" && projRes.value.data) {
        const d = projRes.value.data;
        setProjects(d.data || (Array.isArray(d) ? d : []));
      }

      if (skillsRes.status === "fulfilled" && skillsRes.value.data) {
        const d = skillsRes.value.data;
        setSkills(d.data || (Array.isArray(d) ? d : []));
      }

      if (resumeRes.status === "fulfilled" && resumeRes.value.data) {
        const d = resumeRes.value.data;
        setResume(d.data || d);
      }
    } catch (err) {
      console.error("Home data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fullName = about?.full_name || "Adila Farhana V V";
  const firstName = fullName.split(" ")[0].toUpperCase();
  const displayTitle = "Backend Developer";
  const displayIntro =
    "CRAFTING ROBUST BACKEND ARCHITECTURES, SCALABLE REST APIS & HIGH-PERFORMANCE DATABASE SYSTEMS.";
  const displayAvatar = about?.profile_image
    ? getMediaUrl(about.profile_image)
    : "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=85";

  // Fallback backend projects if DB is empty
  const defaultProjects = [
    {
      id: 5,
      title: "Kallose (Online Shopping)",
      category: "Backend & API Architecture",
      description:
        "E-commerce backend supporting product catalogs, rental/purchase workflows, cart state, secure order management, and payment integrations.",
      technologies: ["Node.js", "Express.js", "MongoDB", "REST API", "JWT"],
      project_image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: 4,
      title: "Academic Task Management System",
      category: "Backend Management System",
      description:
        "Backend system handling student submissions, assignment tracking, automated deadline alerts, and role-based permissions for faculty and students.",
      technologies: ["Node.js", "Express", "MongoDB", "RESTful API"],
      project_image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: 3,
      title: "Vehicle Marketplace & Rental Platform",
      category: "API & Database System",
      description:
        "Car rental and sales backend service with reservation workflows, payment gateways, status approvals, and review pipelines.",
      technologies: ["Laravel", "PHP", "MySQL", "REST API", "Flask"],
      project_image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80",
    },
  ];

  const displayProjects = projects.length > 0 ? projects : defaultProjects;
  const featuredProjects = displayProjects.slice(0, 4);

  const getSlug = (project) => {
    if (!project) return "project";
    return (
      project.title
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || project.id
    );
  };

  // Backend Developer Specializations
  const servicesList = [
    {
      id: "001",
      number: "001",
      title: "BACKEND API & MICROSERVICES",
      description:
        "Designing secure, scalable RESTful APIs and robust application logic using Laravel (PHP) and Node.js / Express.",
      tags: [
        "Laravel & PHP",
        "Node.js & Express.js",
        "RESTful API Design",
        "JWT Auth & Security",
        "MVC Architecture",
        "Postman API Testing",
      ],
      images: [
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
      ],
    },
    {
      id: "002",
      number: "002",
      title: "DATABASE DESIGN & OPTIMIZATION",
      description:
        "Architecting structured relational and NoSQL databases with MySQL and MongoDB, query optimization, and clean migrations.",
      tags: [
        "MySQL & Eloquent ORM",
        "MongoDB & Mongoose",
        "Schema Design & Indexing",
        "Data Normalization",
        "CRUD Operations",
        "Database Migrations",
      ],
      images: [
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
      ],
    },
    {
      id: "003",
      number: "003",
      title: "SERVER LOGIC & AUTHENTICATION",
      description:
        "Building role-based access control (RBAC), third-party service integrations, secure authentication, and backend workflows.",
      tags: [
        "Role-Based Access (RBAC)",
        "Authentication Middleware",
        "Payment & Cart Workflows",
        "Third-Party API Integration",
        "Git Version Control",
        "Agile Team Collaboration",
      ],
      images: [
        "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80",
      ],
    },
  ];

  // Backend Development Process Steps
  const backendProcessSteps = [
    {
      icon: "✦",
      title: "BUSINESS LOGIC & REQUIREMENTS",
      description:
        "Analyzing domain logic, API endpoints, data models, and backend workflow requirements.",
    },
    {
      icon: "✱",
      title: "DATABASE & SCHEMA MODELING",
      description:
        "Designing optimized database schemas (MySQL/MongoDB), ER relationships, and API specifications.",
    },
    {
      icon: "✦",
      title: "BACKEND API DEVELOPMENT",
      description:
        "Writing clean, modular backend services in Laravel and Node.js/Express following strict MVC patterns.",
    },
    {
      icon: "✦",
      title: "TESTING, POSTMAN & DEPLOYMENT",
      description:
        "Validating endpoints via Postman, testing authentication rules, query optimization, and production deployment.",
    },
  ];

  // Backend Tech Stack Ticker
  const techLogos = [
    { name: "LARAVEL", icon: "🔴" },
    { name: "PHP", icon: "🐘" },
    { name: "NODE.JS", icon: "🟢" },
    { name: "EXPRESS.JS", icon: "⚡" },
    { name: "MYSQL", icon: "🐬" },
    { name: "MONGODB", icon: "🍃" },
    { name: "REST APIS", icon: "🔌" },
    { name: "POSTMAN", icon: "🟠" },
    { name: "GIT & GITHUB", icon: "🐙" },
    { name: "REACT.JS", icon: "⚛" },
  ];

  return (
    <div className="portix-home-view">
      <style>{`
        .portix-home-view {
          min-height: 100vh;
          background: var(--bg-primary);
          color: var(--text-light);
          font-family: var(--font-main);
          position: relative;
          overflow-x: hidden;
        }

        /* Top Loading Line */
        .top-loading-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #f05a28, #ea580c, #f59e0b);
          z-index: 9999;
        }

        .home-main-container {
          max-width: 1360px;
          margin: 0 auto;
          padding: 24px 32px 100px 32px;
          position: relative;
          z-index: 1;
        }

        @media (max-width: 768px) {
          .home-main-container {
            padding: 16px 16px 60px 16px;
          }
        }

        /* ==========================================================================
           1. HERO SECTION (Backend Developer Terracotta Hero)
           ========================================================================== */
        .hero-banner-container {
          background: var(--hero-terracotta-gradient);
          border-radius: 32px;
          position: relative;
          overflow: hidden;
          min-height: 640px;
          padding: 48px 56px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border: 1px solid rgba(255, 255, 255, 0.22);
          box-shadow: 0 24px 60px rgba(234, 88, 12, 0.25);
          margin-bottom: 72px;
        }

        @media (max-width: 900px) {
          .hero-banner-container {
            padding: 32px 24px;
            min-height: 580px;
            border-radius: 24px;
          }
        }

        /* Grid lines & Crosshair markers */
        .hero-grid-lines {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
          background-size: 160px 160px;
          z-index: 1;
        }

        .hero-crosshair {
          position: absolute;
          font-family: var(--font-mono);
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.4);
          font-weight: 300;
          z-index: 2;
          user-select: none;
        }

        .crosshair-tl { top: 24px; left: 24px; }
        .crosshair-tr { top: 24px; right: 24px; }
        .crosshair-bl { bottom: 24px; left: 24px; }
        .crosshair-br { bottom: 24px; right: 24px; }

        /* Giant Background Typography Name */
        .hero-bg-giant-name {
          position: absolute;
          top: 35%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-family: var(--font-display);
          font-size: clamp(5.5rem, 16vw, 14rem);
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 0.85;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.18);
          white-space: nowrap;
          user-select: none;
          pointer-events: none;
          z-index: 1;
          text-align: center;
        }

        /* Top Hero Row: Manifesto on Left, Floating Polaroid on Right */
        .hero-top-row {
          position: relative;
          z-index: 3;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 24px;
        }

        .hero-manifesto-box {
          max-width: 360px;
        }

        .hero-manifesto-cross {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.9rem;
          margin-bottom: 8px;
        }

        .hero-manifesto-text {
          font-size: 0.88rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          line-height: 1.5;
          color: #ffffff;
          margin: 0;
          opacity: 0.95;
        }

        /* Floating Polaroid Project Card (Top Right) */
        .hero-polaroid-card {
          background: #ffffff;
          border-radius: 12px;
          padding: 10px 10px 8px 10px;
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.35);
          width: 175px;
          display: flex;
          flex-direction: column;
          transform: rotate(2deg);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          text-decoration: none;
          color: #09090b;
        }

        @media (max-width: 768px) {
          .hero-polaroid-card {
            display: none;
          }
        }

        .hero-polaroid-card:hover {
          transform: rotate(0deg) scale(1.05);
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.45);
        }

        .hero-polaroid-img {
          width: 100%;
          height: 120px;
          object-fit: cover;
          border-radius: 6px;
          background: #f1f5f9;
        }

        .hero-polaroid-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 2px 2px 2px;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          color: #18181b;
        }

        .hero-polaroid-tag {
          color: #71717a;
          font-weight: 600;
        }

        /* Central Subject Cutout Portrait */
        .hero-portrait-stage {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          height: 85%;
          max-height: 520px;
          z-index: 2;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          pointer-events: none;
          mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
        }

        @media (max-width: 900px) {
          .hero-portrait-stage {
            height: 70%;
            max-height: 400px;
          }
        }

        .hero-cutout-img {
          height: 100%;
          width: auto;
          object-fit: contain;
          border-radius: 28px 28px 0 0;
          filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.45));
        }

        /* Bottom Hero Row: Bold Name Foreground + Floating Let's Talk Widget */
        .hero-bottom-row {
          position: relative;
          z-index: 3;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
          margin-top: auto;
        }

        .hero-bottom-left-brand {
          display: flex;
          flex-direction: column;
        }

        .hero-year-tag {
          font-size: 0.88rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 2px;
        }

        .hero-foreground-name {
          font-family: var(--font-display);
          font-size: clamp(3rem, 7.5vw, 6.2rem);
          font-weight: 900;
          letter-spacing: -0.03em;
          line-height: 0.9;
          text-transform: uppercase;
          color: #ffffff;
          margin: 0;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
        }

        /* Floating Interactive "Let's Talk" Mini-Card (Bottom Right) */
        .hero-talk-interactive-card {
          background: rgba(18, 18, 22, 0.88);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 16px;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          gap: 14px;
          text-decoration: none;
          color: #ffffff;
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.4);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-talk-interactive-card:hover {
          background: rgba(18, 18, 22, 0.98);
          border-color: rgba(255, 255, 255, 0.35);
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 20px 48px rgba(0, 0, 0, 0.6);
        }

        .hero-talk-avatar {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          object-fit: cover;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .hero-talk-meta {
          display: flex;
          flex-direction: column;
        }

        .hero-talk-eyebrow {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #a1a1aa;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .hero-talk-name {
          font-size: 0.95rem;
          font-weight: 900;
          color: #ffffff;
          letter-spacing: -0.01em;
        }

        .hero-talk-role {
          font-size: 0.76rem;
          color: #a1a1aa;
          font-weight: 600;
        }

        .hero-talk-arrow-btn {
          width: 36px;
          height: 36px;
          background: #ffffff;
          color: #09090b;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          transition: transform 0.25s ease, background 0.25s ease, color 0.25s ease;
        }

        .hero-talk-interactive-card:hover .hero-talk-arrow-btn {
          background: var(--accent-orange);
          color: #ffffff;
          transform: translate(2px, -2px);
        }

        /* ==========================================================================
           2. BRAND SOCIAL PROOF & IMPACT SECTION (Backend Focus)
           ========================================================================== */
        .impact-section-wrap {
          margin-bottom: 110px;
        }

        .brand-logos-strip {
          display: flex;
          align-items: center;
          gap: 28px;
          padding: 24px 0 48px 0;
          border-bottom: 1px solid var(--border-subtle);
          margin-bottom: 64px;
          overflow: hidden;
          position: relative;
        }

        .brand-strip-label {
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--text-muted);
          white-space: nowrap;
          margin-right: 16px;
        }

        .brand-logo-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-dim);
          padding: 8px 18px;
          border-radius: 8px;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          margin-right: 16px;
          transition: all 0.2s ease;
        }

        .brand-logo-pill:hover {
          color: var(--text-pure-white);
          border-color: var(--border-light);
        }

        .impact-grid-layout {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 56px;
          align-items: center;
        }

        @media (max-width: 980px) {
          .impact-grid-layout {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }

        .pill-badge-orange {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(240, 90, 40, 0.12);
          border: 1px solid rgba(240, 90, 40, 0.35);
          color: var(--accent-orange);
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 0.76rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .impact-giant-headline {
          font-family: var(--font-display);
          font-size: clamp(2.8rem, 6vw, 4.8rem);
          font-weight: 900;
          letter-spacing: -0.03em;
          line-height: 1.02;
          text-transform: uppercase;
          color: var(--text-pure-white);
          margin-bottom: 24px;
        }

        .impact-statement-text {
          font-size: 1.12rem;
          line-height: 1.7;
          color: var(--text-muted);
          max-width: 580px;
        }

        .impact-mood-card-frame {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          background: var(--bg-surface);
          border: 1px solid var(--border-light);
          box-shadow: var(--shadow-lg);
          aspect-ratio: 4/3;
        }

        .impact-mood-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: contrast(1.1) brightness(0.95);
          transition: transform 0.5s ease;
        }

        .impact-mood-card-frame:hover .impact-mood-img {
          transform: scale(1.04);
        }

        .sparkle-icon-accent {
          position: absolute;
          top: -24px;
          right: -24px;
          width: 80px;
          height: 80px;
          color: var(--accent-orange);
          opacity: 0.7;
          pointer-events: none;
        }

        /* ==========================================================================
           3. NUMBERED SERVICES & WHAT I DO SECTION (Backend Focus)
           ========================================================================== */
        .services-section-wrap {
          margin-bottom: 120px;
        }

        .services-list-container {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .service-row-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: 28px;
          padding: 40px 48px;
          display: grid;
          grid-template-columns: 80px 1fr 340px;
          gap: 36px;
          align-items: center;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: var(--shadow-sm);
        }

        @media (max-width: 1080px) {
          .service-row-card {
            grid-template-columns: 60px 1fr;
            padding: 32px;
          }
          .service-preview-pane {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 640px) {
          .service-row-card {
            grid-template-columns: 1fr;
            padding: 24px;
            gap: 20px;
          }
        }

        .service-row-card:hover {
          border-color: var(--accent-orange);
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .service-number-col {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--accent-orange);
        }

        .service-info-col {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .service-title-text {
          font-family: var(--font-display);
          font-size: 1.7rem;
          font-weight: 900;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: var(--accent-orange);
        }

        .service-desc-text {
          font-size: 0.98rem;
          color: var(--text-muted);
          line-height: 1.6;
          max-width: 520px;
        }

        .service-tags-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 8px;
        }

        .service-pill-tag {
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-light);
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-light);
          letter-spacing: 0.02em;
          transition: all 0.2s ease;
        }

        .service-pill-tag:hover {
          border-color: var(--accent-orange);
          color: var(--accent-orange);
        }

        /* Interactive Switcher Pane on Right */
        .service-preview-pane {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          height: 190px;
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-light);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.3);
        }

        .service-preview-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .service-row-card:hover .service-preview-img {
          transform: scale(1.05);
        }

        .service-switcher-dots {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 6px;
          background: rgba(18, 18, 22, 0.75);
          backdrop-filter: blur(8px);
          padding: 4px 8px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          z-index: 2;
        }

        .switcher-dot-btn {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: none;
          background: rgba(255, 255, 255, 0.4);
          cursor: pointer;
          transition: all 0.2s ease;
          padding: 0;
        }

        .switcher-dot-btn.active {
          background: var(--accent-orange);
          width: 16px;
          border-radius: 6px;
        }

        /* ==========================================================================
           4. FEATURED WORKS POLAROID SHOWCASE (Backend Projects)
           ========================================================================== */
        .works-section-wrap {
          margin-bottom: 120px;
        }

        .works-section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 48px;
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 20px;
        }

        .works-polaroid-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 36px;
        }

        .polaroid-work-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 14px 14px 16px 14px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3);
          text-decoration: none;
          color: #09090b;
          display: flex;
          flex-direction: column;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .polaroid-work-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 24px 55px rgba(0, 0, 0, 0.45);
        }

        .polaroid-work-img-wrap {
          width: 100%;
          aspect-ratio: 16/11;
          border-radius: 10px;
          overflow: hidden;
          background: #f1f5f9;
          position: relative;
        }

        .polaroid-work-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .polaroid-work-card:hover .polaroid-work-img {
          transform: scale(1.06);
        }

        .polaroid-work-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 14px;
          font-weight: 800;
          font-size: 0.85rem;
          letter-spacing: 0.04em;
        }

        .polaroid-work-title {
          font-family: var(--font-display);
          font-size: 1.02rem;
          font-weight: 900;
          color: #09090b;
          display: flex;
          align-items: center;
          gap: 6px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 72%;
        }

        .polaroid-work-cat {
          color: #71717a;
          font-size: 0.76rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        /* ==========================================================================
           5. BACKEND DEVELOPMENT PROCESS (The 4 Dark Cards)
           ========================================================================== */
        .process-section-wrap {
          margin-bottom: 120px;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: 36px;
          padding: 64px 48px;
          box-shadow: var(--shadow-lg);
          position: relative;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .process-section-wrap {
            padding: 40px 24px;
            border-radius: 24px;
          }
        }

        .process-header-center {
          text-align: center;
          margin-bottom: 56px;
        }

        .process-giant-title {
          font-family: var(--font-display);
          font-size: clamp(2.4rem, 5vw, 3.8rem);
          font-weight: 900;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: var(--text-pure-white);
          line-height: 1.05;
        }

        .process-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        @media (max-width: 1080px) {
          .process-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .process-cards-grid {
            grid-template-columns: 1fr;
          }
        }

        .process-dark-card {
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-light);
          border-radius: 20px;
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 240px;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: var(--shadow-sm);
        }

        .process-dark-card:hover {
          border-color: var(--accent-orange);
          transform: translateY(-6px);
          box-shadow: var(--shadow-orange);
        }

        .process-card-icon {
          color: var(--accent-orange);
          font-size: 1.4rem;
          margin-bottom: 12px;
        }

        .process-card-title {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 900;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--text-pure-white);
          margin-bottom: 16px;
        }

        .process-card-desc {
          font-size: 0.88rem;
          color: var(--text-muted);
          line-height: 1.6;
          margin: 0;
        }

        /* ==========================================================================
           6. STATS & COLLABORATION BANNER
           ========================================================================== */
        .stats-grid-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 90px;
        }

        @media (max-width: 860px) {
          .stats-grid-row {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .stat-card-clean {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: 20px;
          padding: 28px 20px;
          text-align: center;
          box-shadow: var(--shadow-sm);
          transition: all 0.3s ease;
        }

        .stat-card-clean:hover {
          border-color: var(--accent-orange);
          transform: translateY(-4px);
        }

        .stat-num-value {
          font-family: var(--font-display);
          font-size: 2.8rem;
          font-weight: 900;
          color: var(--text-pure-white);
          margin-bottom: 4px;
          letter-spacing: -0.02em;
        }

        .stat-label-title {
          font-size: 0.82rem;
          color: var(--text-muted);
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        /* CTA Banner */
        .cta-box-editorial {
          background: var(--bg-surface);
          border: 1px solid var(--border-light);
          border-radius: 32px;
          padding: 56px 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: var(--shadow-lg);
          flex-wrap: wrap;
          gap: 32px;
        }

        .cta-btn-primary {
          background: var(--accent-orange);
          color: #ffffff;
          font-weight: 800;
          font-size: 0.92rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 16px 36px;
          border-radius: 10px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 12px 30px rgba(240, 90, 40, 0.35);
          transition: all 0.3s ease;
        }

        .cta-btn-primary:hover {
          background: var(--accent-orange-hover);
          transform: translateY(-3px);
          box-shadow: 0 16px 36px rgba(240, 90, 40, 0.5);
        }

        .cta-btn-secondary {
          background: transparent;
          border: 1px solid var(--border-light);
          color: var(--text-pure-white);
          font-weight: 800;
          font-size: 0.92rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 16px 36px;
          border-radius: 10px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s ease;
        }

        .cta-btn-secondary:hover {
          border-color: var(--text-pure-white);
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-3px);
        }
      `}</style>

      {loading && <div className="top-loading-bar" />}

      {/* Global Navigation */}
      <PublicNavbar />

      <main className="home-main-container">
        {/* =========================================================================
            1. HERO SECTION (Backend Developer Terracotta Hero)
            ========================================================================= */}
        <motion.section
          className="hero-banner-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Grid lines & corner crosshairs */}
          <div className="hero-grid-lines" />
          <span className="hero-crosshair crosshair-tl">+</span>
          <span className="hero-crosshair crosshair-tr">+</span>
          <span className="hero-crosshair crosshair-bl">+</span>
          <span className="hero-crosshair crosshair-br">+</span>

          {/* Giant Background Typography Name */}
          <div className="hero-bg-giant-name">{firstName}</div>

          {/* Top Row: Manifesto & Floating Polaroid Project Card */}
          <div className="hero-top-row">
            <motion.div
              className="hero-manifesto-box"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="hero-manifesto-cross">+</div>
              <p className="hero-manifesto-text">{displayIntro}</p>
            </motion.div>

            {featuredProjects.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20, rotate: 6 }}
                animate={{ opacity: 1, y: 0, rotate: 2 }}
                transition={{ delay: 0.5, duration: 0.7 }}
              >
                <Link
                  to={`/projects/${getSlug(featuredProjects[0])}`}
                  className="hero-polaroid-card"
                  title="View Featured Project"
                >
                  <img
                    src={
                      featuredProjects[0]?.project_image
                        ? getMediaUrl(featuredProjects[0].project_image)
                        : "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&auto=format&fit=crop&q=80"
                    }
                    alt={featuredProjects[0]?.title || "Project"}
                    className="hero-polaroid-img"
                  />
                  <div className="hero-polaroid-footer">
                    <span>✱ {featuredProjects[0]?.title?.split(" ")[0]?.toUpperCase() || "KALLOSE"}</span>
                    <span className="hero-polaroid-tag">/Backend</span>
                  </div>
                </Link>
              </motion.div>
            )}
          </div>

          {/* Center Cutout Portrait */}
          <motion.div
            className="hero-portrait-stage"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.9, ease: "easeOut" }}
          >
            <img
              src={displayAvatar}
              alt={fullName}
              className="hero-cutout-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=85";
              }}
            />
          </motion.div>

          {/* Bottom Row: Foreground Name & Floating "Let's Talk" Mini-Card */}
          <div className="hero-bottom-row">
            <motion.div
              className="hero-bottom-left-brand"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="hero-year-tag">©2026</div>
              <h1 className="hero-foreground-name">{firstName}</h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Link to="/contact" className="hero-talk-interactive-card">
                <img
                  src={displayAvatar}
                  alt={fullName}
                  className="hero-talk-avatar"
                />
                <div className="hero-talk-meta">
                  <span className="hero-talk-eyebrow">
                    Let's Talk <Sparkles size={12} style={{ color: "var(--accent-orange)" }} />
                  </span>
                  <span className="hero-talk-name">{fullName}</span>
                  <span className="hero-talk-role">{displayTitle}</span>
                </div>
                <div className="hero-talk-arrow-btn">
                  <ArrowUpRight size={18} />
                </div>
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* =========================================================================
            2. BACKEND TECH STACK & IMPACT SECTION
            ========================================================================= */}
        <section className="impact-section-wrap">
          {/* Tech Stack Ticker Strip */}
          <div className="brand-logos-strip">
            <span className="brand-strip-label">BACKEND TECHNOLOGIES & TOOLS</span>
            <div className="marquee-track">
              {techLogos.concat(techLogos).map((t, idx) => (
                <div key={idx} className="brand-logo-pill">
                  <span>{t.icon}</span>
                  <span>{t.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="impact-grid-layout">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="pill-badge-orange">
                <span>✱</span>
                <span>BACKEND DEVELOPMENT</span>
              </div>

              <h2 className="impact-giant-headline">
                BUILDING IMPACT <br />
                THROUGH <br />
                <span className="text-outline">SCALABLE</span> SYSTEMS
              </h2>

              <p className="impact-statement-text">
                HI, I'M {fullName.toUpperCase()}, A {displayTitle.toUpperCase()} SPECIALIZING IN
                ROBUST LARAVEL & PHP APPLICATIONS, NODE.JS REST APIS, AND HIGH-PERFORMANCE
                RELATIONAL AND NOSQL DATABASES. I DESIGN AND BUILD SECURE, EFFICIENT BACKEND ARCHITECTURES.
              </p>
            </motion.div>

            <motion.div
              className="impact-mood-card-frame"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="sparkle-icon-accent">
                <Sparkles size={64} />
              </div>
              <img
                src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&auto=format&fit=crop&q=80"
                alt="Backend Server and Database Infrastructure"
                className="impact-mood-img"
              />
            </motion.div>
          </div>
        </section>

        {/* =========================================================================
            3. NUMBERED SERVICES & WHAT I DO (Backend Developer Specializations)
            ========================================================================= */}
        <section className="services-section-wrap">
          <div style={{ marginBottom: "48px" }}>
            <div className="pill-badge-orange">
              <span>✱</span>
              <span>SPECIALIZATIONS</span>
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.4rem, 5vw, 3.4rem)",
                fontWeight: "900",
                textTransform: "uppercase",
                color: "var(--text-pure-white)",
                letterSpacing: "-0.02em",
              }}
            >
              WHAT I DO & DELIVER
            </h2>
          </div>

          <div className="services-list-container">
            {servicesList.map((srv, index) => {
              const currentTabIdx = activeServiceTab[srv.id] || 0;
              return (
                <motion.div
                  key={srv.id}
                  className="service-row-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                >
                  <div className="service-number-col">
                    <span>✱</span>
                    <span>{srv.number}</span>
                  </div>

                  <div className="service-info-col">
                    <h3 className="service-title-text">{srv.title}</h3>
                    <p className="service-desc-text">{srv.description}</p>
                    <div className="service-tags-wrap">
                      {srv.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="service-pill-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="service-preview-pane">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentTabIdx}
                        src={srv.images[currentTabIdx]}
                        alt={srv.title}
                        className="service-preview-img"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    </AnimatePresence>

                    <div className="service-switcher-dots">
                      {srv.images.map((_, imgIdx) => (
                        <button
                          key={imgIdx}
                          onClick={() =>
                            setActiveServiceTab((prev) => ({
                              ...prev,
                              [srv.id]: imgIdx,
                            }))
                          }
                          className={`switcher-dot-btn ${
                            currentTabIdx === imgIdx ? "active" : ""
                          }`}
                          aria-label={`Slide ${imgIdx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            4. FEATURED WORKS POLAROID SHOWCASE (Backend Projects)
            ========================================================================= */}
        <section className="works-section-wrap">
          <div className="works-section-header">
            <div>
              <div className="pill-badge-orange">
                <span>✱</span>
                <span>CURATED PORTFOLIO</span>
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2.4rem, 5vw, 3.4rem)",
                  fontWeight: "900",
                  textTransform: "uppercase",
                  color: "var(--text-pure-white)",
                  letterSpacing: "-0.02em",
                }}
              >
                FEATURED PROJECTS
              </h2>
            </div>

            <Link
              to="/projects"
              style={{
                color: "var(--text-pure-white)",
                textDecoration: "none",
                fontWeight: "800",
                fontSize: "0.9rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>View All Works</span>
              <ArrowUpRight size={18} style={{ color: "var(--accent-orange)" }} />
            </Link>
          </div>

          <div className="works-polaroid-grid">
            {featuredProjects.map((proj, pIdx) => (
              <motion.div
                key={proj.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: pIdx * 0.1, duration: 0.6 }}
              >
                <Link
                  to={`/projects/${getSlug(proj)}`}
                  className="polaroid-work-card"
                >
                  <div className="polaroid-work-img-wrap">
                    <img
                      src={
                        proj.project_image
                          ? getMediaUrl(proj.project_image)
                          : pIdx === 0
                          ? "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80"
                          : pIdx === 1
                          ? "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80"
                          : "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80"
                      }
                      alt={proj.title}
                      className="polaroid-work-img"
                    />
                  </div>
                  <div className="polaroid-work-footer">
                    <span className="polaroid-work-title" title={proj.title}>
                      <span>✱</span>
                      <span>{proj.title}</span>
                    </span>
                    <span className="polaroid-work-cat">
                      /{proj.category || "Backend"}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            5. BACKEND DEVELOPMENT PROCESS (The 4 Dark Cards)
            ========================================================================= */}
        <section className="process-section-wrap">
          <div className="process-header-center">
            <div className="pill-badge-orange">
              <span>✱</span>
              <span>DEVELOPMENT METHODOLOGY</span>
            </div>
            <h2 className="process-giant-title">BACKEND DEVELOPMENT PROCESS</h2>
          </div>

          <div className="process-cards-grid">
            {backendProcessSteps.map((step, sIdx) => (
              <motion.div
                key={sIdx}
                className="process-dark-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: sIdx * 0.12, duration: 0.6 }}
              >
                <div>
                  <div className="process-card-icon">{step.icon}</div>
                  <h3 className="process-card-title">{step.title}</h3>
                </div>
                <p className="process-card-desc">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            6. LIVE STATS COUNTER STRIP
            ========================================================================= */}
        <section className="stats-grid-row">
          <motion.div
            className="stat-card-clean"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="stat-num-value">{about?.years_experience || "1+"}</div>
            <div className="stat-label-title">Years Experience</div>
          </motion.div>

          <motion.div
            className="stat-card-clean"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="stat-num-value">{projects.length || "3"}+</div>
            <div className="stat-label-title">Backend Projects</div>
          </motion.div>

          <motion.div
            className="stat-card-clean"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="stat-num-value">{skills.length || "8"}+</div>
            <div className="stat-label-title">Core Technologies</div>
          </motion.div>

          <motion.div
            className="stat-card-clean"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="stat-num-value" style={{ color: "var(--accent-orange)" }}>
              100%
            </div>
            <div className="stat-label-title">Available for Hire</div>
          </motion.div>
        </section>

        {/* =========================================================================
            7. COLLABORATION CALL TO ACTION BANNER
            ========================================================================= */}
        <motion.section
          className="cta-box-editorial"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <div className="pill-badge-orange">
              <span>✱</span>
              <span>LET'S COLLABORATE</span>
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
                fontWeight: "900",
                textTransform: "uppercase",
                color: "var(--text-pure-white)",
                marginBottom: "8px",
                letterSpacing: "-0.02em",
              }}
            >
              LOOKING FOR A BACKEND DEVELOPER?
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", maxWidth: "540px" }}>
              Let’s build secure REST APIs, robust database architectures, and high-performance backend systems together.
            </p>
          </div>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Link to="/contact" className="cta-btn-primary">
              <span>Get In Touch</span>
              <ArrowUpRight size={18} />
            </Link>
            {resume ? (
              <a
                href={getMediaUrl(resume.file_path)}
                download
                className="cta-btn-secondary"
                target="_blank"
                rel="noreferrer"
              >
                <span>Download Resume</span>
                <Download size={16} />
              </a>
            ) : (
              <Link to="/about" className="cta-btn-secondary">
                <span>About Me</span>
              </Link>
            )}
          </div>
        </motion.section>
      </main>

      {/* Global Footer */}
      <PublicFooter />
    </div>
  );
};

export default Home;
