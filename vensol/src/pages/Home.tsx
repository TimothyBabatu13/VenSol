import { useAuthProvider } from "../context/auth-provider"
import { Dashboard } from "../components/dashboard";
import { Toaster } from "../components/ui/sonner";
import { LandingPage } from "../components/landing-page";

const Home = () => {
  const auth = useAuthProvider();
  console.log(auth?.authenticated)
  return (
    <div className="">
      {
        <Dashboard />
        // <LandingPage />
      }
      <Toaster />
    </div>
  )
}

export default Home