import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel.tsx";
import {Field, FieldDescription, FieldLabel, FieldLegend, FieldSet} from "@/components/ui/field.tsx";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.tsx";
import tomImage from '@/assets/onboarding_welcome/onboarding-tom.png';
import sarahImage from '@/assets/onboarding_welcome/onboarding-sarah.png';

declare module '*.png' {
    const value: string;
    export default value;
}

export default function Step0Welcome() {

    return (
        <FieldSet>
            <FieldLegend>Hello!</FieldLegend>
            <FieldDescription>
                Pick who you'd like to work out with!
            </FieldDescription>
            <Carousel className="w-full max-w-xs">
                <RadioGroup name={"helperChoice"} className="flex flex-row space-x-4" defaultValue={"tom"}>
                    <CarouselContent>
                        <CarouselItem>
                            <Field className="flex items-center flex-col" orientation="horizontal">
                                <FieldLabel htmlFor={"tom"} className="flex items-center flex-col" >
                                    <img src={tomImage} alt={"Tom waving"}/>
                                    <p>I’m Tom - nice to meet you!<br/>I’ll be your workout buddy</p>
                                </FieldLabel>
                                <RadioGroupItem value="0" id="tom" />
                            </Field>
                        </CarouselItem>
                        <CarouselItem>
                            <Field className="flex items-center flex-col" orientation="horizontal">
                                <FieldLabel htmlFor={"sarah"} className="flex items-center flex-col" >
                                    <img src={sarahImage} alt={"Sarah waving"}/>
                                    <p>I’m Sarah - nice to meet you!<br/>I’ll be your workout buddy</p>
                                </FieldLabel>
                                <RadioGroupItem value="1" id="sarah"/>
                            </Field>
                        </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious/>
                    <CarouselNext />
                </RadioGroup>
            </Carousel>
        </FieldSet>
    )
}