import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  Unlock, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Github, 
  Instagram, 
  Send, 
  Mail, 
  Phone,
  Edit3,
  Save,
  X,
  CheckCircle2,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { PortfolioData, Project, Skill } from './types';
import { initAuth, verifyPassword, updatePassword } from './lib/auth';

const INITIAL_DATA: PortfolioData = {
  name: "Muhamad Muzamil Kareem",
  role: "App & Website Developer | UI/UX | System Architecture Designer",
  email: "web.muzamil@gmail.com",
  whatsapp: "+923250080016",
  instagram: "@web.muzamil",
  telegram: "+92 325 0080016",
  quote: "I knew I can do it — so I did.",
  quotes: [
    "I knew I can do it — so I did.",
    "Code is the closest thing we have to a superpower.",
    "The best interface is the one you forget you're using.",
    "First solve the problem, then write the code.",
    "Every commit is a promise to future you.",
    "Simplicity is the soul of efficiency.",
    "Talk is cheap. Show me the code.",
    "CSS is art. JS is magic. HTML is the canvas.",
    "Great software is poetry that runs.",
    "The future belongs to those who learn, unlearn, and relearn."
  ],
  logo: "MK",
  profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
  projects: [
    { id: '1', name: 'E-Commerce Redesign', description: 'High-performance editorial storefront.', tags: ['HTML', 'CSS', 'JS'], url: '#', status: 'Finished', date: '2024-01' },
    { id: '2', name: 'Kinetic Tracker', description: 'Real-time performance monitoring.', tags: ['React', 'JS'], url: '#', status: 'Ongoing', date: '2024-02' },
    { id: '3', name: 'Visual Soul CMS', description: 'CMS focused on typography.', tags: ['HTML', 'CSS'], url: '#', status: 'Finished', date: '2023-11' },
    { id: '4', name: 'Quantum Analytics', description: 'Data-dense dashboard.', tags: ['React', 'Tailwind'], url: '#', status: 'Planned', date: '2024-03' },
  ],
  skills: [
    { id: '1', name: 'HTML' }, { id: '2', name: 'CSS' }, { id: '3', name: 'JavaScript' },
    { id: '4', name: 'React' }, { id: '5', name: 'Node.js' }, { id: '6', name: 'Tailwind CSS' },
    { id: '7', name: 'Git' }, { id: '8', name: 'UI/UX' }
  ]
};

