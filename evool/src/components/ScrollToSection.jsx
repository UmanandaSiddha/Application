import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { menuItems } from "./Navbar";

const ScrollToSection = () => {
    const location = useLocation();

    useEffect(() => {
        const scrollToSection = () => {
            // Match the current pathname to a section
            const matchedItem = menuItems.find((item) => item.path === location.pathname);

            if (matchedItem) {
                const sectionId = matchedItem.path.slice(1) || "home"; // Default to "home" if root "/"
                const section = document.getElementById(sectionId);

                if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                }
            } else {
                // Scroll to top for unknown paths
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        };

        scrollToSection();
    }, [location]);

    return null; // This component doesn't render anything
};

export default ScrollToSection;