import React, { useState, useContext, useEffect } from 'react';
import Card, { CardContent, CardHeader, CardTitle } from '../components/common/Card';
import Button from '../components/common/Button';
import type { Volunteer, Project, Artisan, ProjectApplication, Collaboration } from '../types';
import { generateCertificateText } from '../services/geminiService';
import { useLocalization } from '../hooks/useLocalization';
import { AppContext } from '../contexts/AppContext';
import { addDoc, collection, doc, query, where, onSnapshot, writeBatch, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// #region Volunteer View Components (Unchanged)
const VolunteerHero: React.FC = () => {
    const { t } = useLocalization();
    return (
        <div className="relative rounded-3xl overflow-hidden p-12 md:p-20 text-center bg-cover bg-center animate-fadeInUp" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1516585994279-d7547cb02cf0?w=1200&h=400&fit=crop&q=80)' }}>
            <div className="absolute inset-0 bg-teal-800/70"></div>
            <div className="relative z-10">
                <h2 className="text-5xl font-bold text-white">{t('volunteer.hero.title')}</h2>
                <p className="text-xl text-teal-100 mt-4 max-w-3xl mx-auto">{t('volunteer.hero.subtitle')}</p>
            </div>
        </div>
    );
};

const ImpactSection: React.FC = () => {
    const { t } = useLocalization();
    
    const ImpactCard: React.FC<{ value: string, label: string, icon: React.ReactNode }> = ({ value, label, icon }) => (
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl">
            <div className="text-teal-500 mb-3">{icon}</div>
            <p className="text-4xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
            <p className="text-slate-500 dark:text-slate-400 font-semibold">{label}</p>
        </div>
    );
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('volunteer.impact.title')}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <ImpactCard 
                    value="3" 
                    label={t('volunteer.impact.artisansSupported')}
                    icon={<svg className="w-10 h-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2 1m0 0l-2-1m2 1V2M4 7l2 1M4 7l2-1M4 7v2.5M12 21l-2-1m0 0l-2 1m2-1v-2.5M6 18l-2-1m2 1l-2 1m2-1V14m6 4l2 1m-2-1l2-1m-2 1v-2.5" /></svg>} 
                />
                <ImpactCard 
                    value="2" 
                    label={t('volunteer.impact.projectsCompleted')}
                    icon={<svg className="w-10 h-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                <ImpactCard 
                    value="23+" 
                    label={t('volunteer.impact.hoursContributed')}
                    icon={<svg className="w-10 h-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
            </CardContent>
        </Card>
    );
};
// #endregion