const TECH_ICONS: Record<string, React.ReactNode> = {
  'HTML': <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#E34F26"><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"/></svg>,
  'CSS': <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#1572B6"><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z"/></svg>,
  'JavaScript': <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#F7DF1E"><path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z"/></svg>,
  'React': <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#61DAFB"><path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z"/></svg>,
  'Node.js': <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#339933"><path d="M11.998.016C5.37.016.004 5.382.004 12.01c0 6.628 5.367 11.994 11.994 11.994S23.992 18.638 23.992 12.01C23.992 5.383 18.626.016 11.998.016zm-.04 2.153c.416 0 .833.108 1.202.326l7.72 4.454c.741.428 1.2 1.22 1.2 2.077v8.908c0 .856-.459 1.648-1.2 2.076l-7.72 4.454c-.74.427-1.658.427-2.398 0l-7.72-4.454c-.74-.427-1.2-1.22-1.2-2.076V9.026c0-.856.46-1.649 1.2-2.077l7.72-4.454c.37-.218.787-.326 1.196-.326zm.04 2.153L6.264 7.9v7.622l5.694 3.578 5.694-3.578V7.9l-5.654-3.578z"/></svg>,
  'Tailwind CSS': <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#06B6D4"><path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/></svg>,
  'Git': <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#F05032"><path d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.658 2.66c.645-.223 1.387-.078 1.9.435.721.72.721 1.884 0 2.604-.719.719-1.881.719-2.6 0-.539-.541-.674-1.337-.404-1.996L12.86 8.955v6.525c.176.086.342.203.488.348.713.721.713 1.883 0 2.6-.719.721-1.889.721-2.609 0-.719-.719-.719-1.879 0-2.598.182-.18.387-.316.605-.406V8.835c-.217-.091-.424-.222-.6-.401-.545-.545-.676-1.342-.396-2.009L7.636 3.7.45 10.881c-.6.605-.6 1.584 0 2.189l10.48 10.477c.604.604 1.582.604 2.186 0l10.43-10.43c.605-.603.605-1.582 0-2.187"/></svg>,
  'Python': <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#3776AB"><path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05L0 11.97l.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09-.33.22zM21.1 6.11l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.04zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08-.33.23z"/></svg>,
  'TypeScript': <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#3178C6"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"/></svg>,
  'Vue': <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#4FC08D"><path d="M24,1.61H14.06L12,5.16,9.94,1.61H0L12,22.39ZM12,14.08,5.16,2.23H9.59L12,6.41l2.41-4.18h4.43Z"/></svg>,
  'GraphQL': <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#E10098"><path d="M14.051 2.751l4.935 2.85c.816-.859 2.173-.893 3.032-.077.859.816.893 2.173.077 3.032-.32.336-.739.555-1.19.629l-.001 5.703c.442.078.855.299 1.171.635.845.877.819 2.273-.058 3.118-.877.845-2.273.819-3.118-.058-.347-.36-.575-.817-.64-1.31l-4.936 2.851c.116.336.153.695.101 1.057-.224 1.188-1.354 1.974-2.544 1.75-1.188-.224-1.973-1.354-1.75-2.543.05-.257.144-.497.28-.716l-4.918-2.84c-.825.842-2.177.859-3.02.034-.842-.826-.859-2.178-.033-3.02.32-.327.729-.538 1.169-.607l.001-5.699c-.443-.078-.857-.3-1.173-.637-.845-.877-.819-2.273.058-3.118.877-.845 2.273-.819 3.118.058.35.362.578.823.64 1.322l4.932-2.849c-.115-.334-.153-.691-.101-1.05.224-1.19 1.354-1.975 2.545-1.751 1.188.224 1.973 1.355 1.75 2.545-.05.253-.143.492-.278.708zm-.899 1.843l-4.938 2.85c.154.46.145.957-.026 1.41l4.932 2.847c.762-.758 1.909-.98 2.885-.517V6.13c-.976.466-2.12.244-2.853-.536zm-7.888 4.938l-.001 5.693c.86.12 1.62.605 2.067 1.327l4.932-2.847c-.328-.98-.098-2.069.588-2.832L8.92 7.925c-.724.715-1.763.938-2.656.607zm4.461 6.668l-4.935 2.851c.099.34.109.703.016 1.052 1.032.91 1.294 2.41.585 3.598l4.905 2.832c-.109-.341-.107-.71.012-1.055-.97-1.205-.965-2.924.012-4.127-.123-.34-.122-.705-.006-1.044zM12 13.574c-.814 0-1.474-.66-1.474-1.474 0-.815.66-1.474 1.474-1.474.815 0 1.474.659 1.474 1.474 0 .814-.659 1.474-1.474 1.474z"/></svg>,
  'UI/UX': <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#219B9D"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5z"/></svg>,
};

