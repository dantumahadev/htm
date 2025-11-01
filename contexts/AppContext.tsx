import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { 
    getAuth, 
    onAuthStateChanged, 
    GoogleAuthProvider, 
    signInWithPopup, 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    User as FirebaseUser
} from 'firebase/auth';
import { collection, doc, getDocs, onSnapshot, setDoc, addDoc, writeBatch } from 'firebase/firestore';
import { app, db } from '../firebaseConfig';
import type { User, Page, Project, Volunteer, Artisan, Product, CartItem, Conversation, ChatMessage, Role } from '../types';
import { useLocalization, type Language, LocalizationProvider } from '../hooks/useLocalization';
import { initialArtisans, initialVolunteers, initialProducts, initialProjects } from '../lib/initialData';

type AuthPage = 'landing' | 'login' | 'signup';

interface AppContextType {
    currentUser: User | null;
    setCurrentUser: (user: User | Artisan | Volunteer | null | ((prev: User | null) => User | Artisan | Volunteer | null)) => void;
    updateUserProfile: (profileData: Partial<Artisan | Volunteer | User>) => Promise<void>;
    activePage: Page;
    setActivePage: (page: Page) => void;
    theme: string;
    toggleTheme: () => void;
    language: Language;
    setLanguage: (language: Language) => void;
    projects: Project[];
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
    volunteers: Volunteer[];
    setVolunteers: React.Dispatch<React.SetStateAction<Volunteer[]>>;
    artisans: Artisan[];
    products: Product[];
    addProduct: (productData: Omit<Product, 'id' | 'artisanId' | 'dateAdded' | 'certificateId'>) => void;
    selectedProduct: Product | null;
    setSelectedProduct: (product: Product | null) => void;
    selectedPortfolioUser: User | null;
    setSelectedPortfolioUser: (user: User | null) => void;
    cart: CartItem[];
    addToCart: (product: Product, offerPrice: number) => void;
    removeFromCart: (productId: string) => void;
    updateCartQuantity: (productId: string, quantity: number) => void;
    favorites: string[]; // Array of product IDs
    toggleFavorite: (productId: string) => void;
    isFavorite: (productId: string) => boolean;
    conversations: Conversation[];
    sendMessage: (conversationId: string, messageText: string) => void;
    startChatWith: string | null;
    startChat: (userId: string) => void;
    createOrSelectConversation: (participantId: string) => string;
    
    // Auth
    firebaseUser: FirebaseUser | null;
    authLoading: boolean;
    isAuthenticated: boolean;
    isInitialLogin: boolean;
    setIsInitialLogin: (isInitial: boolean) => void;
    login: (email:string, pass:string) => Promise<any>;
    signup: (name:string, email:string, pass:string) => Promise<any>;
    loginWithGoogle: () => Promise<any>;
    logout: () => void;
    bypassLogin: () => void;
    authPage: AuthPage;
    setAuthPage: (page: AuthPage) => void;

    clearStartChat: () => void;
    t: (key: string, replacements?: { [key: string]: string | number }) => string;
    firestoreError: string | null;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

// Data Seeding Function
const seedDatabase = async () => {
    try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        if (usersSnapshot.empty) {
            console.log('Database is empty. Seeding initial data...');
            const batch = writeBatch(db);

            initialArtisans.forEach(artisan => {
                const docRef = doc(db, 'users', artisan.id);
                batch.set(docRef, artisan);
            });

            initialVolunteers.forEach(volunteer => {
                const docRef = doc(db, 'users', volunteer.id);
                batch.set(docRef, volunteer);
            });

            initialProducts.forEach(product => {
                const docRef = doc(db, 'products', product.id.toString());
                batch.set(docRef, product);
            });

            initialProjects.forEach(project => {
                const docRef = doc(db, 'projects', project.id.toString());
                batch.set(docRef, project);
            });

            await batch.commit();
            console.log('Initial data seeded successfully.');
        } else {
            console.log('Database already contains data. Skipping seed.');
        }
    } catch (error) {
        console.error("Error seeding database:", error);
    }
};

