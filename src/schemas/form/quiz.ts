import {z} from 'zod' 

export const quizCreationSchema = z.object ({
    topic: z.string().min(4, "Topic must be atleast 4 charecters long"),
    type: z.enum(["mcq", "open_ended"]),
    amount: z.number().min(1).max(10),
})