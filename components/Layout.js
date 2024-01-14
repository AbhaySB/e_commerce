import { useSession, signIn, signOut } from "next-auth/react"

import Nav from "@/components/Nav";

export default function Layout({children}) {
  const { data: session } = useSession() 
     
  if (!session) {

    return (
      <div className={"bg-blue-500 w-screen h-screen flex items-center"}>
        <div className={"text-center w-full"}>
          <button onClick={() => signIn("google")} className={"bg-white rounded-lg p-2 border-2 border-blue-800 hover:ease-in duration-200 hover:bg-purple-600 hover:text-white"}>Login with Google</button>
        </div>
      </div>
    )
  }
  return (
    <div className={"bg-blue-800 h-screen w-screen flex"}>
      <Nav/>
      <div className="bg-white flex-grow mt-2 mb-2 mr-2 rounded-lg p-4">{children}</div>
    </div>
    
  );
}