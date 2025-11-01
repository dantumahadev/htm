import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';
import CustomerHeader from '../components/customer/CustomerHeader';
import CustomerMarketplacePage from './customer/CustomerMarketplacePage';
import CustomerProductDetailPage from './customer/CustomerProductDetailPage';
import CustomerCartPage from './customer/CustomerCartPage';
import CustomerFavoritesPage from './customer/CustomerFavoritesPage';
import CustomerProfilePage from './customer/CustomerProfilePage';
import CustomerCheckoutPage from './customer/CustomerCheckoutPage';
import ChatPage from './ChatPage';
import CustomerArtisanProfilePage from './customer/CustomerArtisanProfilePage';
import type { Artisan } from '../types';

const CustomerApp: React.FC = () => {
    const { activePage, selectedProduct, artisans, selectedPortfolioUser, firestoreError } = useContext(AppContext)!;
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        if (firestoreError) {
            setShowError(true);
        }
    }, [firestoreError]);

    const renderContent = () => {
        // Artisan Profile view has top priority for customers
        if (selectedPortfolioUser && selectedPortfolioUser.role === 'artisan') {
            return <CustomerArtisanProfilePage artisan={selectedPortfolioUser as Artisan} />;
        }

        // The product detail page is a special case that overrides the activePage
        if (selectedProduct) {
            const artisan = artisans.find(a => a.id === selectedProduct.artisanId);
            return <CustomerProductDetailPage product={selectedProduct} artisan={artisan} />;
        }
        
        switch (activePage) {
            case 'customer-cart':
                return <CustomerCartPage />;
            case 'customer-favorites':
                return <CustomerFavoritesPage />;
            case 'customer-profile':
                return <CustomerProfilePage />;
            case 'customer-checkout':
                return <CustomerCheckoutPage />;
            case 'customer-chat':
                return <ChatPage />;
            // The default is the marketplace
            case 'customer-marketplace':
            default:
                return <CustomerMarketplacePage />;
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-900 min-h-screen text-slate-800 dark:text-slate-200">
            <CustomerHeader />
            {showError && (
                <div className="bg-amber-500 text-white text-sm flex items-center justify-between p-3 sticky top-20 z-30 shadow-md">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                        <span>{firestoreError}</span>
                    </div>
                    <button onClick={() => setShowError(false)} className="p-1 rounded-full hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-white" aria-label="Dismiss">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </button>
                </div>
            )}
            <main>
                {renderContent()}
            </main>
        </div>
    );
};

export default CustomerApp;