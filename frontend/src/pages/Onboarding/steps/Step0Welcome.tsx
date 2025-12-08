import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel";
import {Field, FieldDescription, FieldLabel, FieldLegend, FieldSet} from "@/components/ui/field";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import tomImage from '@/assets/onboarding_welcome/onboarding-tom.png';
import sarahImage from '@/assets/onboarding_welcome/onboarding-sarah.png';
import {Controller, useFormContext} from "react-hook-form";
import type {Inputs} from "@/pages/Onboarding/OnboardingManager";

export default function Step0Welcome() {
    const { control, trigger } = useFormContext<Inputs>();
    return (
        <FieldSet className="w-[60vw] lg:w-[30vw] lg:ml-[30vw]">
            <FieldLegend>Hello!</FieldLegend>
            <FieldDescription>
                Pick who you'd like to work out with!
            </FieldDescription>
            <Carousel className="w-[60vw] ml-[10vw] md:ml-[20vw] lg:ml-[0vw] max-w-xs">
                <Controller control={control} name="strTrainer" defaultValue="0" rules={{onChange: () => trigger("strTrainer"), required: "Trainer is required" }}
                    render={({ field }) => (
                        <RadioGroup value={field.value} onValueChange={field.onChange} className="flex flex-row items-center">
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
                    )}
                />
            </Carousel>
        </FieldSet>
    )
}