import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel.tsx";
import {Field, FieldLabel} from "@/components/ui/field.tsx";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.tsx";

export default function Step0Welcome() {

    return (
        <Carousel className="w-full max-w-xs">
            <RadioGroup name={"helperChoice"}>
                <CarouselContent>
                    <CarouselItem>
                        <Field orientation="vertical">
                            <RadioGroupItem value="tom" id="tom" />
                            <FieldLabel htmlFor="tom" className="font-normal">Choose Tom</FieldLabel>
                        </Field>
                    </CarouselItem>
                    <CarouselItem>
                        <Field orientation="vertical">
                            <RadioGroupItem value="sarah" id="sarah" />
                            <FieldLabel htmlFor="sarah" className="font-normal">Choose Sarah</FieldLabel>
                        </Field>
                    </CarouselItem>
                </CarouselContent>

                <CarouselPrevious />
                <CarouselNext />
            </RadioGroup>
        </Carousel>
    )
}