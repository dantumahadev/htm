import React, { useContext, useMemo } from 'react';
import { AppContext } from '../../contexts/AppContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useLocalization } from '../../hooks/useLocalization';
import type { Product } from '../../types';

const CustomerMarketplacePage: React.FC = () => {
    const { t } = useLocalization();
    const { products, artisans, setSelectedProduct, toggleFavorite, isFavorite, setSelectedPortfolioUser } = useContext(AppContext)!;
    
    const categories = useMemo(() => {
        const uniqueCategories = [...new Set(products.map(p => p.category))];
        // FIX: Reverted to an object literal with computed properties. The previous Map implementation was causing a type error.
        const categoryIcons: Record<string, string> = {
            [t('categories.pottery')]: '🏺',
            [t('categories.textiles')]: '🧵',
            [t('categories.jewelry')]: '💍',
            [t('categories.homeDecor')]: '🛋️',
            [t('categories.paintings')]: '🎨',
            [t('categories.sarees')]: '🥻',
        };
        // FIX: Explicitly type 'cat' as a string to resolve index type error.
        return uniqueCategories.map((cat: string) => ({ name: cat, icon: categoryIcons[cat] || '✨' }));
    }, [products, t]);

    const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
        const favorite = isFavorite(product.id);
        const artisan = artisans.find(a => a.id === product.artisanId);

        const handleArtisanClick = (e: React.MouseEvent) => {
            e.stopPropagation(); // Prevent card's onClick from firing
            if (artisan) {
                setSelectedPortfolioUser(artisan);
            }
        };
        
        return (
            <Card className="p-0 overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col">
                <div className="relative overflow-hidden aspect-square cursor-pointer" onClick={() => setSelectedProduct(product)}>
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <button 
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-slate-800/80 rounded-full backdrop-blur-sm transition-colors hover:bg-white dark:hover:bg-slate-700 z-10"
                >
                    <svg className={`w-6 h-6 ${favorite ? 'text-red-500' : 'text-slate-400'}`} fill={favorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                    </svg>
                </button>
                <div className="p-5 flex-grow flex flex-col">
                    <p className="text-sm font-semibold text-teal-600 dark:text-teal-400">{product.category}</p>
                    <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 mt-1 truncate cursor-pointer" onClick={() => setSelectedProduct(product)}>{product.name}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 cursor-pointer hover:underline" onClick={handleArtisanClick}>by {artisan?.name || 'Unknown Artisan'}</p>
                    <div className="mt-auto pt-3">
                        <p className="text-xl font-bold text-slate-900 dark:text-slate-50">₹{product.price.toLocaleString()}</p>
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <div className="relative h-[60vh] rounded-b-3xl overflow-hidden mb-16">
                <img src="https://images.unsplash.com/photo-1510653303433-a859b7df089e?w=1600&h=800&fit=crop&q=80" alt="Artisan craft" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4">
                    <h1 className="text-5xl md:text-7xl font-bold">{t('customer.marketplace.heroTitle')}</h1>
                    <p className="mt-4 text-lg md:text-xl max-w-2xl">{t('customer.marketplace.heroSubtitle')}</p>
                    <Button className="mt-8 px-10 py-4 text-lg">{t('customer.marketplace.heroButton')}</Button>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Categories Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-center mb-8">{t('customer.marketplace.browseCategories')}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {categories.map(cat => (
                            <div key={cat.name} className="flex flex-col items-center p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer">
                                <span className="text-4xl mb-2">{cat.icon}</span>
                                <span className="font-semibold">{cat.name}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Products Section */}
                <section>
                    <h2 className="text-3xl font-bold text-center mb-8">{t('customer.marketplace.featuredProducts')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                         {products.map(product => <ProductCard key={product.id} product={product} />)}
                    </div>
                </section>
            </div>
            <style>{`.animate-fade-in { animation: fade-in 0.5s ease-out forwards; } @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }`}</style>
        </div>
    );
};

export default CustomerMarketplacePage;