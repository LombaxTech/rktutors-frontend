import { useEffect, useRef, useState } from "react";
import RINGS from "vanta/dist/vanta.rings.min";
import * as THREE from "three";

import Navbar from "./Navbar";
import HeroSection from "./HeroSection";

export default function Header() {
  const [vantaEffect, setVantaEffect] = useState(0);
  const vantaRef = useRef(null);

  useEffect(() => {
    if (!vantaEffect) {
      RINGS({
        el: vantaRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        // backgroundColor: 0xeded,
      });
    }
    return () => {
      //   if (vantaEffect) {
      //     console.log({ vantaEffect });
      //     if (typeof vantaEffect.destroy == "function") {
      //       vantaEffect.destory();
      //     }
      //   }
    };
  }, [vantaEffect]);

  return (
    <div
      id="header"
      className="min-h-screen w-full relative "
      style={{ height: "120vh" }}
    >
      {/* Vanta Animated Background */}
      <div className="absolute top-0 left-0 h-full w-full z-0" ref={vantaRef}>
        <Navbar />
        <HeroSection />
      </div>
    </div>
  );
}
