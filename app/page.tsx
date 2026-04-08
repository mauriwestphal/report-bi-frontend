import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { TOKEN_COOKIE_NAME } from '@/lib/constants';

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;
  
  if (token) {
    // User is authenticated, redirect to dashboard
    redirect("/"); // This will go to (protected) page
  } else {
    // User is not authenticated, redirect to auth
    redirect("/auth");
  }
}
