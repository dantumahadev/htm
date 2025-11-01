import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    const { cart, setActivePage } = useContext(AppContext)!;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <header className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700 p-4 sm:p-6 flex items-center justify-between sticky top-0 z-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">{title}</h1>
            <div className="relative">
                <button 
                    onClick={() => setActivePage('cart')}
                    className="p-3 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    aria-label={`Shopping cart with ${totalItems} items`}
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </button>
                {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-teal-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {totalItems}
                    </span>
                )}
            </div>
        </header>
    );
};

export default Header;
