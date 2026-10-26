import About from "@/components/About";
import GlobalNetwork from "@/components/Globalnetwork";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Tracking from "@/components/Tracking";

export default function Page() {
  return (
    <main>
      <Hero />
     <About/>
     <Services/>
     <GlobalNetwork/>
     <Tracking/>
    </main>
  );
}