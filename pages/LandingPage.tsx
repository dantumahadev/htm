

import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../contexts/AppContext';
import { LogoIcon } from '../components/common/Icons';
import Button from '../components/common/Button';

const Feature: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; delay: number }> = ({ icon, title, children, delay }) => (
    <div className="text-center p-6 scroll-animate" style={{ transitionDelay: `${delay}ms` }}>
        <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-50 to-yellow-50 dark:from-teal-900/30 dark:to-amber-900/30 text-teal-700 dark:text-teal-300">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-100">{title}</h3>
        <p className="text-slate-700 dark:text-slate-400">{children}</p>
    </div>
);

const Step: React.FC<{ number: string; title: string; children: React.ReactNode; delay: number }> = ({ number, title, children, delay }) => (
    <div className="flex scroll-animate" style={{ transitionDelay: `${delay}ms` }}>
        <div className="flex flex-col items-center mr-6">
            <div>
                <div className="flex items-center justify-center w-12 h-12 border-2 border-teal-500 text-teal-500 rounded-full font-bold text-lg">
                    {number}
                </div>
            </div>
            <div className="w-px h-full bg-slate-300 dark:bg-slate-600" />
        </div>
        <div className="pb-10">
            <h4 className="mb-2 text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h4>
            <p className="text-slate-600 dark:text-slate-400">{children}</p>
        </div>
    </div>
);

const LastStep: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; delay: number }> = ({ icon, title, children, delay }) => (
     <div className="flex scroll-animate" style={{ transitionDelay: `${delay}ms` }}>
        <div className="flex flex-col items-center mr-6">
            <div>
                <div className="flex items-center justify-center w-12 h-12 border-2 border-amber-500 text-amber-500 rounded-full font-bold text-lg">
                    {icon}
                </div>
            </div>
        </div>
        <div className="pb-10">
            <h4 className="mb-2 text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h4>
            <p className="text-slate-600 dark:text-slate-400">{children}</p>
        </div>
    </div>
);


// USER INSTRUCTION:
// The placeholder images below make the slideshow work immediately.
// To use your own images:
// 1. Create a folder named 'images' at the top level of your project.
// 2. Place your three slideshow images inside this 'images' folder.
// 3. Name them exactly: 'slide1.jpg', 'slide2.jpg', 'slide3.jpg'.
// 4. To use them, change the line `const slideshowImages = placeholderImages;`
//    to `const slideshowImages = localImages;`
const placeholderImages = [
    'https://images.unsplash.com/photo-1541748243603-f06b6a482b6e?w=1600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1599335822394-b0c61b6e4b8a?w=1600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&h=900&fit=crop&q=80',
];

const localImages = [
    '/images/slide1.jpg',
    '/images/slide2.jpg',
    '/images/slide3.jpg'
];

// Switch this line to use your local images when they are ready.
const slideshowImages = localImages;


