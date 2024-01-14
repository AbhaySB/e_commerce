import { useSession } from "next-auth/react";

import Layout from "@/components/Layout";

export default function Home() {
  const { data: session } = useSession();

  return <Layout>
    <div className="text-blue-900 flex justify-between">

      <h1>Hello <b>{session?.user?.name}</b></h1>

      <div className="flex bg-gray-300 gap-2 p-1 rounded-lg">
        <img src={session?.user?.image} alt="No Img" className="w-9 h-9 rounded-lg" />
        <h3 className="mt-1">{session?.user?.name}</h3>
      </div>

    </div>

  </Layout>
}