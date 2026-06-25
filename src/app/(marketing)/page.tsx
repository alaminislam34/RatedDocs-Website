import CtaSearchSection from "./_components/module/Home/find-verified-dentist/cta-section";
import Hero from "./_components/module/Home/Hero/hero";
import AiSmilePreview from "./_components/module/Home/Ai-Smile-Preview/ai-smile-preview";
// import SmileTransformations from "./_components/module/Home/smile-transformations/smile-transformations";
import VerifiedDentists from "./_components/module/Home/verified-dentist-section/verified-dentist";
import WhyTrust from "./_components/module/Home/WhyTrsut/why-trust";
import AddKolMemberModal from "./_components/modal/add-kol-member-modal";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <VerifiedDentists />
      <WhyTrust />
      {/* <SmileTransformations /> */}
      <AiSmilePreview />
      <CtaSearchSection />
      <AddKolMemberModal />
    </div>
  );
}