const LandingPage: React.FC = () => {
    const { setAuthPage, bypassLogin } = useContext(AppContext)!;
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % slideshowImages.length);
        }, 5000); // Change image every 5 seconds
    
        return () => clearTimeout(timer);
    }, [currentImageIndex]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                rootMargin: '0px',
                threshold: 0.1,
            }
        );
    
        const elementsToAnimate = document.querySelectorAll('.scroll-animate');
        elementsToAnimate.forEach((el) => observer.observe(el));
    
        return () => observer.disconnect();
    }, []);
    
    return (
        <div className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-sm">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <LogoIcon />
                        <span className="text-2xl font-bold text-teal-600">Artisan Ally</span>
                    </div>
                    <div className="space-x-2 hidden sm:flex items-center">
                        <Button variant="ghost" onClick={bypassLogin}>Enter as Guest</Button>
                        <Button variant="ghost" onClick={() => setAuthPage('login')}>Log In</Button>
                        <Button onClick={() => setAuthPage('signup')}>Get Started</Button>
                    </div>
                </div>
            </header>
            
            {/* Mobile Guest Button */}
            <div className="sm:hidden fixed top-4 right-4 z-50">
                <Button variant="secondary" onClick={bypassLogin}>
                    Guest
                </Button>
            </div>

            <main>
                {/* Hero Section */}
                <section className="relative text-center pt-32 pb-24 md:pt-48 md:pb-40 px-6 flex items-center justify-center min-h-screen overflow-hidden">
                    {/* Slideshow Background */}
                    {slideshowImages.map((src, index) => (
                        <img
                            key={src}
                            src={src}
                            alt="Artisan crafts slideshow"
                            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
                            style={{ opacity: index === currentImageIndex ? 1 : 0, zIndex: 0 }}
                        />
                    ))}
                    {/* End Slideshow */}

                    <div className="absolute inset-0 bg-black/60 z-10"></div>
                    <div className="relative z-20 text-white max-w-4xl mx-auto">
                        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight shadow-black/50 [text-shadow:_0_2px_8px_var(--tw-shadow-color)] scroll-animate is-visible" style={{ transitionDelay: '200ms' }}>
                            Artisan Ally
                        </h1>
                        <p className="mt-4 max-w-3xl mx-auto text-xl md:text-2xl font-semibold text-teal-300 scroll-animate is-visible" style={{ transitionDelay: '400ms' }}>
                            Empowering Artisans, Preserving Heritage.
                        </p>
                        <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-slate-200 scroll-animate is-visible" style={{ transitionDelay: '600ms' }}>
                           An all-in-one AI-powered platform to connect artisans with a global market, skilled volunteers, and the tools they need to thrive. A marketplace for customers and a hub for volunteers.
                        </p>
                        <div className="mt-8 flex justify-center scroll-animate is-visible" style={{ transitionDelay: '800ms' }}>
                            <Button onClick={() => setAuthPage('signup')} className="px-10 py-4 text-lg transform hover:scale-105">
                                Join the Community
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 px-6 bg-white dark:bg-slate-800">
                    <div className="container mx-auto">
                        <div className="text-center max-w-3xl mx-auto mb-16 scroll-animate">
                             <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">A Toolkit for the Modern Creator</h2>
                             <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">From AI-powered design to digital authentication, we provide the tools to elevate your craft and business.</p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <Feature icon={<svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5Z" /></svg>} title="AI Co-pilot" delay={200}>
                                Get help with product descriptions, social media posts, pricing, and even new design ideas.
                            </Feature>
                             <Feature icon={<svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.776 48.776 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" /></svg>} title="AI Photo Studio" delay={400}>
                                Transform simple product photos into professional-quality images with AI-powered backgrounds and lighting.
                            </Feature>
                             <Feature icon={<svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} title="Volunteer Hub" delay={600}>
                                Connect with skilled volunteers for help with photography, marketing, design, and more.
                            </Feature>
                             <Feature icon={<svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><rect x="3" y="7" width="15" height="10" rx="1.5" /><rect x="6" y="4" width="15" height="10" rx="1.5" /></svg>} title="Finance Hub" delay={800}>
                                Access financial tools like crowdfunding and microloans to buy materials and grow your business.
                            </Feature>
                             <Feature icon={<svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} title="Digital Provenance" delay={1000}>
                                Mint digital certificates of authenticity for your creations to protect your intellectual property.
                            </Feature>
                            <Feature icon={<svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>} title="Training Modules" delay={1200}>
                                Access curated courses to learn about digital marketing, branding, e-commerce, and more.
                            </Feature>
                        </div>
                    </div>
                </section>
                
                 {/* Volunteer Highlight Section */}
                <section className="py-20 px-6 bg-slate-100 dark:bg-slate-900">
                    <div className="container mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="scroll-animate" style={{ transitionDelay: '200ms' }}>
                                <span className="font-bold text-teal-600 dark:text-teal-400 uppercase">Our Unique Selling Point</span>
                                <h2 className="text-3xl md:text-4xl font-bold mt-2 text-slate-800 dark:text-slate-100">Where Craft Meets Collaboration</h2>
                                <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                                    Artisan Ally is more than just a marketplace; it's a community. We connect artisans with a global network of skilled volunteers—photographers, designers, marketers, and writers—who are passionate about making a difference. This collaborative ecosystem is our heartbeat, helping preserve cultural heritage by giving artisans the support they need to succeed in the digital age.
                                </p>
                                <Button onClick={() => setAuthPage('signup')} className="mt-8">Become a Volunteer</Button>
                            </div>
                            <div className="scroll-animate" style={{ transitionDelay: '400ms' }}>
                                <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=500&fit=crop&q=80" alt="Volunteer collaborating with an artisan" className="rounded-2xl shadow-xl w-full h-full object-cover"/>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Customer Highlight Section */}
                <section className="py-20 px-6 bg-white dark:bg-slate-800">
                    <div className="container mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                             <div className="scroll-animate order-last md:order-first" style={{ transitionDelay: '400ms' }}>
                                <img src="https://images.unsplash.com/photo-1541748243603-f06b6a482b6e?w=600&h=500&fit=crop&q=80" alt="Customer enjoying a handcrafted product" className="rounded-2xl shadow-xl w-full h-full object-cover"/>
                            </div>
                            <div className="scroll-animate" style={{ transitionDelay: '200ms' }}>
                                <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase">For Our Shoppers</span>
                                <h2 className="text-3xl md:text-4xl font-bold mt-2 text-slate-800 dark:text-slate-100">Discover Handcrafted Treasures</h2>
                                <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                                    Explore a curated marketplace of unique items sold directly by talented artisans. Learn their stories, own a piece of their heritage, and shop with the confidence of digital authenticity.
                                </p>
                                <Button variant="secondary" onClick={() => setAuthPage('signup')} className="mt-8">Start Exploring</Button>
                            </div>
                        </div>
                    </div>
                </section>


                {/* How It Works Section */}
                <section className="py-20 px-6 bg-slate-100 dark:bg-slate-900">
                     <div className="container mx-auto">
                        <div className="text-center max-w-3xl mx-auto mb-16 scroll-animate">
                             <h2 className="text-3xl md:text-4xl font-bold">Simple Steps to Success</h2>
                             <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Whether you're an artisan, a volunteer, or a shopper, getting started is easy.</p>
                        </div>
                        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-x-12">
                            <div>
                                <h3 className="text-2xl font-bold mb-8 text-slate-800 dark:text-slate-100 scroll-animate" style={{ transitionDelay: '100ms' }}>For Artisans</h3>
                                <Step number="1" title="Create Your Profile" delay={200}>Sign up and tell your unique story to the world.</Step>
                                <Step number="2" title="Showcase Your Craft" delay={400}>Use our AI tools to create stunning product listings and photos.</Step>
                                <Step number="3" title="Collaborate & Grow" delay={600}>Connect with volunteers and raise funds to expand your business.</Step>
                                <LastStep icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.707 4.5l.523-1.046a1 1 0 011.742 0l.523 1.046m5.232 0l.523-1.046a1 1 0 011.742 0l.523 1.046M12 21a9 9 0 100-18 9 9 0 000 18z" /></svg>} title="Sell to the World" delay={800}>Reach a global audience through our marketplace and share your art.</LastStep>
                            </div>
                            <div>
                               <h3 className="text-2xl font-bold mb-8 text-slate-800 dark:text-slate-100 scroll-animate" style={{ transitionDelay: '100ms' }}>For Volunteers</h3>
                                <Step number="1" title="Join the Community" delay={200}>Sign up and list your skills to start making a difference.</Step>
                                <Step number="2" title="Find a Project" delay={400}>Browse opportunities posted by artisans that match your expertise.</Step>
                                <Step number="3" title="Lend Your Skills" delay={600}>Collaborate with artisans on projects from design to marketing.</Step>
                                <LastStep icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>} title="Create Lasting Impact" delay={800}>Help preserve cultural heritage and empower small businesses.</LastStep>
                            </div>
                            <div>
                               <h3 className="text-2xl font-bold mb-8 text-slate-800 dark:text-slate-100 scroll-animate" style={{ transitionDelay: '100ms' }}>For Customers</h3>
                                <Step number="1" title="Explore the Marketplace" delay={200}>Browse unique handcrafted items from talented artisans.</Step>
                                <Step number="2" title="Connect & Bargain" delay={400}>Message artisans directly, learn their stories, and even make offers.</Step>
                                <Step number="3" title="Shop with Confidence" delay={600}>Purchase securely and verify your item's authenticity with its certificate.</Step>
                                <LastStep icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>} title="Receive & Cherish" delay={800}>Get your one-of-a-kind item delivered and become part of the artisan's story.</LastStep>
                            </div>
                        </div>
                    </div>
                </section>

                 {/* Final CTA Section */}
                <section className="py-20 px-6 bg-teal-600 text-white">
                    <div className="container mx-auto text-center scroll-animate" style={{ transitionDelay: '200ms' }}>
                        <h2 className="text-3xl md:text-4xl font-bold">Ready to Join Our Community?</h2>
                        <p className="mt-4 text-lg text-teal-100 max-w-2xl mx-auto">Whether you're an artisan, a volunteer, or a shopper, your journey starts here.</p>
                        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                            <Button onClick={() => setAuthPage('signup')} className="w-full sm:w-auto bg-white text-teal-600 hover:bg-teal-50 px-8 py-3 text-base">I'm an Artisan</Button>
                            <Button onClick={() => setAuthPage('signup')} className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-3 text-base">I'm a Volunteer</Button>
                             <Button onClick={() => setAuthPage('signup')} className="w-full sm:w-auto bg-white/10 border-2 border-white text-white hover:bg-white/20 px-8 py-3 text-base">Start Shopping</Button>
                        </div>
                    </div>
                </section>
            </main>

             {/* Footer */}
            <footer className="bg-slate-100 dark:bg-slate-800">
                <div className="container mx-auto px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    <p>&copy; {new Date().getFullYear()} Artisan Ally. All rights reserved.</p>
                </div>
            </footer>
            
            <style>{`
                .scroll-animate {
                    opacity: 0;
                    transform: translateY(30px);
                    transition: opacity 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .scroll-animate.is-visible {
                    opacity: 1;
                    transform: translateY(0);
                }
            `}</style>
        </div>
    );
};

export default LandingPage;