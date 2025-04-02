// Only render the SDK on the client-side
"use client";

import React, { useEffect, useRef } from "react";
import SellerWrapper from "../components/SellerWrapper";

const QuotationPage = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    const { NutrientViewer } = window;
    if (container && NutrientViewer) {
      NutrientViewer.load({
        container,
        // You can specify a file in public directory, for example /document.pdf
        document: "https://www.nutrient.io/downloads/pspdfkit-web-demo.pdf",
      });
    }

    return () => {
      NutrientViewer?.unload(container);
    };
  }, []);

  // You must set the container height and width
  return (
    <SellerWrapper>
      <div ref={containerRef} className="absolute w-full h-full" />
    </SellerWrapper>
  );
};

export default QuotationPage;
