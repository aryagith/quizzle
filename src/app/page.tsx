import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Card";
import SignInButton from "@/components/SignInButton";
import { getAuthSession } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await   
 getAuthSession()
  if (session?.user){
    return redirect("/dashboard");
  }
  return(
    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
      <Card className="w-[300px]">   

        <CardHeader>
          <CardTitle>Welcome to Quizzle 🚀</CardTitle>
          <CardDescription>
            Quizzle is an AI-powered quiz platform. Test your knowledge, learn new things, and have fun!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInButton text="Sign in with Google!" />
        </CardContent>
      </Card>
    </div>
  )
}
