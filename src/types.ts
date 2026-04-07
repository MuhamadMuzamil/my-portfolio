export interface Project {
  id: string;
  name: string;
  description: string;
  tags: string[];
  url: string;
  status: 'Finished' | 'Ongoing' | 'Planned';
  image?: string;
  date?: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface PortfolioData {
  name: string;
  role: string;
  email: string;
  whatsapp: string;
  instagram: string;
  telegram: string;
  quote: string;
  quotes: string[];
  logo: string;
  profileImage: string;
  projects: Project[];
  skills: Skill[];
}
