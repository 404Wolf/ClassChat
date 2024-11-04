import { LoaderFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

type LoaderData = {
  message: string;
};

export const loader: LoaderFunction = async () => {
  return json<LoaderData>({ message: "Welcome to Remix!" });
};

export default function Index() {
  const data = useLoaderData<LoaderData>();

  return (
    <div>
      <h1>{data.message}</h1>
      <p>Remix root</p>
    </div>
  );
}   
