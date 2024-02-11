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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { perInfo, emCon, medAdd, healthHistory, healthhabits, inSur } from "@/redux/inputs/medical-input";
import { createMedical, updateMedical } from "@/redux/api/medicalApi";
import { toast } from "react-toastify";
import { medicalExist, medicalNotExist } from "@/redux/reducer/medicalReducer";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const MedicalInput = () => {

    const navigate = useNavigate();
    const [medicalLoading, setMedicalLoading] = useState<boolean>(false);
    const { user } = useSelector(
        (state: RootState) => state.userReducer
    );

    const { medical } = useSelector(
        (state: RootState) => state.medicalReducer
    );

    const dispatch = useDispatch();

    const form = useForm({
        defaultValues: {
            name: medical?.personalInfo?.name || "",
            birth: medical?.personalInfo.birth || "",
            gender: medical?.personalInfo.gender || "",
            phone: medical?.personalInfo.phone || 91,
            email: medical?.personalInfo.email || "",
            emname: medical?.personalInfo.emergency.name || "",
            emrelation: medical?.personalInfo.emergency.relation || "",
            emphone: medical?.personalInfo.emergency.phone || 91,
            street: medical?.personalInfo.address.street ||"",
            city: medical?.personalInfo.address.city || "",
            state: medical?.personalInfo.address.state || "",
            postal: medical?.personalInfo.address.postalCode || "",
            allergy: medical?.healthHistory.allergy || "",
            chronic: medical?.healthHistory.chronic || "",
            current: medical?.currentMedication || "",
            surgery: medical?.previousSurgeries || "",
            smoker: medical?.healthHabits.smoker || "",
            alcohol: medical?.healthHabits.alcohol || "",
            routine: medical?.healthHabits.exercise || "",
            diet: medical?.healthHabits.diet || "",
            mental: medical?.healthHabits.mentalCondition || "",
            vaccine: medical?.healthHabits.vaccinationHistory || "",
            provider: medical?.insuranceInfo.provider || "",
            policy: medical?.insuranceInfo.policyNumber || 0,
            group: medical?.insuranceInfo.grpNumber || 0,
        }
    });

    const onSubmit = async (values: any) => {
        setMedicalLoading(true);
        const medicalData = {
            personalInfo: {
                name: values.name,
                birth: values.birth,
                gender: values.gender,
                address: {
                    street: values.street,
                    city: values.city,
                    state: values.state,
                    postalCode: values.postal,
                },
                phone: values.phone,
                email: values.email,
                emergency: {
                    name: values.emname,
                    relation: values.emrelation,
                    phone: values.emphone,
                }
            },
            healthHistory: {
                allergy: values.allergy,
                chronic: values.chronic,
            },
            currentMedication: values.current,
            previousSurgeries: values.surgery,
            healthHabits: {
                smoker: values.smoker,
                alcohol: values.alcohol,
                exercise: values.routine,
                diet: values.diet,
                mentalCondition: values.mental,
                vaccinationHistory: values.vaccine,
            },
            insuranceInfo: {
                provider: values.provider,
                policyNumber: values.policy,
                grpNumber: values.group
            },
            user: user?._id,
        }
        try {
            if (medical) {
                const data = await updateMedical(medicalData, medical._id);
                dispatch(medicalExist(data.medical));
                toast.success("Medical VCards updated!");
            } else {
                const data = await createMedical(medicalData);
                dispatch(medicalExist(data.medical));
                toast.success("Medical VCards created!");
            }
            navigate(-1);
        } catch (error: any) {
            dispatch(medicalNotExist());
            toast.error(error.response.data.message);
        }
        setMedicalLoading(false);
    }

    return (
        <div className="flex flex-col justify-center items-center my-8">
            <h1 className="text-3xl font-semibold">{medical ? "Update" : "Create"} Medical VCard</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-8">
                        <h1 className="text-2xl text-center font-semibold mb-4">Medical VCard</h1>
                        <div className="space-y-2">
                            {perInfo.map((pIn, index) => (
                                <FormField key={index} control={form.control}
                                    name={pIn.name}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{pIn.label}</FormLabel>
                                            <FormControl>
                                                <Input className="w-[350px]" placeholder={pIn.text} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>
                        <div className="space-y-1">
                            <h1 className="font-semibold mt-4">Emergency Contact</h1>
                            {emCon.map((em, index) => (
                                <FormField key={index} control={form.control}
                                    name={em.name}
                                    render={({ field }) => (
                                        <FormItem className="flex items-center gap-2 w-350px">
                                            <FormLabel>{em.label}</FormLabel>
                                            <FormControl>
                                                <Input placeholder={em.text} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>
                        <div className="space-y-1">
                            <h1 className="font-semibold mt-4">Address</h1>
                            {medAdd.map((em, index) => (
                                <FormField key={index} control={form.control}
                                    name={em.name}
                                    render={({ field }) => (
                                        <FormItem className="flex items-center gap-2 w-350px">
                                            <FormLabel>{em.label}</FormLabel>
                                            <FormControl>
                                                <Input placeholder={em.text} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>

                        {healthHistory.map((sele, index) => (
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

                        <FormField control={form.control}
                            name="current"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Current Medications</FormLabel>
                                    <FormControl>
                                        <Input className="w-[350px]" placeholder="Current Medications" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField control={form.control}
                            name="surgery"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Previous Surgeries</FormLabel>
                                    <FormControl>
                                        <Input className="w-[350px]" placeholder="Previous Surgeries" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {healthhabits.map((sele, index) => (
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

                        <div className="space-y-1">
                            <h1 className="font-semibold mt-4">Insurance Information</h1>
                            {inSur.map((em, index) => (
                                <FormField key={index} control={form.control}
                                    name={em.name}
                                    render={({ field }) => (
                                        <FormItem className="flex items-center gap-2 w-350px">
                                            <FormLabel>{em.label}</FormLabel>
                                            <FormControl>
                                                <Input placeholder={em.text} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>


                    </div>
                    <Button type="submit" className="w-[350px]" disabled={medicalLoading}>{medicalLoading ? "Saving..." : "Save"}</Button>
                </form>   
            </Form>
        </div>
    )
}

export default MedicalInput;