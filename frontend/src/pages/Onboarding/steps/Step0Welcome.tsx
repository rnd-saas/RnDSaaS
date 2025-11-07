import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel.tsx";

export default function Step0Welcome() {

    return (
        <div>
            <Carousel className="w-full max-w-xs">
                <CarouselContent>
                    <CarouselItem>Choose Tom</CarouselItem>
                    <CarouselItem>Choose Sarah</CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    )
}