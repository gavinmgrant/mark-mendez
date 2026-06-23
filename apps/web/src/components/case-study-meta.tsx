import { formatTourDate } from "@/utils";

interface CaseStudyMetaProps {
  description?: string | null;
  location?: string | null;
  architect?: string | null;
  yearBuilt?: string | null;
  tourDate?: string | null;
}

export function CaseStudyMeta({
  description,
  location,
  architect,
  yearBuilt,
  tourDate,
}: CaseStudyMetaProps) {
  const hasContent =
    description || location || architect || yearBuilt || tourDate;
  if (!hasContent) return null;

  return (
    <div className="space-y-4 text-lg text-muted-foreground">
      {description && <p className="text-base">{description}</p>}
      <div className="flex flex-col gap-y-1 text-sm">
        {location && <span>{location}</span>}
        {architect && <span>Architect: {architect}</span>}
        {yearBuilt && <span>Year built: {yearBuilt}</span>}
        {tourDate && (
          <time dateTime={tourDate}>
            Tour date: {formatTourDate(tourDate)}
          </time>
        )}
      </div>
    </div>
  );
}
