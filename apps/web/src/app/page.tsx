import { PageBuilder } from "@/components/pagebuilder";
import { sanityFetch } from "@/lib/sanity/live";
import { queryHomePageData } from "@/lib/sanity/query";
import { getMetaData } from "@/lib/seo";

// Revalidate home page every hour (ISR - Incremental Static Regeneration)
export const revalidate = 3600;

async function fetchHomePageData() {
  return await sanityFetch({
    query: queryHomePageData,
    // Add revalidation tag for cache invalidation
    tags: ["homePage"],
  });
}

export async function generateMetadata() {
  const homePageData = await fetchHomePageData();
  if (!homePageData.data) {
    return getMetaData({});
  }
  return getMetaData(homePageData.data);
}

export default async function Page() {
  const { data: homePageData } = await fetchHomePageData();

  if (!homePageData) {
    return <div>No home page data</div>;
  }

  const { _id, _type, pageBuilder } = homePageData ?? {};

  return <PageBuilder pageBuilder={pageBuilder ?? []} id={_id} type={_type} />;
}
