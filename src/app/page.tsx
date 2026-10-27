import About from "@/components/About";
import BlogSection from "@/components/BlogSection";
import Cta from "@/components/Cta";
import FAQSection from "@/components/FAQSection";
import GlobalNetwork from "@/components/Globalnetwork";
import Hero from "@/components/Hero";
import ImageStatement from "@/components/ImageStatement";


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
     <ImageStatement/>
   <BlogSection/>
   <FAQSection/>
     <Cta/>
    </main>
  );
}