export default function App() {
  const [data, setData] = useState<PortfolioData>(INITIAL_DATA);
  const [draftData, setDraftData] = useState<PortfolioData>(INITIAL_DATA);
  const [hasChanges, setHasChanges] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTimelineIdx, setActiveTimelineIdx] = useState(0);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showSitemap, setShowSitemap] = useState(false);

  useEffect(() => {
    initAuth();
    const saved = localStorage.getItem('mmk_portfolio_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure we don't keep the example email if it was saved
      if (parsed.email === 'muzamil@example.com') {
        parsed.email = INITIAL_DATA.email;
      }
      const merged = { ...INITIAL_DATA, ...parsed };
      setData(merged);
      setDraftData(merged);
    }
  }, []);

  useEffect(() => {
    if (!data.quotes || data.quotes.length === 0) return;
    const interval = setInterval(() => {
      setQuoteIdx((prev) => (prev + 1) % data.quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [data.quotes?.length]);

  const saveToLocal = (newData: PortfolioData) => {
    setData(newData);
    localStorage.setItem('mmk_portfolio_data', JSON.stringify(newData));
    setHasChanges(false);
  };

  const discardChanges = () => {
    setDraftData(data);
    setHasChanges(false);
  };

  const updateDraft = (newData: PortfolioData) => {
    setDraftData(newData);
    setHasChanges(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogin = async () => {
    if (username.toLowerCase() !== 'muzamil') {
      setLoginError('Invalid username');
      return;
    }
    const ok = await verifyPassword(password);
    if (ok) {
      setIsAdmin(true);
      setShowLogin(false);
      setUsername('');
      setPassword('');
      setLoginError('');
    } else {
      setLoginError('Invalid password');
    }
  };

  const updateField = (field: keyof PortfolioData, value: any) => {
    if (!isAdmin) return;
    updateDraft({ ...draftData, [field]: value });
  };

  const addProject = () => {
    const newProj: Project = {
      id: Date.now().toString(),
      name: 'New Project',
      description: 'Project description',
      tags: ['Tech'],
      url: '#',
      status: 'Planned',
      date: new Date().toISOString().split('T')[0]
    };
    updateDraft({ ...draftData, projects: [newProj, ...draftData.projects] });
  };

  const deleteProject = (id: string) => {
    updateDraft({ ...draftData, projects: draftData.projects.filter(p => p.id !== id) });
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    updateDraft({
      ...draftData,
      projects: draftData.projects.map(p => p.id === id ? { ...p, ...updates } : p)
    });
  };

  const addSkill = () => {
    const name = prompt('Skill name:');
    if (name) {
      updateDraft({ ...draftData, skills: [...(draftData.skills || []), { id: Date.now().toString(), name }] });
    }
  };

  const deleteSkill = (id: string) => {
    updateDraft({ ...draftData, skills: draftData.skills.filter(s => s.id !== id) });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="glass sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="w-10 h-10 bg-primary-container rounded-full flex items-center justify-center font-black text-white text-xl shadow-lg shadow-primary-container/20 overflow-hidden">
                {draftData.logo.startsWith('data:') || draftData.logo.startsWith('http') ? (
                  <img src={draftData.logo} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  draftData.logo
                )}
              </div>
              {isAdmin && (
                <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 cursor-pointer rounded-full transition-opacity">
                  <Edit3 size={14} className="text-white" />
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, (url) => updateField('logo', url))}
                  />
                </label>
              )}
            </div>
            <h1 
              className="text-lg font-black tracking-tighter uppercase hidden sm:block outline-none"
            >
              {draftData.name}
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-8">
              <a href="#projects" className="text-sm font-bold text-secondary border-b-2 border-secondary pb-1">Home</a>
              <a href="#projects" className="text-sm font-medium text-white/50 hover:text-white transition-colors">Work</a>
              <a href="#contact" className="text-sm font-medium text-white/50 hover:text-white transition-colors">Contact Us</a>
            </nav>
            
            <button 
              onClick={() => isAdmin ? setIsAdmin(false) : setShowLogin(true)}
              className="p-2 text-secondary hover:bg-secondary/10 rounded-full transition-all"
            >
              {isAdmin ? <Unlock size={20} /> : <Lock size={20} />}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full space-y-24">
        
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Profile Pic */}
          <div className="lg:col-span-5 relative group">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl relative">
              <img 
                src={draftData.profileImage} 
                alt="Profile" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              {isAdmin && (
                <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                  <div className="p-4 bg-primary-container text-white rounded-full shadow-xl mb-2">
                    <Plus size={24} />
                  </div>
                  <span className="text-white font-bold text-sm uppercase tracking-widest">Change Photo</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, (url) => updateField('profileImage', url))}
                  />
                </label>
              )}
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary-container/10 rounded-full blur-3xl -z-10" />
          </div>

          {/* Project Timeline */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
                Project<br/>Timeline.
              </h2>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => setActiveTimelineIdx(prev => Math.max(0, prev - 1))}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <ChevronUp />
                </button>
                <button 
                  onClick={() => setActiveTimelineIdx(prev => Math.min((draftData.projects?.length || 1) - 1, prev + 1))}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <ChevronDown />
                </button>
              </div>
            </div>

            <div className="relative h-[300px] overflow-hidden flex items-center">
              <div className="absolute left-0 top-0 bottom-0 w-1 timeline-gradient opacity-30" />
              
              <div className="space-y-4 w-full">
                {draftData.projects.map((proj, idx) => {
                  const distance = Math.abs(idx - activeTimelineIdx);
                  const opacity = distance === 0 ? 1 : distance === 1 ? 0.5 : 0.2;
                  const scale = distance === 0 ? 1 : 0.95;
                  const x = distance === 0 ? 20 : 0;

                  return (
                    <motion.div
                      key={proj.id}
                      animate={{ opacity, scale, x }}
                      className="flex items-center gap-6 cursor-pointer"
                      onClick={() => setActiveTimelineIdx(idx)}
                    >
                      <div className={`w-3 h-3 rounded-full ${distance === 0 ? 'bg-primary-container' : 'bg-white/20'}`} />
                      <div className="flex-grow bg-surface-container p-4 rounded-2xl border border-white/5">
                        <div className="flex justify-between items-center">
                          <h3 className="font-bold text-lg">{proj.name}</h3>
                          <span className="text-xs font-mono text-white/40">{proj.date}</span>
                        </div>
                        {distance === 0 && (
                          <motion.p 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="text-sm text-white/50 mt-2 line-clamp-1"
                          >
                            {proj.description}
                          </motion.p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="text-center py-12 border-y border-white/5 relative group">
          <motion.div
            key={quoteIdx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <span className="text-primary-container text-4xl font-serif">"</span>
            <h3 
              className="text-2xl md:text-4xl font-medium italic leading-tight outline-none"
            >
              {draftData.quotes?.[quoteIdx] || draftData.quote}
            </h3>
            <div className="w-12 h-1 bg-primary-container mx-auto" />
          </motion.div>
          {isAdmin && (
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => {
                  const newQuote = prompt('Add new tagline:');
                  if (newQuote) updateField('quotes', [...(draftData.quotes || []), newQuote]);
                }}
                className="p-2 bg-primary-container text-white rounded-lg shadow-lg"
                title="Add Tagline"
              >
                <Plus size={16} />
              </button>
              <button 
                onClick={() => {
                  const currentQuotes = draftData.quotes || [];
                  if (currentQuotes.length <= 1) {
                    alert("You must have at least one tagline.");
                    return;
                  }
                  const newQuotes = [...currentQuotes];
                  newQuotes.splice(quoteIdx, 1);
                  updateField('quotes', newQuotes);
                  setQuoteIdx(0);
                }}
                className="p-2 bg-red-500 text-white rounded-lg shadow-lg"
                title="Delete Current Tagline"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </section>

        {/* Projects Grid */}
        <section id="projects" className="space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black tracking-tight uppercase">Selected Works</h2>
            {isAdmin && (
              <button 
                onClick={addProject}
                className="flex items-center gap-2 px-4 py-2 bg-primary-container text-white rounded-xl font-bold text-sm hover:scale-105 transition-all"
              >
                <Plus size={18} /> Add Project
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {draftData.projects.map((proj) => (
              <motion.div
                key={proj.id}
                layout
                className="bg-surface-container rounded-3xl overflow-hidden border border-white/5 flex flex-col group"
              >
                <div className="aspect-video bg-white/5 relative overflow-hidden">
                  <img 
                    src={proj.image || `https://picsum.photos/seed/${proj.id}/800/450`} 
                    alt={proj.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {isAdmin && (
                    <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                      <div className="p-3 bg-primary-container text-white rounded-full shadow-lg">
                        <Plus size={20} />
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, (url) => updateProject(proj.id, { image: url }))}
                      />
                    </label>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      proj.status === 'Finished' ? 'bg-green-500/20 text-green-400' :
                      proj.status === 'Ongoing' ? 'bg-primary-container/20 text-primary-container' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {proj.status}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {proj.tags.map((tag, tIdx) => (
                      <span 
                        key={tIdx} 
                        className="px-2 py-1 bg-white/5 rounded-md text-[10px] font-bold text-white/40 uppercase tracking-wider flex items-center gap-1"
                      >
                        {tag}
                        {isAdmin && (
                          <button 
                            onClick={() => {
                              const newTags = proj.tags.filter((_, i) => i !== tIdx);
                              updateProject(proj.id, { tags: newTags });
                            }}
                            className="hover:text-red-500"
                          >
                            <X size={10} />
                          </button>
                        )}
                      </span>
                    ))}
                    {isAdmin && (
                      <button 
                        onClick={() => {
                          const tag = prompt('New tag:');
                          if (tag) updateProject(proj.id, { tags: [...(proj.tags || []), tag] });
                        }}
                        className="px-2 py-1 border border-dashed border-white/20 rounded-md text-[10px] font-bold text-white/20 hover:text-white transition-all"
                      >
                        + Tag
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-2 flex-grow">
                    <h3 
                      contentEditable={isAdmin}
                      onBlur={(e) => updateProject(proj.id, { name: e.currentTarget.textContent || '' })}
                      className="text-xl font-bold outline-none"
                    >
                      {proj.name}
                    </h3>
                    <p 
                      contentEditable={isAdmin}
                      onBlur={(e) => updateProject(proj.id, { description: e.currentTarget.textContent || '' })}
                      className="text-sm text-white/40 leading-relaxed outline-none"
                    >
                      {proj.description}
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <a 
                      href={proj.url} 
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-bold transition-all"
                    >
                      View <ExternalLink size={14} />
                    </a>
                    {isAdmin && (
                      <button 
                        onClick={() => deleteProject(proj.id)}
                        className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Core Stack */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-px flex-grow bg-white/10" />
            <h3 className="text-xs font-black tracking-[0.3em] uppercase text-white/30">Core Stack</h3>
            <div className="h-px flex-grow bg-white/10" />
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {draftData.skills.map(skill => (
              <div 
                key={skill.id}
                className="px-6 py-3 bg-surface-container border border-white/5 rounded-2xl flex items-center gap-3 group hover:border-secondary transition-all"
              >
                {TECH_ICONS[skill.name] || <div className="w-2 h-2 rounded-full bg-secondary" />}
                <span className="font-bold text-sm">{skill.name}</span>
                {isAdmin && (
                  <button onClick={() => deleteSkill(skill.id)} className="opacity-0 group-hover:opacity-100 text-red-500 transition-all">
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
            {isAdmin && (
              <button 
                onClick={addSkill}
                className="px-6 py-3 border border-dashed border-white/20 rounded-2xl text-white/30 hover:text-white hover:border-white transition-all flex items-center gap-2"
              >
                <Plus size={18} /> Add Skill
              </button>
            )}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-surface-container rounded-[3rem] p-12 border border-white/5">
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-4xl font-black tracking-tighter uppercase">Let's Connect.</h2>
              <p className="text-white/40">Open for collaborations and new opportunities.</p>
            </div>

            <div className="space-y-4">
              <a href={`https://wa.me/${draftData.whatsapp}`} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all group">
                <div className="w-12 h-12 bg-green-500/20 text-green-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all">
                  <Phone size={24} />
                </div>
                <div>
                  <div className="text-xs text-white/30 font-bold uppercase tracking-widest">WhatsApp</div>
                  <div className="font-bold">+{draftData.whatsapp}</div>
                </div>
              </a>
              <a href={`https://instagram.com/${draftData.instagram}`} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all group">
                <div className="w-12 h-12 bg-pink-500/20 text-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all">
                  <Instagram size={24} />
                </div>
                <div>
                  <div className="text-xs text-white/30 font-bold uppercase tracking-widest">Instagram</div>
                  <div className="font-bold">@{draftData.instagram}</div>
                </div>
              </a>
              <a href={`https://t.me/${draftData.telegram.replace(/\s+/g, '')}`} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all group">
                <div className="w-12 h-12 bg-blue-500/20 text-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all">
                  <Send size={24} />
                </div>
                <div>
                  <div className="text-xs text-white/30 font-bold uppercase tracking-widest">Telegram</div>
                  <div className="font-bold">{draftData.telegram}</div>
                </div>
              </a>
              <a href={`mailto:${draftData.email}`} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all group">
                <div className="w-12 h-12 bg-primary-container/20 text-primary-container rounded-xl flex items-center justify-center group-hover:scale-110 transition-all">
                  <Mail size={24} />
                </div>
                <div>
                  <div className="text-xs text-white/30 font-bold uppercase tracking-widest">Email</div>
                  <div className="font-bold">{draftData.email}</div>
                </div>
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h3 
                contentEditable={isAdmin}
                onBlur={(e) => updateField('name', e.currentTarget.textContent || '')}
                className="text-2xl font-black uppercase outline-none"
              >
                {draftData.name}
              </h3>
              <p 
                contentEditable={isAdmin}
                onBlur={(e) => updateField('role', e.currentTarget.textContent || '')}
                className="text-primary-container font-bold text-sm outline-none"
              >
                {draftData.role}
              </p>
            </div>
            
            <div className="h-px bg-white/10" />
            
            <div className="space-y-4">
              <span className="text-xs font-black tracking-widest uppercase text-white/30">Skills Overview</span>
              <div className="flex flex-wrap gap-2">
                {draftData.skills.map(s => (
                  <span key={s.id} className="px-3 py-1 bg-white/5 rounded-lg text-xs font-medium text-white/60">
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-container rounded-full flex items-center justify-center font-black text-white text-sm">MK</div>
            <span className="text-sm font-bold text-white/40 uppercase tracking-widest">© 2026 Muzamil Kareem</span>
          </div>
          <div className="flex gap-8">
            <button onClick={() => setShowPrivacy(true)} className="text-xs font-bold text-white/30 hover:text-white transition-colors uppercase tracking-widest">Privacy</button>
            <button onClick={() => setShowTerms(true)} className="text-xs font-bold text-white/30 hover:text-white transition-colors uppercase tracking-widest">Terms</button>
            <button onClick={() => setShowSitemap(true)} className="text-xs font-bold text-white/30 hover:text-white transition-colors uppercase tracking-widest">Sitemap</button>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogin(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-surface-container p-8 rounded-[2rem] border border-white/10 shadow-2xl"
            >
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-primary-container/20 text-primary-container rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Lock size={32} />
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tight">Admin Access</h2>
                  <p className="text-white/40 text-sm">Enter password to enable editing mode.</p>
                </div>

                <div className="space-y-4">
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:border-secondary outline-none transition-all"
                  />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    placeholder="Password"
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:border-secondary outline-none transition-all"
                  />
                  {loginError && <p className="text-red-500 text-xs text-center font-bold">{loginError}</p>}
                  <button 
                    onClick={handleLogin}
                    className="w-full py-4 bg-primary-container text-white font-black uppercase tracking-widest rounded-2xl hover:bg-primary-container/80 transition-all"
                  >
                    Login
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Privacy Modal */}
      <AnimatePresence>
        {showPrivacy && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPrivacy(false)} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-2xl bg-surface-container p-10 rounded-[2.5rem] border border-white/10 shadow-2xl max-h-[80vh] overflow-y-auto custom-scrollbar">
              <button onClick={() => setShowPrivacy(false)} className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full transition-colors"><X size={20} /></button>
              <div className="space-y-6">
                <h2 className="text-3xl font-black uppercase tracking-tight">Privacy Policy</h2>
                <div className="space-y-4 text-white/60 text-sm leading-relaxed">
                  <p>Your privacy is important to us. It is Muhamad Muzamil Kareem's policy to respect your privacy regarding any information we may collect from you across our website.</p>
                  <h3 className="text-white font-bold uppercase text-xs tracking-widest pt-4">1. Information We Collect</h3>
                  <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.</p>
                  <h3 className="text-white font-bold uppercase text-xs tracking-widest pt-4">2. Use of Information</h3>
                  <p>We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft.</p>
                  <h3 className="text-white font-bold uppercase text-xs tracking-widest pt-4">3. Third-Party Access</h3>
                  <p>We don’t share any personally identifying information publicly or with third-parties, except when required to by law.</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Terms Modal */}
      <AnimatePresence>
        {showTerms && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowTerms(false)} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-2xl bg-surface-container p-10 rounded-[2.5rem] border border-white/10 shadow-2xl max-h-[80vh] overflow-y-auto custom-scrollbar">
              <button onClick={() => setShowTerms(false)} className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full transition-colors"><X size={20} /></button>
              <div className="space-y-6">
                <h2 className="text-3xl font-black uppercase tracking-tight">Terms of Service</h2>
                <div className="space-y-4 text-white/60 text-sm leading-relaxed">
                  <p>By accessing this website, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
                  <h3 className="text-white font-bold uppercase text-xs tracking-widest pt-4">1. Use License</h3>
                  <p>Permission is granted to temporarily view the materials on Muhamad Muzamil Kareem's website for personal, non-commercial transitory viewing only.</p>
                  <h3 className="text-white font-bold uppercase text-xs tracking-widest pt-4">2. Disclaimer</h3>
                  <p>The materials on this website are provided on an 'as is' basis. Muhamad Muzamil Kareem makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties.</p>
                  <h3 className="text-white font-bold uppercase text-xs tracking-widest pt-4">3. Limitations</h3>
                  <p>In no event shall Muhamad Muzamil Kareem or its suppliers be liable for any damages arising out of the use or inability to use the materials on this website.</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sitemap Modal */}
      <AnimatePresence>
        {showSitemap && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSitemap(false)} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-md bg-surface-container p-10 rounded-[2.5rem] border border-white/10 shadow-2xl">
              <button onClick={() => setShowSitemap(false)} className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full transition-colors"><X size={20} /></button>
              <div className="space-y-8">
                <h2 className="text-3xl font-black uppercase tracking-tight">Sitemap</h2>
                <nav className="flex flex-col gap-4">
                  <a href="#" onClick={() => setShowSitemap(false)} className="text-lg font-bold hover:text-primary-container transition-colors flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-container" /> Home / Hero
                  </a>
                  <a href="#projects" onClick={() => setShowSitemap(false)} className="text-lg font-bold hover:text-primary-container transition-colors flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-container" /> Selected Works
                  </a>
                  <a href="#contact" onClick={() => setShowSitemap(false)} className="text-lg font-bold hover:text-primary-container transition-colors flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-container" /> Contact & Socials
                  </a>
                  <button onClick={() => { setShowSitemap(false); setShowPrivacy(true); }} className="text-lg font-bold hover:text-primary-container transition-colors flex items-center gap-3 text-left">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-container" /> Privacy Policy
                  </button>
                  <button onClick={() => { setShowSitemap(false); setShowTerms(true); }} className="text-lg font-bold hover:text-primary-container transition-colors flex items-center gap-3 text-left">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-container" /> Terms of Service
                  </button>
                </nav>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Controls FAB */}
      {isAdmin && (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4 items-end">
          <AnimatePresence>
            {hasChanges && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="flex flex-col gap-2"
              >
                <button 
                  onClick={() => saveToLocal(draftData)}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:bg-green-700 transition-all"
                >
                  <Save size={18} /> Save Changes
                </button>
                <button 
                  onClick={discardChanges}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:bg-red-700 transition-all"
                >
                  <X size={18} /> Discard
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-secondary text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg flex items-center gap-2"
          >
            <CheckCircle2 size={14} /> Editing Mode Active
          </motion.div>
          <button 
            onClick={() => {
              const newPw = prompt('Enter new password:');
              if (newPw) updatePassword(newPw);
            }}
            className="p-4 bg-surface-container border border-white/10 text-white rounded-2xl shadow-2xl hover:bg-white/5 transition-all"
            title="Change Password"
          >
            <Edit3 size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
