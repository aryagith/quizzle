import { prisma } from "@/lib/db";
import { getAuthSession } from "@/pages/api/auth/[...nextauth]";
import { quizCreationSchema } from "@/schemas/form/quiz";
import { NextResponse } from "next/server";
import { z } from "zod";
import axios from "axios";

export async function POST(req: Request, res: Response) {
    try {
      const session = await getAuthSession();
      if (!session?.user) {
        return NextResponse.json(
          { error: "You must be logged in to create a game." },
          { status: 401 }
        );
      }
  
      const body = await req.json();
      console.log("Request body:", body);
  
      const { topic, type, amount } = quizCreationSchema.parse(body);
      console.log("Parsed data:", { topic, type, amount });
  
      const game = await prisma.game.create({
        data: {
          gameType: type,
          timeStarted: new Date(),
          userId: session.user.id,
          topic,
        },
      });
      console.log("Game created with ID:", game.id);
  
      // await prisma.topic_count.upsert({
      //   where: { topic },
      //   create: { topic, count: 1 },
      //   update: { count: { increment: 1 } },
      // });
      console.log("Topic count upserted for topic:", topic); //logs for debugging

      const { data } = await axios.post(
        `${process.env.API_URL as string}/api/questions`,
        { amount, topic, type }
      );
      console.log("Questions fetched from external API:", data);
  
      if (type === "mcq") {
        const manyData = data.questions.map((question: mcqQuestion) => {
          const options = [
            question.option1,
            question.option2,
            question.option3,
            question.answer,
          ].sort(() => Math.random() - 0.5);
  
          return {
            question: question.question,
            answer: question.answer,
            options: JSON.stringify(options),
            gameId: game.id,
            questionType: "mcq",
          };
        });
  
        await prisma.question.createMany({ data: manyData });
        console.log("MCQ questions inserted into the database");
      } else if (type === "open_ended") {
        await prisma.question.createMany({
          data: data.questions.map((question: openQuestion) => ({
            question: question.question,
            answer: question.answer,
            gameId: game.id,
            questionType: "open_ended",
          })),
        });
        console.log("Open-ended questions inserted into the database");
      }
  
      return NextResponse.json({ gameId: game.id }, { status: 200 });
    } catch (error) {
      console.error("Error in POST /api/game:", error); // Log the error
  
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: error.issues },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          { error: "An unexpected error occurred." },
          { status: 500 }
        );
      }
    }
  }
  