interface PropTypes {
    totalCards: number;
    currentIndex: number;
    setCurrentIndex: (index: number) => void;
}

const DotIndicator = ({ totalCards, currentIndex, setCurrentIndex }: PropTypes) => {
    const maxDots = 5;
    const dots = [];
    let startIndex = Math.max(0, Math.min(currentIndex - 2, totalCards - maxDots));

    for (let i = 0; i < maxDots; i++) {
        let dotIndex = startIndex + i;
        dots.push(dotIndex);
    }

    return (
        <div className="flex flex-row justify-center items-center gap-2">
            {dots.map((index, i) => {
                const isFading = i === 1 || i === maxDots - 2;
                return (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                            currentIndex === index ? "bg-blue-500 scale-125" : isFading ? "bg-gray-300 opacity-50" : "bg-gray-400"
                        }`}
                    />
                );
            })}
        </div>
    );
};

export default DotIndicator;