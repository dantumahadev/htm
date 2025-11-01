

import React from 'react';
import Card from '../components/common/Card';
import type { TrainingModule } from '../types';
import { useLocalization } from '../hooks/useLocalization';

const ModuleCard: React.FC<{ module: TrainingModule }> = ({ module }) => (
    <Card className="p-0 overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="relative">
            <img src={module.thumbnail} alt={module.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/30 backdrop-blur-sm rounded-full p-4">
                     <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                </div>
            </div>
            <span className="absolute top-4 right-4 bg-black/50 text-white text-xs font-semibold px-3 py-1 rounded-full">{module.duration}</span>
        </div>
        <div className="p-5">
            <p className="text-sm font-semibold text-teal-600 dark:text-teal-400">{module.category}</p>
            <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 mt-1">{module.title}</h4>
        </div>
    </Card>
);

const TrainingPage: React.FC = () => {
  const { t } = useLocalization();

  const modules: TrainingModule[] = [
    { id: 1, title: t('training.modules.marketing.title'), category: t('training.modules.marketing.category'), thumbnail: 'https://images.unsplash.com/photo-1557862921-37829c7ef0f1?w=400&h=225&fit=crop&q=80', duration: t('training.modules.marketing.duration') },
    { id: 2, title: t('training.modules.photography.title'), category: t('training.modules.photography.category'), thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=225&fit=crop&q=80', duration: t('training.modules.photography.duration') },
    { id: 3, title: t('training.modules.branding.title'), category: t('training.modules.branding.category'), thumbnail: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=400&h=225&fit=crop&q=80', duration: t('training.modules.branding.duration') },
    { id: 4, title: t('training.modules.ecommerce.title'), category: t('training.modules.ecommerce.category'), thumbnail: 'https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?w=400&h=225&fit=crop&q=80', duration: t('training.modules.ecommerce.duration') },
    { id: 5, title: t('training.modules.social.title'), category: t('training.modules.social.category'), thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=225&fit=crop&q=80', duration: t('training.modules.social.duration') },
    { id: 6, title: t('training.modules.shipping.title'), category: t('training.modules.shipping.category'), thumbnail: 'https://images.unsplash.com/photo-1586528116311-06924151d182?w=400&h=225&fit=crop&q=80', duration: t('training.modules.shipping.duration') },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-bold text-slate-800 dark:text-slate-100">{t('training.main.title')}</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{t('training.main.description')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {modules.map(m => <ModuleCard key={m.id} module={m} />)}
      </div>
    </div>
  );
};

export default TrainingPage;