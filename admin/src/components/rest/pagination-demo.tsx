import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export function PaginationDemo({ currentPage, total, setPage }: any) {

    const handlePrev = () => {
        if (currentPage > 1) {
            setPage(currentPage - 1)
        }
    }

    const handleNext = () => {
        if (currentPage < total) {
            setPage(currentPage + 1)
        }
    }

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious onClick={handlePrev} />
                </PaginationItem>
                {(currentPage > 1) && (
                    <>
                        <PaginationItem>
                            <PaginationLink onClick={() => setPage(1)}>1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                    </>
                )}
                <PaginationItem>
                    <PaginationLink isActive>{currentPage}</PaginationLink>
                </PaginationItem>
                {(currentPage < total) && (
                    <>
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink onClick={() => setPage(total)}>{total}</PaginationLink>
                        </PaginationItem>
                    </>
                )}
                <PaginationItem>
                    <PaginationNext onClick={handleNext} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}
