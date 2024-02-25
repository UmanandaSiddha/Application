import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { phNum, emailAdd, homeTown, motto, seleInp, seloInp, textAr } from "@/redux/inputs/personal-inputs";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { creatorInput } from "@/types/form-inputs";
import { createPersonal, updatePersonal } from "@/redux/api/personalApi";
import { personalNotTemp, personalTemp } from "@/redux/reducer/personalReducer";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { SinglePersonalResponse } from "@/types/api-types";

const InputVCard = () => {

    const navigate = useNavigate();
    const [search] = useSearchParams();
    const id = search.get("personalId");

    const [isPersonal, setIsPersonal] = useState<boolean>(id ? true : false);
    const [personalLoading, setPersonalLoading] = useState<boolean>(false);

    const { user, isPaid } = useSelector(
        (state: RootState) => state.userReducer
    );

    const { personal } = useSelector(
        (state: RootState) => state.personalReducer
    );

    const dispatch = useDispatch();

    const [arrData, setArrData] = useState<any | null>(personal ? personal?.socialMedia :  creatorInput);
    const [open, setOpen] = useState(false);
    const [otherName, setOtherName] = useState("");
    const [otherLink, setOtherLink] = useState("");

    const gotPersonal = async () => {
        if (id) {
            try {
                const { data }: { data: SinglePersonalResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/personal/detailed/${id!}`, { withCredentials: true });
                dispatch(personalTemp(data.personal));
                setIsPersonal(true);
            } catch (error: any) {
                toast.error(error.response.data.message);
                dispatch(personalNotTemp());
            }
        }
    }

    useEffect(() => {
        gotPersonal();
    }, []);

    const handleAdd = () => {
        setArrData([...arrData, {
            name: otherLink,
            label: otherName,
            text: "",
        }]);
        setOpen(false);
    }

    const handleChange = (event: any, index: number) => {
        let data = [...arrData];
        data[index][event.target.name] = event.target.value;
        setArrData(data)
    }

    const form = useForm({
        defaultValues: {
            name: personal?.name || "",
            mobilephone: personal?.contactInfo.phoneNumber.mobile || 91,
            homephone: personal?.contactInfo.phoneNumber.home || 91,
            workphone: personal?.contactInfo.phoneNumber.work || 91,
            otherphone: personal?.contactInfo.phoneNumber.other || 91,
            personalemail: personal?.contactInfo.emailAddress.personal || "",
            workemail: personal?.contactInfo.emailAddress.work || "",
            otheremail: personal?.contactInfo.emailAddress.other || "",
            aboutme: personal?.aboutMe.aboutme || "",
            dob: personal?.aboutMe.birth || "",
            hometown: personal?.aboutMe.homeTown || "",
            currentcity: personal?.aboutMe.currentCity || "",
            languages: personal?.preferences.languages || "",
            favmusic: personal?.preferences.favmusic || "",
            favcolor: personal?.preferences.favcolor || "",
            favcity: personal?.preferences.favcity || "",
            dreamtravel: personal?.preferences.dreamtravel || "",
            favseason: personal?.preferences.favseason || "",
            uniqueskills: personal?.preferences.uniqueSkills || "",
            favcuisine: personal?.preferences.favcuisine || "",
            prefbeve: personal?.preferences.prefbeve || "",
            prefmode: personal?.lifeStyle.prefmode || "",
            petlover: personal?.lifeStyle.petlover || "",
            party: personal?.lifeStyle.party || "",
            smoker: personal?.lifeStyle.smoker || "",
            martial: personal?.lifeStyle.marital || "",
            relation: personal?.lifeStyle.relation || "",
            fitness: personal?.lifeStyle.fitnessRoutine || "",
            morning: personal?.lifeStyle.morning || "",
            health: personal?.lifeStyle.health || "",
            sleeping: personal?.lifeStyle.sleeping || "",
            genre: personal?.lifeStyle.genre || "",
            outdoor: personal?.lifeStyle.outdoor || "",
            artistic: personal?.lifeStyle.artistic || "",
            gamingpref: personal?.lifeStyle.gamingpref || "",
            collecting: personal?.lifeStyle.collecting || "",
            coffee: personal?.lifeStyle.coffee || "",
            cooking: personal?.lifeStyle.cookingSkills || "",
            spiritual: personal?.lifeStyle.spiritual || "",
            corevalue: personal?.lifeStyle.core || "",
            philosophy: personal?.lifeStyle.philosophy || "",
            environment: personal?.lifeStyle.socialCause || "",
            inspirationalmotto: personal?.preferences.quotes.inspirational || "",
            funnymotto: personal?.preferences.quotes.funny || "",
            motivationalmotto: personal?.preferences.quotes.motivational || "",
            othermotto: personal?.preferences.quotes.othermotto || "",
            global: personal?.beliefs.global || "",
            weirdbelief: personal?.beliefs.weirdbelief || "",
            occupation: personal?.professional.occupation || "",
            aspiration: personal?.professional.aspiration || "",
            background: personal?.professional.education || "",
            expertise: personal?.professional.skills || "",
            anyother: personal?.additional.otherInterests || "",
            futuregoal: personal?.additional.futureGoals || "",
            learning: personal?.additional.current || "",
            experience: personal?.additional.unusualExperinece || "",
            habit: personal?.additional.strangeHabits || "",
        },
    });

    const onSubmit = async (values: any) => {
        setPersonalLoading(true);
        let final = [];
        for (let i = 0; i < arrData.length; i++) {
            const element = {
                label: arrData[i].label,
                name: arrData[i].name
            }
            final.push(element);
        }
        const personalData = {
            name: values.name,
            contactInfo: {
                phoneNumber: {
                    mobile: values.mobilephone,
                    home: values.homephone,
                    work: values.workphone,
                    other: values.otherphone,
                },
                emailAddress: {
                    personal: values.personalemail,
                    work: values.workemail,
                    other: values.otheremail,
                }
            },
            socialMedia: final,
            aboutMe: {
                aboutme: values.aboutme,
                birth: values.dob,
                homeTown: values.hometown,
                currentCity: values.currentcity,
            },
            preferences: {
                languages: values.languages,
                music: values.favmusic,
                color: values.favcolor,
                city: values.favcity,
                travelDestination: values.dreamtravel,
                season: values.favseason,
                uniqueSkills: values.uniqueskills,
                cuisine: values.favcuisine,
                beverage: values.prefbeve,
                quotes: {
                    inspirational: values.inspirationalmotto,
                    funny: values.funnymotto,
                    motivational: values.motivationalmotto,
                    other: values.othermotto,
                },
            },
            lifeStyle :{
                travelMode: values.prefmode,
                petLover: values.petlover,
                partyEnthusiast: values.party,
                smoker: values.smoker,
                maritalStatus: values.martial,
                relationshipStatus: values.relation,
                fitnessRoutine: values.fitness,
                morningPerson: values.morning,
                diet: values.health,
                sleepingHabit: values.sleeping,
                genre: values.genre,
                sports: values.outdoor,
                artistisPursuits: values.artistic,
                gaming: values.gamingpref,
                collectignHobby: values.collecting,
                coffee: values.coffee,
                cookingSkills: values.cooking,
                spiritual: values.spiritual,
                core: values.corevalue,
                philosophy: values.philosophy,
                socialCause: values.environment,
            },
            beliefs: {
                globalIssues: values.global,
                weirdBelief: values.weirdbelief,
            },        
            professional: {
                currentOcupation: values.occupation,
                careerAspiation: values.aspiration,
                education: values.background,
                skills: values.expertise,
            },
            additional: {
                otherInterests: values.anyother,
                futureGoals: values.futuregoal,
                current: values.learning,
                unusualExperinece: values.experience,
                strangeHabits: values.habit,
            },
            user: user?._id,
        }
        console.log(personalData)
        try {
            if (isPersonal) {
                await updatePersonal(personalData, id!);
                toast.success("Personal VCards updated!");
            } else {
                await createPersonal(personalData);
                toast.success("Personal VCards created!");
            }
            if (isPaid) {
                navigate(-1);
            } else {
                navigate("/plans");
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
            if (!isPaid) {
                navigate("/plans");
            }
        }
        setPersonalLoading(false);
    }

    return (
        <div className="flex flex-col justify-center items-center my-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    <FormField control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input className="w-[350px]" placeholder="Enter your name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="space-y-8">
                        <div className="space-y-2">
                            <h1 className="font-semibold">Phone Number</h1>
                            {phNum.map((ph, index) => (
                                <FormField key={index} control={form.control}
                                    name={ph.name}
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex w-[350px] justify-center items-center gap-2">
                                                <FormLabel>{ph.label}</FormLabel>
                                                <FormControl>
                                                    <Input placeholder={ph.text} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>

                        <div className="space-y-2">
                            <h1 className="font-semibold">Email Address</h1>
                            {emailAdd.map((emAdd, index) => (
                                <FormField key={index} control={form.control}
                                    name={emAdd.name}
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex w-[350px] justify-center items-center gap-2">
                                                <FormLabel>{emAdd.label}</FormLabel>
                                                <FormControl>
                                                    <Input placeholder={emAdd.text} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>
                    </div>

                    <FormField
                        control={form.control}
                        name="aboutme"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>About Me</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Tell us a little bit about yourself"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex flex-col space-y-2">
                        <h1 className="font-semibold">Social Media Profiles</h1>
                        {arrData && (
                            <div className="flex flex-col space-y-2">
                                {arrData.map((arr: any, index: number) => (
                                    <div key={index} className="flex w-[350px] justify-center items-center gap-2">
                                        <Label>{arr.label}</Label>
                                        <Input
                                            name="name"
                                            value={arr.name}
                                            onChange={(e) => handleChange(e, index)}
                                            placeholder={arr.text}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button variant="secondary" className="w-[350px] my-4">Add more</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Add Another Social Profile</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">
                                            Name
                                        </Label>
                                        <Input
                                            id="name"
                                            value={otherName}
                                            onChange={(e) => setOtherName(e.target.value)}
                                            placeholder="Enter Social Media Platform"
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="link" className="text-right">
                                            Link
                                        </Label>
                                        <Input
                                            id="link"
                                            value={otherLink}
                                            onChange={(e) => setOtherLink(e.target.value)}
                                            placeholder="Enter Social Media Link"
                                            className="col-span-3"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleAdd} type="submit">Add</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <FormField
                        control={form.control}
                        name="dob"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date Of Birth</FormLabel>
                                <FormControl>
                                    <Input className="w-[350px]" placeholder="Enter Your date of birth" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {homeTown.map((hm, index) => (
                        <FormField key={index} control={form.control}
                            name={hm.name}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{hm.label}</FormLabel>
                                    <FormControl>
                                        <Input className="w-[350px]" placeholder={hm.text} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}  

                    <div className="space-y-2">
                        <h1 className="font-semibold">Favorite Quotes/Mottos</h1>
                        {motto.map((mot, index) => (
                            <FormField key={index} control={form.control}
                                name={mot.name}
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex w-[350px] justify-center items-center gap-2">
                                            <FormLabel>{mot.label}</FormLabel>
                                            <FormControl>
                                                <Input placeholder={mot.text} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                        ))}
                    </div>

                    {seleInp.map((sele, index) => (
                        <FormField
                            key={index}
                            control={form.control}
                            name={sele.name}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{sele.label}</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl className="w-[350px]">
                                            <SelectTrigger>
                                                <SelectValue placeholder={sele.text} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {sele.options.map((option, index: number) => (
                                                <SelectItem key={index} value={option}>{option}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}

                    <FormField
                        control={form.control}
                        name="global"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Opinions on Global Issues</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Opinions on Global Issues"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="weirdbelief"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Weirdest or Uncommon Belief I Hold</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Weirdest or Uncommon Belief I Hold"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="space-y-3">
                        <h1 className="text-2xl font-semibold pb-1">Professional Details</h1>
                        {seloInp.map((selo, index) => (
                            <FormField
                                key={index}
                                control={form.control}
                                name={selo.name}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{selo.label}</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl className="w-[350px]">
                                                <SelectTrigger>
                                                    <SelectValue placeholder={selo.text} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {selo.options.map((option, index: number) => (
                                                    <SelectItem key={index} value={option}>{option}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}
                    </div>

                    {textAr.map((teAr, index) => (
                        <FormField
                            key={index}
                            control={form.control}
                            name={teAr.name}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{teAr.label}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder={teAr.text}
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}

                    <Button className="w-[350px]" type="submit" disabled={personalLoading}>{personalLoading ? "Saving..." : "Save"}</Button>
                </form>
            </Form>
        </div>
    )
}

export default InputVCard;