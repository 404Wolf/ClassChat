import { LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import { v4 as uuidv4 } from 'uuid';
import metadata from "~/meta";

export const loader: LoaderFunction = () => {
  const randomClassId = uuidv4();
  return redirect(`/classes/${randomClassId}`);
};

export const meta: MetaFunction = () => {
  return [
    { title: metadata.name },
    { name: "description", content: metadata.description },
  ];
};
