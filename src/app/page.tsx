import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Card";
import SignInButton from "@/components/SignInButton";
import { getAuthSession } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getAuthSession()
  if (session?.user){
    //session?.user only exists when user is logged in.
    //Therefore, when the user is logged in, it wont show you the sign-in page anymore.
    return redirect("/dashboard");
  }
  return(
    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
      <Card className="w-[300px]">
        <CardHeader>
          <CardTitle> Welcome to Quizzle</CardTitle>
          <CardDescription>
          Quizzle is your go-to platform for interactive quizzes, combining the power of AI to create a personalized learning experience. Whether you’re testing your knowledge, preparing for an exam, or just having fun, Quizzle offers a wide range of quiz topics and dynamically generated questions. Dive into a fun and engaging way to sharpen your skills, track your progress, and challenge yourself with quizzes that adapt to your level. Start quizzing today!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInButton text="Sign in with Google!" />
        </CardContent>
      </Card>
    </div>

  )

}
