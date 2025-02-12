import { useState, useEffect } from "react";
import { createQRCode } from "@/lib/helper";
import { Animal, Creator, MedicalType, Personal, Tree } from "@/types/card_types";

interface Counts {
    currentPage: number;
    resultPerPage: number;
    filteredCards: number;
    totalCards: number;
}

const useCardTraversal = (
    type: "individual" | "botanical" | "animal" | "creator" | "medical",
    cards: Tree[] | Personal[] | MedicalType[] | Creator[] | Animal[] | null,
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
            const qrCode = createQRCode(type, cards[currentIndex].shortCode);
            qrCode.download({
                name: cards[currentIndex]._id,
                extension: "png"
            });
        }
    };

    const handleShare = () => {
        if (cards && cards[currentIndex]?.shortCode) {
            window.navigator.clipboard.writeText(`${window.location.protocol}//${window.location.host}/d/${cards[currentIndex].shortCode}`);
            alert("Link has been copied to clipboard");
        }
    };

    return { currentIndex, setCurrentIndex, handleNext, handlePrev, handleDownload, handleShare, hasNext, hasPrev };
};

export default useCardTraversal;