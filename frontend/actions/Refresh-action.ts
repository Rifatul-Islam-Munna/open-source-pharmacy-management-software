"use server"
import { updateTag,revalidateTag } from "next/cache";

export const revlidateGlobalMedicin = async () => {
    return updateTag("all-medicines");
};
