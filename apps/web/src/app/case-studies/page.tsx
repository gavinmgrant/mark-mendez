import {
  CaseStudyCard,
  CaseStudyHeader,
  FeaturedCaseStudyCard,
  type CaseStudy,
} from "@/components/case-study-card";
import { PageBuilder } from "@/components/pagebuilder";
import { sanityFetch } from "@/lib/sanity/live";
import { queryCaseStudyIndexPageData } from "@/lib/sanity/query";
import { getMetaData } from "@/lib/seo";

export const revalidate = 3600;

async function fetchCaseStudyIndexData() {
  return await sanityFetch({
    query: queryCaseStudyIndexPageData,
    tags: ["caseStudyIndex", "caseStudies"],
  });
}

export async function generateMetadata() {
  const { data } = await fetchCaseStudyIndexData();
  if (!data) return getMetaData({});
  return getMetaData(data);
}

export default async function CaseStudiesIndexPage() {
  const { data } = await fetchCaseStudyIndexData();
  if (!data) return null;

  const {
    title,
    description,
    pageBuilder,
    featuredCaseStudies,
    allCaseStudies,
    _id,
    _type,
  } = data ?? {};

  const featured = featuredCaseStudies?.[0];
  const rest = featuredCaseStudies?.slice(1) ?? [];
  const featuredIds = new Set(
    (featuredCaseStudies ?? []).map((c: CaseStudy) => c?._id).filter(Boolean)
  );
  const others = (allCaseStudies ?? []).filter(
    (c: CaseStudy) => c?._id && !featuredIds.has(c._id)
  );
  const list = [...rest, ...others];
  const gridList =
    list.length > 0 ? list : (featuredCaseStudies ?? []);

  return (
    <main>
      <div className="my-4 lg:my-10 px-4 md:px-6">
        <CaseStudyHeader title={title} description={description} />
        <div className="mx-auto mt-6 space-y-12 lg:space-y-20">
          {featured && (
            <div className="w-full">
              <FeaturedCaseStudyCard caseStudy={featured} />
            </div>
          )}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {gridList.map((caseStudy: CaseStudy, index: number) => (
              <CaseStudyCard
                key={`${caseStudy?._id}-${index}`}
                caseStudy={caseStudy}
              />
            ))}
          </div>
        </div>
      </div>
      <PageBuilder pageBuilder={pageBuilder ?? []} id={_id} type={_type} />
    </main>
  );
}
