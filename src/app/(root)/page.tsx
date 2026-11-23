import Banner from "@/components/shared/Banner";
import CustomerReviews from "@/components/shared/CustomerReview";
import EquipmentCategories from "@/components/shared/EquipmentCategories";
import FeaturedEquipment from "@/components/shared/FeatureEquipment";
import HowItWorks from "@/components/shared/HowItWorks";
// import TrustedOwners from "@/components/shared/TrustedOwner";
import WhyChooseUs from "@/components/shared/WhyChooseUs";

export default function Home() {
  return (
    <div>
      <Banner />
      <EquipmentCategories />
      <FeaturedEquipment />
      <WhyChooseUs />
      <CustomerReviews />
      {/* <TrustedOwners /> */}
      <HowItWorks/>
    </div>
  );
}