const AppProviderContent: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { t, language, setLanguage } = useLocalization();
    const [activePage, setActivePage] = useState<Page>('dashboard');
    const [theme, setTheme] = useState('light');
    
    // Auth state
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const [authPage, setAuthPage] = useState<AuthPage>('landing');
    const [isInitialLogin, setIsInitialLogin] = useState(false);
    const auth = getAuth(app);

    // Data state
    const [projects, setProjects] = useState<Project[]>([]);
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
    const [artisans, setArtisans] = useState<Artisan[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [firestoreError, setFirestoreError] = useState<string | null>(null);
    
    // UI State
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedPortfolioUser, setSelectedPortfolioUser] = useState<User | null>(null);
    
    // Cart & Favorites
    const [cart, setCart] = useState<CartItem[]>([]);
    const [favorites, setFavorites] = useState<string[]>([]);

    // Chat
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [startChatWith, setStartChatWith] = useState<string | null>(null);
    
    // Seed database on initial load
    useEffect(() => {
        seedDatabase();
    }, []);

    useEffect(() => {
        let firestoreFailed = false;

        const handleFirestoreError = (error: any, collectionName: string) => {
            console.error(`Error fetching ${collectionName}: `, error);
            if (!firestoreFailed && (error.code === 'permission-denied' || (error.message && error.message.includes('Missing or insufficient permissions')))) {
                firestoreFailed = true;
                const errorMessage = "Could not connect to live database. Using sample data. Please check your Firebase configuration and security rules.";
                setFirestoreError(errorMessage);
                console.warn(`Firestore permission denied. Falling back to initial local data. Please check your Firestore security rules to enable real-time features.`);
                setProducts(initialProducts);
                setProjects(initialProjects);
                setArtisans(initialArtisans);
                setVolunteers(initialVolunteers);
            }
        };

        const productsUnsub = onSnapshot(collection(db, 'products'), (snapshot) => {
            if (firestoreFailed) return;
            const productsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Product);
            setProducts(productsData.length > 0 ? productsData : initialProducts);
        }, (error) => handleFirestoreError(error, 'products'));

        const projectsUnsub = onSnapshot(collection(db, 'projects'), (snapshot) => {
            if (firestoreFailed) return;
            const projectsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Project);
            setProjects(projectsData.length > 0 ? projectsData : initialProjects);
        }, (error) => handleFirestoreError(error, 'projects'));
        
        const usersUnsub = onSnapshot(collection(db, "users"), (snapshot) => {
            if (firestoreFailed) return;
            const allUsers = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as User);
            const artisansData = allUsers.filter(u => u.role === 'artisan') as Artisan[];
            const volunteersData = allUsers.filter(v => v.role === 'volunteer') as Volunteer[];
            setArtisans(artisansData.length > 0 ? artisansData : initialArtisans);
            setVolunteers(volunteersData.length > 0 ? volunteersData : initialVolunteers);
        }, (error) => handleFirestoreError(error, 'users'));

        return () => {
            productsUnsub();
            projectsUnsub();
            usersUnsub();
        };
    }, []);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setFirebaseUser(user);

            if (user) {
                setIsAuthenticated(true);
                setIsInitialLogin(true); // Flag that this is the first login sequence for this session

                const userDocRef = doc(db, 'users', user.uid);
                const unsubProfile = onSnapshot(userDocRef, (doc) => {
                    if (doc.exists()) {
                        setCurrentUser(doc.data() as User);
                    } else {
                        // User exists in auth, but not in our DB (e.g., just signed up).
                        // Set currentUser to null to trigger RoleSelectionPage.
                        setCurrentUser(null);
                    }
                    setAuthLoading(false);
                }, (error) => {
                    console.error("Error listening to user profile:", error);
                    setCurrentUser(null); // Fail safe
                    setAuthLoading(false);
                });
                return () => unsubProfile();
            } else {
                // User is signed out
                setIsAuthenticated(false);
                setCurrentUser(null);
                setAuthLoading(false);
                setIsInitialLogin(false);
            }
        });
        return () => unsubscribe();
    }, [auth]);


    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    useEffect(() => {
        if (currentUser?.profileComplete) {
            if (currentUser.role === 'customer') {
                setActivePage('customer-marketplace');
            } else if (!isInitialLogin) { // Don't reset to dashboard if it's the initial login
                setActivePage('dashboard');
            }
            setSelectedPortfolioUser(null);
            setSelectedProduct(null);
        }
    }, [currentUser?.profileComplete, currentUser?.role]);
    
    useEffect(() => {
        if(selectedPortfolioUser) {
            setSelectedProduct(null);
        }
    }, [selectedPortfolioUser]);

    // Auth functions
    const login = (email: string, pass: string) => signInWithEmailAndPassword(auth, email, pass);
    
    const signup = async (name: string, email: string, pass: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        if(userCredential.user) {
            await updateProfile(userCredential.user, { displayName: name });
            setFirebaseUser(auth.currentUser);
        }
        return userCredential;
    };

    const loginWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    }

    const logout = () => {
        if (currentUser?.id.startsWith('guest_')) {
            // Manual state reset for guest users
            setIsAuthenticated(false);
            setCurrentUser(null);
            setFirebaseUser(null);
            setAuthPage('landing');
            setCart([]);
            setFavorites([]);
            return;
        }

        signOut(auth).then(() => {
            // onAuthStateChanged will handle state cleanup for real users
            setAuthPage('landing');
        });
    };
    
    const bypassLogin = () => {
        const guestUser: Artisan = {
            ...initialArtisans[0],
            id: `guest_${Date.now()}`,
            name: 'Guest User',
            profileComplete: false,
        };
        
        setFirebaseUser(null);
        setCurrentUser(guestUser);
        setIsAuthenticated(true);
        setAuthLoading(false);
        setAuthPage('landing');
    };

    const handleSetCurrentUser = async (newUser: any) => {
        // This function's primary job now is to create the user profile document after role selection.
        if (typeof newUser === 'function') {
             setCurrentUser(newUser); // Allow state function updates for guest etc.
             return;
        }

        const userToSet = newUser as User;

        if (userToSet && userToSet.id.startsWith('guest_')) {
             setCurrentUser(userToSet); // Guest user, just update state
             return;
        }

        if (userToSet && firebaseUser) {
            try {
                const userDocRef = doc(db, 'users', firebaseUser.uid);
                // The `onSnapshot` listener will handle updating the `currentUser` state
                await setDoc(userDocRef, { ...userToSet, id: firebaseUser.uid }, { merge: true });
            } catch (error) {
                console.error("CRITICAL: Failed to create user profile in Firestore:", error);
                alert("Error: Could not save your profile. Please check your network connection and Firestore security rules.");
            }
        } else if (userToSet === null) {
            setCurrentUser(null);
        }
    };

    const updateUserProfile = async (profileData: Partial<Artisan | Volunteer | User>) => {
        if (currentUser?.id.startsWith('guest_')) {
            setCurrentUser(prev => ({
                ...prev!,
                ...profileData,
                profileComplete: true
            }));
            return;
        }

        if (firebaseUser) {
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            await setDoc(userDocRef, { ...profileData, profileComplete: true }, { merge: true });
        }
    };

    // Product function
    const addProduct = async (productData: Omit<Product, 'id' | 'artisanId' | 'dateAdded' | 'certificateId'>) => {
        if (!currentUser || currentUser.role !== 'artisan') return;
        const newProduct = {
            ...productData,
            artisanId: currentUser.id,
            dateAdded: new Date().toISOString(),
            certificateId: `KH-${Math.floor(Math.random() * 900000) + 100000}`,
        };
        try {
            await addDoc(collection(db, "products"), newProduct);
        } catch (error) {
            console.error("Error adding product: ", error);
        }
    };
    
    // Cart functions
    const addToCart = (product: Product, offerPrice: number) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.product.id === product.id);
            if (existingItem) {
                return prevCart.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1, offerPrice } : item);
            }
            return [...prevCart, { product, quantity: 1, offerPrice }];
        });
    };

    const removeFromCart = (productId: string) => {
        setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
    };

    const updateCartQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            setCart(prevCart => prevCart.map(item => item.product.id === productId ? { ...item, quantity } : item));
        }
    };

    // Favorites functions
    const toggleFavorite = (productId: string) => {
        setFavorites(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
    };
    const isFavorite = (productId: string) => favorites.includes(productId);

    // Chat functions
    const startChat = (userId: string) => {
        setStartChatWith(userId);
        if(currentUser?.role === 'customer') {
            setActivePage('customer-chat');
        } else {
            setActivePage('chat');
        }
    };
    const clearStartChat = () => setStartChatWith(null);

    const createOrSelectConversation = (participantId: string): string => {
        if (!currentUser) return '';
        const sortedIds = [currentUser.id, participantId].sort();
        const conversationId = sortedIds.join('-');

        const existingConversation = conversations.find(c => c.id === conversationId);
        if (existingConversation) {
            return existingConversation.id;
        }

        const allUsers: User[] = [...artisans, ...volunteers];
        const participant = allUsers.find(u => u.id === participantId);

        if (!participant) return '';

        const newConversation: Conversation = {
            id: conversationId,
            participantIds: sortedIds,
            participants: {
                [currentUser.id]: { name: currentUser.name, avatar: currentUser.avatar },
                [participantId]: { name: participant.name, avatar: participant.avatar },
            },
            messages: [],
        };
        setConversations(prev => [...prev, newConversation]);
        return newConversation.id;
    };


    const sendMessage = (conversationId: string, messageText: string) => {
        if (!currentUser) return;
        
        const newMessage: ChatMessage = {
            id: Date.now(),
            senderId: currentUser.id,
            text: messageText,
            timestamp: new Date().toISOString(),
        };

        setConversations(prev =>
            prev.map(conv =>
                conv.id === conversationId
                    ? { ...conv, messages: [...conv.messages, newMessage] }
                    : conv
            )
        );
    };

    const value: AppContextType = {
        currentUser,
        setCurrentUser: handleSetCurrentUser,
        updateUserProfile,
        activePage,
        setActivePage,
        theme,
        toggleTheme,
        language,
        setLanguage,
        projects,
        setProjects,
        volunteers,
        setVolunteers,
        artisans,
        products,
        addProduct,
        selectedProduct,
        setSelectedProduct,
        selectedPortfolioUser,
        setSelectedPortfolioUser,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        favorites,
        toggleFavorite,
        isFavorite,
        conversations,
        sendMessage,
        startChatWith,
        startChat,
        createOrSelectConversation,
        firebaseUser,
        authLoading,
        isAuthenticated,
        isInitialLogin,
        setIsInitialLogin,
        login,
        signup,
        loginWithGoogle,
        logout,
        bypassLogin,
        authPage,
        setAuthPage,
        clearStartChat,
        t,
        firestoreError,
    };
    
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('en');
    const value = { language, setLanguage };
    return (
        <LocalizationProvider value={value}>
            <AppProviderContent>{children}</AppProviderContent>
        </LocalizationProvider>
    );
};