import React, { useRef } from 'react';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import WhyChooseRentHub from '../components/WhyChooseRentHub';
import HowRentHubWorks from '../components/HowRentHubWorks';
import FooterPublic from '../components/Footer';

function Layout() {
  const howItWorksRef = useRef(null);

  return (
    <> 
      <Navbar scrollToHowItWorks={() => howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' })} />
      <Banner />
      <WhyChooseRentHub />
      <div ref={howItWorksRef}>
        <HowRentHubWorks />
      </div>
      <FooterPublic />
    </>
  );
}

export default Layout;
