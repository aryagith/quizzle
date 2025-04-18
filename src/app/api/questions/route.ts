import { NextResponse } from 'next/server'
import { quizCreationSchema } from '@/schemas/form/quiz'
import { ZodError } from 'zod'
import { strict_output } from '@/lib/gpt'
import { getAuthSession } from '@/pages/api/auth/[...nextauth]'

// POST /api/questions
export const POST = async (req:Request, res: Response) => {
  try {
    const session = await getAuthSession();
    //  if (!session?.user) {
    //   return NextResponse.json(
    //     { error: "You must be logged in to create a game." },
    //     {
    //       status: 401,
    //     }
    //   );
    // }
    const body = await req.json();
    const {topic, type, amount} = quizCreationSchema.parse(body);
    let questions: any;
    if (type === 'open_ended'){
      questions = await strict_output(
        `You are a helpful AI that is able to generate a pair of question and answers, the length of each answer should not be more than 15 words, store all the pairs of answers and questions in a JSON array. Only generate ${amount} questions.`,
        new Array(amount).fill(
          `You are to generate a random hard open-ended questions about ${topic}`
        ),
        {
          question: "question",
          answer: "answer with max length of 15 words",
        }
      )
    }
    else if(type === 'mcq'){
      questions = await strict_output(
        `You are a quiz creation AI. You are to create MCQ question and answer for a topic given to you. Do not reveal the answer in the options. For example, if the question is "Which dog is the smallest dog in the world?" an option/answer should not be, "The chihuahua is the smallest dog in the world." it should be "Chihuahua". The answer should NOT be the same as any of the other options. Only generate ${amount} questions and it's options at a time.`,
        new Array(amount).fill(
          `You are to generate a random hard mcq question about ${topic}.`
        ),
        {
          question: "question",
          answer: "answer with max length of 15 words",
          option1: "option1 with max length of 15 words",
          option2: "option2 with max length of 15 words",
          option3: "option3 with max length of 15 words",
        }
      );
    }
    return NextResponse.json(
      {
        questions: questions,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    if(error instanceof ZodError){
      return NextResponse.json(
        {
          error: error.issues
        },
        {
          status:400
        }
      )
    }
  }
  
  return NextResponse.json({
    hello: "world"
  })
}