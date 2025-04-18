import z from "zod";
export const signupVal = z.object({
    name: z.string(),
    email:z.string().email(),
    phoneNumber:z.string().min(10),
    password : z.string(),
})

export const signinVal = z.object({
    email:z.string(),
    password : z.string().min(8)
})