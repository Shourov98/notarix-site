import Hero from "@/components/landing_page/Hero";
import HowItWorks from "@/components/landing_page/HowItWorks";
import Features from "@/components/landing_page/Features";
import UserRoles from "@/components/landing_page/UserRoles";

export default function Home() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <Features />
      <UserRoles />
    </main>
  );
}
