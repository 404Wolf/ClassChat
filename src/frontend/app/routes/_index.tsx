import type { MetaFunction } from "@remix-run/node";
import metadata from "~/meta"
import client from "~/trpc"
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: metadata.name },
    { name: "description", content: metadata.description },
  ];
};

export async function loader() {
  const hello = await client.hello.query('Hono')
  return hello
}

export default function Index() {
const data = useLoaderData();

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-16">
        {data}
      </div>
    </div>
  );
}

