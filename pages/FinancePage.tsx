import React from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '../components/common/Card';
import Button from '../components/common/Button';
import type { CrowdfundCampaign } from '../types';
import { useLocalization } from '../hooks/useLocalization';

const CrowdfundCard: React.FC<{ campaign: CrowdfundCampaign }> = ({ campaign }) => {
    const { t } = useLocalization();
    const progress = (campaign.raised / campaign.goal) * 100;
    return (
        <Card className="p-0 overflow-hidden group">
            <div className="overflow-hidden">
                <img src={campaign.image} alt={campaign.title} className="rounded-t-2xl w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"/>
            </div>
            <CardContent className="p-6">
                <h4 className="font-bold text-lg mb-2 truncate">{campaign.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 h-10">{campaign.description}</p>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mb-2">
                    <div className="bg-gradient-to-r from-amber-400 to-amber-500 h-3 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="flex justify-between text-sm mt-3">
                    <span className="font-semibold text-slate-800 dark:text-slate-100">₹{campaign.raised.toLocaleString()} {t('finance.raised')}</span>
                    <span className="text-slate-500 dark:text-slate-400">{t('finance.of')} ₹{campaign.goal.toLocaleString()}</span>
                </div>
            </CardContent>
        </Card>
    );
};

const FinancePage: React.FC = () => {
    const { t } = useLocalization();
    
    const campaigns: CrowdfundCampaign[] = [
      {
        id: 1,
        title: t('finance.campaign1.title'),
        goal: 150000,
        raised: 95000,
        image: 'https://images.unsplash.com/photo-1554968393-559d80d23588?w=400&h=200&fit=crop&q=80',
        description: t('finance.campaign1.description')
      },
      {
        id: 2,
        title: t('finance.campaign2.title'),
        goal: 60000,
        raised: 45000,
        image: 'https://images.unsplash.com/photo-1604176422312-05a818e6c708?w=400&h=200&fit=crop&q=80',
        description: t('finance.campaign2.description')
      },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-4xl font-bold text-slate-800 dark:text-slate-100">{t('finance.main.title')}</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">{t('finance.main.description')}</p>
            </div>
            
            <div>
                 <div className="flex justify-between items-center mb-6">
                    <p className="text-slate-600 dark:text-slate-300 max-w-lg">{t('finance.createCampaignDescription')}</p>
                    <Button>{t('finance.createCampaign')}</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {campaigns.map(c => <CrowdfundCard key={c.id} campaign={c} />)}
                </div>
            </div>
        </div>
    );
};

export default FinancePage;