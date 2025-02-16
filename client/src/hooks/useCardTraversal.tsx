import { useState, useEffect } from "react";
import { createQRCode } from "@/lib/helper";
import { ICard } from "@/types/type";
import { toast } from "react-toastify";
import { toPng } from "html-to-image";
import JSZip from "jszip";
import { saveAs } from "file-saver";


interface Counts {
    currentPage: number;
    resultPerPage: number;
    filteredCards: number;
    totalCards: number;
}

const useCardTraversal = (
    // type: "ALL" | "INDIVIDUAL" | "BOTANICAL" | "ANIMAL" | "CREATOR" | "MEDICAL",
    cards: ICard[] | null,
    counts: Counts,
    setCounts: React.Dispatch<React.SetStateAction<Counts>>
) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    useEffect(() => {
        setCurrentIndex(0);
    }, [counts.currentPage]);

    const hasNext = (): boolean => {
        return cards ? currentIndex < cards.length - 1 || (counts.currentPage * counts.resultPerPage < counts.filteredCards) : false;
    };

    const hasPrev = (): boolean => {
        return cards ? currentIndex > 0 || counts.currentPage > 1 : false;
    };

    const handleNext = () => {
        if (cards) {
            if (currentIndex < cards.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else if (counts.currentPage * counts.resultPerPage < counts.filteredCards) {
                setCounts(prev => ({
                    ...prev,
                    currentPage: prev.currentPage + 1,
                }));
                setCurrentIndex(0);
            }
        }
    };



    // const downloadDivAsImage = () => {

    //     const element = document.getElementById("cardDiv");

    //     if (!element) return;

    //     const scale = 3; // High resolution scaling

    //     const options = {
    //         quality: 1, // Maximum quality
    //         backgroundColor: "white", // Ensures background color is white
    //         width: element.offsetWidth * scale, // Fix cropping issue
    //         height: element.offsetHeight * scale, // Fix cropping issue
    //         style: {
    //             transform: `scale(${scale})`, // Scale for better resolution
    //             transformOrigin: "top left",
    //             width: `${element.offsetWidth * scale}px`, // Ensure full width is captured
    //             height: `${element.offsetHeight * scale}px`, // Ensure full height is captured
    //             fontFamily: window.getComputedStyle(document.body).fontFamily, // Fix font rendering
    //             border: "none", // Remove weird borders
    //             boxShadow: "none", // Remove any box shadow issues
    //             margin:"0",
    //             padding:"0"
    //         },
    //     };

    //     toPng(element, options)
    //         .then((dataUrl) => {
    //             const link = document.createElement("a");
    //             link.href = dataUrl;
    //             link.download = "card.png";
    //             link.click();
    //         })
    //         .catch((error) => {
    //             console.error("Error capturing image:", error);
    //         });
    // };

    const downloadDivAsImage = async () => {
        const mainDiv = document.getElementById("cardDiv");
        const backdropDiv = document.getElementById("backdrop");

        if (!mainDiv || !backdropDiv) {
            console.error("One or both divs are missing.");
            return;
        }

        // ✅ Clone the backdrop to prevent UI shifting
        const clonedBackdrop = backdropDiv.cloneNode(true) as HTMLElement;
        document.body.appendChild(clonedBackdrop);
        clonedBackdrop.style.position = "absolute";
        clonedBackdrop.style.left = "0px"; // Ensure it starts at the left edge
        clonedBackdrop.style.top = "0px"; // Prevents shifting down
        clonedBackdrop.style.opacity = "1"; // Ensure visibility for capturing

        // ✅ Wait for any rendering issues to settle
        await new Promise((resolve) => setTimeout(resolve, 100));

        const scale = 3;
        const options = {
            quality: 1,
            backgroundColor: "transparent",
            width: mainDiv.offsetWidth * scale,
            height: mainDiv.offsetHeight * scale,
            style: {
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                width: `${mainDiv.offsetWidth * scale}px`,
                height: `${mainDiv.offsetHeight * scale}px`,
                fontFamily: window.getComputedStyle(document.body).fontFamily,
                border: "none",
                boxShadow: "none",
            },
        };

        try {
            // ✅ Capture main div
            const mainImg = await toPng(mainDiv, options);

            // ✅ Capture backdrop div (fixed position)
            const backdropImg = await toPng(clonedBackdrop, options);

            // ✅ Remove the cloned backdrop after capturing
            document.body.removeChild(clonedBackdrop);

            // ✅ Create ZIP file
            const zip = new JSZip();
            zip.file("card.png", mainImg.split(",")[1], { base64: true });
            zip.file("backdrop.png", backdropImg.split(",")[1], { base64: true });

            // ✅ Generate and download ZIP
            zip.generateAsync({ type: "blob" }).then((content) => {
                saveAs(content, "downloaded_images.zip");
            });

        } catch (error) {
            console.error("Error capturing images:", error);
        }
    };


    const handlePrev = () => {
        if (cards) {
            if (currentIndex > 0) {
                setCurrentIndex(prev => prev - 1);
            } else if (counts.currentPage > 1) {
                setCounts(prev => ({
                    ...prev,
                    currentPage: prev.currentPage - 1,
                }));
                setCurrentIndex(cards.length - 1);
            }
        }
    };

    const handleDownload = () => {
        if (cards && cards[currentIndex]?.shortCode) {
            const qrCode = createQRCode(cards[currentIndex].type, cards[currentIndex].shortCode);
            qrCode.download({
                name: cards[currentIndex]._id,
                extension: "png"
            });
        }
    };

    const handleShare = () => {
        if (cards && cards[currentIndex]?.shortCode) {
            window.navigator.clipboard.writeText(`${window.location.protocol}//${window.location.host}/d/${cards[currentIndex].shortCode}`);
            toast.success("Link has been copied to clipboard");
        }
    };

    return { currentIndex, setCurrentIndex, handleNext, handlePrev, handleDownload, handleShare, hasNext, hasPrev, downloadDivAsImage };
};

export default useCardTraversal;