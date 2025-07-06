import { useEffect, useState } from 'react';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ChallengeGrid from './components/ChallengeGrid';
import Footer from './components/Footer';
import { GameProvider } from './context/GameContext';

// Impor fungsi penting dari file auth.js Anda
import { onAuthStateChange, logoutUser, getUserProfile } from './firebase/auth.ts';
import type { User as FirebaseUser } from 'firebase/auth';


function AppContent() {
  // State untuk menyimpan object user dari Firebase
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  // State untuk menampilkan loading screen saat aplikasi pertama kali berjalan
  const [isLoading, setIsLoading] = useState(true);
  // State untuk melacak apakah ada challenge yang sedang terbuka
  const [isChallengeOpen, setIsChallengeOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<any | null>(null);

  useEffect(() => {
    // onAuthStateChange adalah listener dari Firebase.
    // Ia akan secara otomatis berjalan ketika pengguna login atau logout.
    const unsubscribe = onAuthStateChange(async (user) => {
      setCurrentUser(user); // `user` akan berisi data jika login, dan `null` jika logout
      setIsLoading(false); // Sembunyikan loading setelah status otentikasi diketahui
      if (user) {
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
    });

    // Ini penting untuk membersihkan listener saat komponen tidak lagi digunakan
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setCurrentUser(null);
    } catch (error) {
      console.error("Gagal untuk logout:", error);
    }
  };

  // Selama Firebase memeriksa status login, tampilkan loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-100 to-blue-100 flex items-center justify-center border border-cyan-300/50">
            <div className="w-8 h-8 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-slate-700">Menginisialisasi HackQuest...</h2>
        </div>
      </div>
    );
  }

  
  return (
    <>
      {!currentUser ? (
        <Login />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-cyan-50">
          <Navbar 
            onLogout={handleLogout} 
            isDisabled={isChallengeOpen} 
            user={userProfile}
            currentUser={currentUser}
          />
          <div className={`${isChallengeOpen ? 'pointer-events-none blur-sm opacity-50' : ''} transition-all duration-300`}>
            <Hero />
          </div>
          <ChallengeGrid onChallengeStateChange={setIsChallengeOpen} />
          <div className={`${isChallengeOpen ? 'pointer-events-none blur-sm opacity-50' : ''} transition-all duration-300`}>
            <Footer />
          </div>
        </div>
      )}
    </>
  );
}

// Tidak ada perubahan di sini
function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;