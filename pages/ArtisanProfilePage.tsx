import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import type { Artisan, Product } from '../types';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { useLocalization } from '../hooks/useLocalization';

interface Props {
    artisan: Artisan;
}

const ArtisanProfilePage: React.FC<Props> = ({ artisan }) => {
    const { t } = useLocalization();
    const { products, setSelectedProduct, setSelectedPortfolioUser, startChat, setActivePage } = useContext(AppContext)!;

    const artisanProducts = products.filter(p => p.artisanId === artisan.id);
    
    const handleConnect = () => {
        startChat(artisan.id);
        setActivePage('chat');
    };

    return (
        <div className="animate-fadeInUp">
            <Button variant="secondary" onClick={() => setSelectedPortfolioUser(null)} className="mb-6">
                &larr; {t('profile.back')}
            </Button>

            {/* Hero Section */}
            <div className="relative h-72 rounded-3xl overflow-hidden mb-[-8rem]">
                <img src={artisanProducts[0]?.image || 'https://picsum.photos/seed/artisan-hero/1200/400'} alt={`${artisan.name}'s work`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>

            {/* Header Card */}
            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
                <Card className="p-8 flex flex-col sm:flex-row items-center gap-8">
                    <img src={artisan.avatar} alt={artisan.name} className="w-40 h-40 rounded-full ring-8 ring-white dark:ring-slate-800 -mt-28 sm:-mt-24 flex-shrink-0" />
                    <div className="flex-1 text-center sm:text-left">
                        <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100">{artisan.name}</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-semibold mt-1">{artisan.location}</p>
                    </div>
                    <Button onClick={handleConnect} className="w-full sm:w-auto px-8">{t('profile.connect')}</Button>
                </Card>
            </div>
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
                {/* About and Story Section */}
                <Card>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
                        <div className="md:col-span-1">
                            <h2 className="text-2xl font-bold mb-4">{t('profile.artisan.about')}</h2>
                            <p className="text-slate-600 dark:text-slate-300 italic">{artisan.bio}</p>
                        </div>
                        <div className="md:col-span-2">
                             <h2 className="text-2xl font-bold mb-4">{t('profile.artisan.story')}</h2>
                            <p className="text-slate-600 dark:text-slate-300 whitespace-pre-line">{artisan.story}</p>
                        </div>
                    </div>
                </Card>

                {/* Story Video Section */}
                <Card>
                    <div className="p-8">
                        <h2 className="text-2xl font-bold text-center mb-6">{t('profile.artisan.storyVideo')}</h2>
                        <div className="aspect-video bg-slate-200 dark:bg-slate-700 rounded-2xl overflow-hidden shadow-lg">
                           <video controls src={artisan.storyVideoUrl} className="w-full h-full" poster={artisanProducts[1]?.image || ''} />
                        </div>
                    </div>
                </Card>

                {/* Gallery Section */}
                 <Card>
                    <div className="p-8">
                        <h2 className="text-2xl font-bold text-center mb-6">{t('profile.artisan.gallery')}</h2>
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {artisanProducts.map(product => (
                               <div key={product.id} className="group relative rounded-xl overflow-hidden cursor-pointer" onClick={() => alert("Product detail view from profile is not implemented.")}>
                                   <img src={product.image} alt={product.name} className="w-full h-full object-cover aspect-square group-hover:scale-105 transition-transform duration-300" />
                                   <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                                       <h3 className="text-white font-bold text-lg">{product.name}</h3>
                                   </div>
                               </div>
                            ))}
                         </div>
                    </div>
                </Card>
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeInUp {
                    animation: fadeInUp 0.6s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default ArtisanProfilePage;