import { Header } from '@/components/Header';
import { Banner } from '@/components/Banner';
import { AboutProject } from '@/components/AboutProject';
import { TrendingSection } from '@/components/TrendingSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <Banner />
      <AboutProject />
      <TrendingSection />
    </div>
  );
}