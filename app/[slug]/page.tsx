import { getPage } from "../../lib/strapi";
import PageBuilder from "../../components/PageBuilder";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  return {
    title: page?.seo_title || page?.title || slug,
    description: page?.seo_description,
  };
}

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) notFound();
  return <PageBuilder sections={page.sections} />;
}
