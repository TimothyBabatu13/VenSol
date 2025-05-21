import { useAuthProvider } from "../context/auth-provider"
import { Dashboard } from "../components/dashboard";
import { Toaster } from "../components/ui/sonner";
import { LandingPage } from "../components/landing-page";


const Home = () => {
  const auth = useAuthProvider();
  
  if(auth?.isLoadingInBackground) return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
  )
 
  return (
    <div className="">
      {
        
        auth?.authenticated ? 
        <Dashboard /> 
        : <LandingPage />
      }
      <Toaster />
    </div>
  )
}

export default Home
