'use client';
import { useState } from 'react';
import styles from './page.module.css';
import Navbar from '@/components/Navbar';

// Mock data with categories, images, and events
const CHARITY_DIRECTORY = [
  { 
    id: '1', 
    name: 'First Tee Foundation', 
    category: 'Youth', 
    desc: 'Impacting the lives of young people by providing educational programs that build character, instill life-enhancing values and promote healthy choices through the game of golf.',
    fullDesc: 'First Tee is a youth development organization that enables kids to build the strength of character that empowers them through a lifetime of new challenges. By seamlessly integrating the game of golf with a life skills curriculum, we create active learning experiences that build inner strength, self-confidence, and resilience that kids can carry to everything they do.',
    image: 'https://loremflickr.com/800/600/golf,course,kids/all',
    event: 'Annual Youth Scramble - May 15, 2024'
  },
  { 
    id: '2', 
    name: 'Make-A-Wish', 
    category: 'Health', 
    desc: 'Creating life-changing wishes for children with critical illnesses.',
    fullDesc: 'A wish can be that spark that helps these children believe that anything is possible and gives them the strength to fight harder against their illnesses. This one belief guides us and inspires us to grant wishes that change the lives of the kids we serve.',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    event: 'Charity Gala Dinner - June 10, 2024'
  },
  { 
    id: '3', 
    name: 'Local Youth Sports', 
    category: 'Community', 
    desc: 'Supporting local youth sports programs and equipment.',
    fullDesc: 'We believe that every child deserves the opportunity to play. We provide funding, equipment, and resources to underserved communities to ensure sports are accessible to all children, regardless of their financial background.',
    image: 'https://loremflickr.com/800/600/soccer,kids,sports/all',
    event: 'Summer Camp Kickoff - July 1, 2024'
  },
  { 
    id: '4', 
    name: 'Ocean Conservancy', 
    category: 'Environment', 
    desc: 'Working to protect the ocean from today\'s greatest global challenges.',
    fullDesc: 'Our vision is a healthy ocean that sustains life on our planet. We focus on science-based solutions that tackle the biggest threats to the ocean, from plastic pollution to climate change, ensuring a sustainable future for marine ecosystems.',
    image: 'https://loremflickr.com/800/600/ocean,cleanup/all',
    event: 'Coastal Cleanup Day - September 20, 2024'
  },
  {
    id: '5',
    name: 'Community Youth Golf Fund',
    category: 'Youth',
    desc: 'Support junior training and equipment access.',
    fullDesc: 'The Community Youth Golf Fund supports junior training programs and provides equipment so that young players from underserved communities can access coaching, gear, and safe practice facilities.',
    image: 'https://loremflickr.com/800/600/golf,children/all',
    event: 'Junior Coaching Week - August 12, 2024',
    contribution: '10%'
  },
  {
    id: '6',
    name: 'Clean Greens Initiative',
    category: 'Environment',
    desc: 'Drive sustainability and green course programs.',
    fullDesc: 'Clean Greens Initiative partners with golf courses to implement sustainable practices — water conservation, native planting, and reduced chemical use — preserving habitats while keeping courses playable.',
    image: 'https://loremflickr.com/800/600/green,course/all',
    event: 'Sustainability Workshop - October 3, 2024',
    contribution: '12%'
  },
  {
    id: '7',
    name: 'Women in Golf Network',
    category: 'Community',
    desc: 'Mentorship and tournaments for women players.',
    fullDesc: 'Women in Golf Network provides mentorship programs, competitive opportunities, and community support to help more women discover and grow in the sport at all levels.',
    image: 'https://loremflickr.com/800/600/women,golf/all',
    event: 'Women\'s Open Charity Tournament - November 21, 2024',
    contribution: '15%'
  },
];

export default function CharitiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [selectedCharity, setSelectedCharity] = useState<typeof CHARITY_DIRECTORY[0] | null>(null);

  // Filter logic
  const filteredCharities = CHARITY_DIRECTORY.filter(charity => {
    const matchesSearch = charity.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          charity.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || charity.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...Array.from(new Set(CHARITY_DIRECTORY.map(c => c.category)))];

  const handleDonate = (name: string) => {
    alert(`Simulating Independent Donation to ${name} via Payment Processor!`);
    if (selectedCharity) setSelectedCharity(null);
  };

  return (
    <>
      <main className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Charity Directory</h1>
          <p className={styles.subtitle}>Discover and support the causes that matter to you.</p>
        </div>

        <div className={styles.controls}>
          <input 
            type="text" 
            placeholder="Search charities..." 
            className={styles.searchBar}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select 
            className={styles.filterSelect}
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className={styles.grid}>
          {filteredCharities.map(charity => (
            <div key={charity.id} className={styles.card}>
              <div className={styles.cardImage} style={{ backgroundImage: `url(${charity.image})` }}></div>
              <div className={styles.cardContent}>
                <span className={styles.categoryTag}>{charity.category}</span>
                <h2 className={styles.cardTitle}>{charity.name}</h2>
                <p className={styles.cardDesc}>{charity.desc}</p>
                {charity.contribution && (
                  <p className={styles.contribution}>Contribution: {charity.contribution}</p>
                )}
                <div className={styles.cardActions}>
                  <button className={styles.primaryBtn} onClick={() => handleDonate(charity.name)}>Donate</button>
                  <button className={styles.secondaryBtn} onClick={() => setSelectedCharity(charity)}>Profile</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCharities.length === 0 && (
          <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--color-text-secondary)' }}>
            No charities found matching your search.
          </p>
        )}
      </main>

      {/* Profile Modal */}
      {selectedCharity && (
        <div className={styles.modalOverlay} onClick={() => setSelectedCharity(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelectedCharity(null)}>×</button>
            <div className={styles.modalImage} style={{ backgroundImage: `url(${selectedCharity.image})` }}></div>
            <div className={styles.modalBody}>
              <span className={styles.categoryTag}>{selectedCharity.category}</span>
              <h2 className={styles.cardTitle} style={{ fontSize: '2rem', marginTop: '0.5rem' }}>{selectedCharity.name}</h2>
              <p className={styles.cardDesc} style={{ fontSize: '1.1rem', color: 'var(--color-text-primary)' }}>{selectedCharity.fullDesc}</p>
              {selectedCharity.contribution && (
                <p style={{ marginTop: '0.75rem', fontWeight: 600 }}>Contribution: {selectedCharity.contribution}</p>
              )}
              
              <div className={styles.eventSection}>
                <h3 className={styles.eventTitle}>Upcoming Event</h3>
                <p>{selectedCharity.event}</p>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                <button className={styles.primaryBtn} onClick={() => handleDonate(selectedCharity.name)}>Make Independent Donation</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
