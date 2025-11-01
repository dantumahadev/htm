import React from 'react';
import Card from '../../components/common/Card';
import { useLocalization } from '../../hooks/useLocalization';

const CustomerProfilePage: React.FC = () => {
    const { t } = useLocalization();
    
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
            <h1 className="text-4xl font-bold mb-8">{t('customer.header.profile')}</h1>
            <Card>
                <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold">Profile Page</h2>
                    <p className="text-slate-500 mt-2">This page is under construction.</p>
                </div>
            </Card>
            <style>{`.animate-fade-in { animation: fade-in 0.5s ease-out forwards; } @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }`}</style>
        </div>
    );
};

export default CustomerProfilePage;
