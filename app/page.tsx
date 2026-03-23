import { getPage } from "@/lib/strapi";
import PageBuilder from "@/components/PageBuilder";

export default async function Home() {
  const page = await getPage("home");
  if (!page) return null;
  return <PageBuilder sections={page.sections} />;
}