const VolunteerPage: React.FC = () => {
    const { t, language } = useLocalization();
    const { currentUser, projects, volunteers, artisans: allArtisans, setSelectedPortfolioUser } = useContext(AppContext)!;
    
    // Shared State & Modals
    const [isCertModalOpen, setIsCertModalOpen] = useState(false);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [certData, setCertData] = useState<string | null>(null);
    const [certError, setCertError] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedCollaboration, setSelectedCollaboration] = useState<{ volunteerName: string } | null>(null);
    const [newProjectData, setNewProjectData] = useState({ title: '', description: '', skills: ''});
    const [showConfirmation, setShowConfirmation] = useState<string | null>(null);

    // State specific to volunteer view
    const [activeTab, setActiveTab] = useState('projects');
    const [applyProject, setApplyProject] = useState<Project | null>(null);

    // State specific to artisan view (now fetched from Firestore)
    const [pendingApplications, setPendingApplications] = useState<ProjectApplication[]>([]);
    const [currentCollaborations, setCurrentCollaborations] = useState<Collaboration[]>([]);
    const [feedbackModal, setFeedbackModal] = useState<{ isOpen: boolean; collaboration: Collaboration | null }>({ isOpen: false, collaboration: null });
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        if (currentUser?.role !== 'artisan') return;

        // Listener for pending applications for this artisan
        const appsQuery = query(
            collection(db, 'projectApplications'),
            where('artisanId', '==', currentUser.id),
            where('status', '==', 'pending')
        );
        const unsubscribeApps = onSnapshot(appsQuery, (snapshot) => {
            const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProjectApplication));
            setPendingApplications(apps);
        });

        // Listener for current collaborations for this artisan
        const collabsQuery = query(
            collection(db, 'collaborations'),
            where('artisanId', '==', currentUser.id),
            where('status', '==', 'in-progress')
        );
        const unsubscribeCollabs = onSnapshot(collabsQuery, (snapshot) => {
            const collabs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Collaboration));
            setCurrentCollaborations(collabs);
        });

        return () => {
            unsubscribeApps();
            unsubscribeCollabs();
        };
    }, [currentUser]);


    const handleGenerateCertificate = async (collaboration: Collaboration) => {
        const volunteer = volunteers.find(v => v.id === collaboration.volunteerId);
        const project = projects.find(p => p.id === collaboration.projectId);
        const durationDays = Math.floor((new Date().getTime() - new Date(collaboration.startDate).getTime()) / (1000 * 3600 * 24));
        const hours = durationDays * 2; // Estimate hours based on days, assuming 2 hours/day

        if (!volunteer || !project) {
            setCertError("Could not find volunteer or project details.");
            return;
        }

        setIsCertModalOpen(true);
        setIsGenerating(true);
        setSelectedCollaboration({ volunteerName: volunteer.name });
        setCertData(null);
        setCertError(null);
        try {
            const certificate = await generateCertificateText(
                currentUser!.name,
                volunteer.name,
                project.title,
                hours,
                project.skillsNeeded,
                language
            );
            setCertData(certificate);
        } catch (error: any) {
            setCertError(error.message || 'An unexpected error occurred.');
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleDownloadCertificate = (certificateText: string, volunteerName: string) => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`<html>...</html>`); // Abridged for brevity
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => printWindow.print(), 500);
        }
    };
    
    const handleNewProjectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewProjectData({ ...newProjectData, [e.target.name]: e.target.value });
    };

    const handlePostProject = async () => {
        if (currentUser && newProjectData.title && newProjectData.description && newProjectData.skills) {
            const newProject = {
                title: newProjectData.title,
                description: newProjectData.description,
                skillsNeeded: newProjectData.skills.split(',').map(s => s.trim()).filter(Boolean),
                postedBy: currentUser.name,
                status: 'Open' as 'Open',
            };
            try {
                await addDoc(collection(db, 'projects'), newProject);
                setIsProjectModalOpen(false);
                setNewProjectData({ title: '', description: '', skills: '' });
                setShowConfirmation(t('volunteer.confirmations.projectPosted'));
                setTimeout(() => setShowConfirmation(null), 3000);
            } catch (error) {
                console.error("Error posting project: ", error);
                alert("Failed to post project.");
            }
        }
    };

    const confirmApply = async (project: Project) => {
        if (!currentUser) return;
        const artisanOwner = allArtisans.find(a => a.name === project.postedBy);
        if (!artisanOwner) {
            alert("Could not find project owner.");
            return;
        }
        const application = {
            projectId: project.id,
            volunteerId: currentUser.id,
            artisanId: artisanOwner.id,
            status: 'pending',
            applicationDate: new Date().toISOString(),
        };
        try {
            await addDoc(collection(db, 'projectApplications'), application);
            setShowConfirmation(t('volunteer.confirmations.applied', { title: project.title }));
            setApplyProject(null);
            setTimeout(() => setShowConfirmation(null), 3000);
        } catch (error) {
            console.error("Error submitting application: ", error);
            alert("Failed to submit application.");
        }
    };

    const handleAcceptRequest = async (application: ProjectApplication) => {
        const volunteer = volunteers.find(v => v.id === application.volunteerId);
        if (!volunteer) return;
        try {
            const batch = writeBatch(db);
            const appRef = doc(db, 'projectApplications', application.id);
            batch.update(appRef, { status: 'accepted' });
            const projectRef = doc(db, 'projects', application.projectId);
            batch.update(projectRef, { status: 'In Progress' });
            const newCollaboration = {
                projectId: application.projectId,
                volunteerId: application.volunteerId,
                artisanId: application.artisanId,
                startDate: new Date().toISOString(),
                status: 'in-progress',
            };
            const collabRef = doc(collection(db, 'collaborations'));
            batch.set(collabRef, newCollaboration);
            await batch.commit();
            setShowConfirmation(t('volunteer.confirmations.requestAccepted', { name: volunteer.name }));
            setTimeout(() => setShowConfirmation(null), 3000);
        } catch (error) {
            console.error("Error accepting request: ", error);
            alert("Failed to accept request.");
        }
    };

    const handleDeclineRequest = async (application: ProjectApplication) => {
        const volunteer = volunteers.find(v => v.id === application.volunteerId);
        try {
            const appRef = doc(db, 'projectApplications', application.id);
            await updateDoc(appRef, { status: 'declined' });
            setShowConfirmation(t('volunteer.confirmations.requestDeclined', { name: volunteer?.name || '' }));
            setTimeout(() => setShowConfirmation(null), 3000);
        } catch (error) {
            console.error("Error declining request: ", error);
            alert("Failed to decline request.");
        }
    };
    
    const handleRatingChange = async (collab: Collaboration, newRating: number) => {
        try {
            const collabRef = doc(db, 'collaborations', collab.id);
            await updateDoc(collabRef, { rating: newRating });
        } catch (error) {
            console.error("Error updating rating:", error);
        }
    };

    const handleOpenFeedbackModal = (collab: Collaboration) => {
        setFeedbackModal({ isOpen: true, collaboration: collab });
    };
    
    const handleFeedbackSubmit = async () => {
        if (!feedbackModal.collaboration) return;
        try {
            const batch = writeBatch(db);
            const collabRef = doc(db, 'collaborations', feedbackModal.collaboration.id);
            batch.update(collabRef, {
                status: 'completed',
                feedback: feedback,
                endDate: new Date().toISOString(),
                rating: feedbackModal.collaboration.rating
            });
            const projectRef = doc(db, 'projects', feedbackModal.collaboration.projectId);
            batch.update(projectRef, { status: 'Completed' });
            await batch.commit();
            setFeedbackModal({ isOpen: false, collaboration: null });
            setFeedback('');
            setShowConfirmation(t('volunteer.confirmations.feedbackSubmitted'));
            setTimeout(() => setShowConfirmation(null), 3000);
        } catch (error) {
            console.error("Error submitting feedback:", error);
            alert("Failed to submit feedback.");
        }
    };

    const StarRating: React.FC<{ rating: number; setRating: (collab: any, rating: number) => void; collaboration: any }> = ({ rating, setRating, collaboration }) => (
        <div className="flex items-center justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(collaboration, star)} className="text-2xl transition-transform duration-200 hover:scale-125 focus:outline-none">
                    <span className={star <= rating ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}>{star <= rating ? '★' : '☆'}</span>
                </button>
            ))}
        </div>
    );
    
    const VolunteerCard: React.FC<{ volunteer: Volunteer }> = ({ volunteer }) => (
        <Card onClick={() => setSelectedPortfolioUser(volunteer)} className="cursor-pointer flex flex-col text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-t-4 border-amber-400">
            <CardContent className="flex flex-col items-center flex-grow p-8">
                <img src={volunteer.avatar} alt={volunteer.name} className="w-28 h-28 rounded-full mx-auto mb-4 ring-4 ring-offset-4 ring-amber-500" />
                <h4 className="font-bold text-xl text-slate-800 dark:text-slate-100">{volunteer.name}</h4>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">{volunteer.projectsCompleted} {t('volunteer.projectCompletedPlural', { count: volunteer.projectsCompleted })}</p>
                <div className="flex flex-wrap justify-center gap-2 my-4">
                    {volunteer.skills.slice(0, 2).map(skill => (<span key={skill} className="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full">{skill}</span>))}
                    {volunteer.skills.length > 2 && <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full">+{volunteer.skills.length - 2} more</span>}
                </div>
            </CardContent>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl mt-auto">
                <p className="font-semibold text-teal-700 dark:text-teal-400">{t('dashboard.viewProfile')}</p>
            </div>
        </Card>
    );
    
    const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
        const artisan = allArtisans.find(a => a.name === project.postedBy);
        return (
            <Card className="transition-all duration-300 hover:shadow-xl flex flex-col">
                <CardContent className="flex-grow">
                    <div className="flex justify-between items-start">
                         <div>
                            <h4 className="font-bold text-lg mb-2">{project.title}</h4>
                            <div className="flex items-center text-xs text-slate-500 mb-2">
                                <img src={artisan?.avatar} className="w-5 h-5 rounded-full mr-2"/>
                                <span>{t('volunteer.postedBy')} {project.postedBy}</span>
                            </div>
                        </div>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${project.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-slate-200 text-slate-800'}`}>{t(`volunteer.status${project.status.replace(' ', '')}`)}</span>
                    </div>
                    <p className="text-sm text-slate-600 mb-4">{project.description}</p>
                    <div>
                        <p className="text-xs font-semibold mb-2">{t('volunteer.skillsNeeded')}</p>
                        <div className="flex flex-wrap gap-2">
                            {project.skillsNeeded.map(skill => (<span key={skill} className="bg-teal-100 text-teal-800 text-xs font-semibold px-3 py-1 rounded-full">{skill}</span>))}
                        </div>
                    </div>
                </CardContent>
                {currentUser?.role === 'volunteer' && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl mt-auto">
                    <Button variant="primary" className="w-full" onClick={() => setApplyProject(project)}>{t('volunteer.applyNow')}</Button>
                  </div>
                )}
            </Card>
        );
    };

    if (currentUser?.role === 'artisan') {
        return (
             <div className="space-y-8">
                <div>
                    <h2 className="text-4xl font-bold text-slate-800 dark:text-slate-100">{t('volunteer.artisan.title')}</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">{t('volunteer.artisan.description')}</p>
                </div>
                
                {/* Actions */}
                 <Card>
                    <CardHeader><CardTitle>{t('volunteer.artisan.actions.title')}</CardTitle></CardHeader>
                    <CardContent className="flex flex-col sm:flex-row gap-4">
                        <Button onClick={() => setIsProjectModalOpen(true)} className="flex-1">{t('volunteer.artisan.actions.postProject')}</Button>
                        <Button variant="secondary" className="flex-1" onClick={() => document.getElementById('find-volunteers')?.scrollIntoView({ behavior: 'smooth' })}>{t('volunteer.artisan.actions.findVolunteers')}</Button>
                    </CardContent>
                 </Card>

                {/* Pending Requests */}
                 <Card>
                    <CardHeader><CardTitle>{t('volunteer.artisan.pending.title')} ({pendingApplications.length})</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        {pendingApplications.length > 0 ? pendingApplications.map(req => {
                            const volunteer = volunteers.find(v => v.id === req.volunteerId);
                            const project = projects.find(p => p.id === req.projectId);
                            if (!volunteer || !project) return null;
                            return (
                                <div key={req.id} className="flex flex-col sm:flex-row items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl gap-4">
                                    <img src={volunteer.avatar} alt={volunteer.name} className="w-12 h-12 rounded-full cursor-pointer" onClick={() => setSelectedPortfolioUser(volunteer)} />
                                    <div className="flex-1 text-center sm:text-left">
                                        <p><span className="font-bold cursor-pointer hover:underline" onClick={() => setSelectedPortfolioUser(volunteer)}>{volunteer.name}</span> applied for <span className="font-semibold text-teal-600">{project.title}</span></p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="primary" onClick={() => handleAcceptRequest(req)}>{t('volunteer.artisan.pending.accept')}</Button>
                                        <Button variant="secondary" onClick={() => handleDeclineRequest(req)}>{t('volunteer.artisan.pending.decline')}</Button>
                                    </div>
                                </div>
                            );
                        }) : <p className="text-slate-500 text-center py-4">{t('volunteer.artisan.pending.empty')}</p>}
                    </CardContent>
                 </Card>

                {/* Current Collaborations */}
                 <Card>
                    <CardHeader><CardTitle>{t('volunteer.artisan.current.title')}</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                       {currentCollaborations.length > 0 ? currentCollaborations.map(collab => {
                            const volunteer = volunteers.find(v => v.id === collab.volunteerId);
                            const project = projects.find(p => p.id === collab.projectId);
                            const days = Math.floor((new Date().getTime() - new Date(collab.startDate).getTime()) / (1000 * 3600 * 24));
                            if (!volunteer || !project) return null;
                            return (
                                <Card key={collab.id} className="p-4 grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => setSelectedPortfolioUser(volunteer)}>
                                        <img src={volunteer.avatar} alt={volunteer.name} className="w-16 h-16 rounded-full" />
                                        <div>
                                            <p className="font-bold">{volunteer.name}</p>
                                            <p className="text-sm text-slate-500">{t('volunteer.artisan.current.daysCompleted', { days })}</p>
                                        </div>
                                    </div>
                                    <div className="md:col-span-1 text-center"><StarRating rating={collab.rating || 0} setRating={handleRatingChange} collaboration={collab}/></div>
                                    <div className="md:col-span-2 flex flex-col sm:flex-row gap-2">
                                        <Button variant="primary" className="flex-1" onClick={() => handleGenerateCertificate(collab)}>{t('volunteer.artisan.current.issueCertificate')}</Button>
                                        <Button variant="secondary" className="flex-1" onClick={() => handleOpenFeedbackModal(collab)}>{t('volunteer.artisan.current.endCollaboration')}</Button>
                                    </div>
                                </Card>
                            );
                       }) : <p className="text-slate-500 text-center py-4">{t('volunteer.artisan.current.empty')}</p>}
                    </CardContent>
                 </Card>
                 
                {/* Find Volunteers */}
                <Card id="find-volunteers">
                    <CardHeader>
                        <CardTitle>{t('volunteer.artisan.find.title')}</CardTitle>
                        <p className="text-sm text-slate-500 mt-1">{t('volunteer.artisan.find.description')}</p>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {volunteers.map(v => <VolunteerCard key={v.id} volunteer={v} />)}
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Default view for Volunteers
    return (
        <div className="space-y-8">
            <VolunteerHero />
            <ImpactSection />
            <div>
                <div className="border-b border-slate-200 dark:border-slate-700">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {[{id: 'projects', label: t('volunteer.tabs.projects')}, {id: 'findArtisans', label: t('volunteer.tabs.findArtisans')}].map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-semibold text-base ${activeTab === tab.id ? 'border-teal-500 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="mt-8">
                    {activeTab === 'projects' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {projects.filter(p => p.status === 'Open').map(p => <ProjectCard key={p.id} project={p} />)}
                        </div>
                    )}
                    {activeTab === 'findArtisans' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {allArtisans.map(a => (
                                <Card key={a.id} onClick={() => setSelectedPortfolioUser(a)} className="cursor-pointer text-center hover:-translate-y-1 transition-transform">
                                    <img src={a.avatar} className="w-24 h-24 rounded-full mx-auto my-4"/>
                                    <h4 className="font-bold">{a.name}</h4><p className="text-sm text-slate-500">{a.location}</p>
                                    <p className="text-sm text-slate-600 p-4">{a.bio}</p>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Shared Modals & Confirmations */}
            {showConfirmation && <div className="fixed bottom-5 right-5 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-fadeInUp">{showConfirmation}</div>}
            
            {isCertModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <Card className="w-full max-w-2xl">
                        <CardHeader><CardTitle>{t('volunteer.generateCertificate')}</CardTitle></CardHeader>
                        <CardContent>
                            {isGenerating && <p>{t('volunteer.generating')}</p>}
                            {certError && <p className="text-red-500">{certError}</p>}
                            {certData && <pre className="whitespace-pre-wrap font-sans bg-slate-50 p-4 rounded-lg">{certData}</pre>}
                            <div className="flex justify-end gap-3 mt-4">
                                <Button variant="secondary" onClick={() => setIsCertModalOpen(false)}>{t('common.close')}</Button>
                                {certData && <Button onClick={() => handleDownloadCertificate(certData, selectedCollaboration!.volunteerName)}>{t('common.downloadPdf')}</Button>}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {isProjectModalOpen && (
                 <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <Card className="w-full max-w-lg">
                        <CardHeader><CardTitle>{t('volunteer.modal.title')}</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <input type="text" name="title" value={newProjectData.title} onChange={handleNewProjectChange} placeholder={t('volunteer.modal.projectTitlePlaceholder')} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"/>
                            <textarea name="description" value={newProjectData.description} onChange={handleNewProjectChange} placeholder={t('volunteer.modal.projectDescriptionPlaceholder')} className="w-full p-2 border rounded h-24 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"/>
                            <input type="text" name="skills" value={newProjectData.skills} onChange={handleNewProjectChange} placeholder={t('volunteer.modal.skillsNeededPlaceholder')} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"/>
                            <div className="flex justify-end gap-3"><Button variant="secondary" onClick={() => setIsProjectModalOpen(false)}>{t('common.cancel')}</Button><Button onClick={handlePostProject}>{t('volunteer.modal.postProject')}</Button></div>
                        </CardContent>
                    </Card>
                </div>
            )}
            
            {feedbackModal.isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <Card className="w-full max-w-lg">
                        <CardHeader>
                            <CardTitle>{t('volunteer.artisan.feedbackModal.title', { name: volunteers.find(v => v.id === feedbackModal.collaboration?.volunteerId)?.name || '' })}</CardTitle>
                            <p className="text-sm text-slate-500 mt-1">{t('volunteer.artisan.feedbackModal.description')}</p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder={t('volunteer.artisan.feedbackModal.placeholder')} className="w-full p-2 border rounded h-24 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"/>
                             <div className="flex justify-end gap-3">
                                 <Button variant="secondary" onClick={() => setFeedbackModal({isOpen: false, collaboration: null})}>{t('common.cancel')}</Button>
                                 <Button onClick={handleFeedbackSubmit} disabled={!feedback}>{t('volunteer.artisan.feedbackModal.submit')}</Button>
                             </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {applyProject && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <Card className="w-full max-w-md text-center">
                        <CardHeader><CardTitle>{t('volunteer.confirmations.applyTitle')}</CardTitle></CardHeader>
                        <CardContent>
                            <p>{t('volunteer.confirmations.applyMessage', { title: applyProject.title })}</p>
                            <div className="flex justify-center gap-4 mt-6">
                                <Button variant="secondary" onClick={() => setApplyProject(null)}>{t('common.cancel')}</Button>
                                <Button onClick={() => confirmApply(applyProject)}>{t('volunteer.applyNow')}</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default VolunteerPage;