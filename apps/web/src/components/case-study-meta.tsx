import { formatTourDate } from "@/utils";

interface CaseStudyMetaProps {
  description?: string | null;
  location?: string | null;
  architect?: string | null;
  yearBuilt?: string | null;
  tourDate?: string | null;
  program?: string | null;
  structure?: string | null;
  primaryIdea?: string | null;
}

function MetaLabel({ children }: { children: React.ReactNode }) {
  return <span className="font-medium text-foreground">{children}</span>;
}

export function CaseStudyMeta({
  description,
  location,
  architect,
  yearBuilt,
  tourDate,
  program,
  structure,
  primaryIdea,
}: CaseStudyMetaProps) {
  const hasContent =
    description ||
    location ||
    architect ||
    yearBuilt ||
    tourDate ||
    program ||
    structure ||
    primaryIdea;
  if (!hasContent) return null;

  return (
    <div className="space-y-4 text-lg text-muted-foreground">
      {description && <p className="text-base">{description}</p>}
      <div className="flex flex-col gap-y-1 text-sm">
        {location && <span className="mb-4 block text-foreground">{location}</span>}
        {architect && (
          <span>
            <MetaLabel>Architect:</MetaLabel> {architect}
          </span>
        )}
        {yearBuilt && (
          <span>
            <MetaLabel>Year built:</MetaLabel> {yearBuilt}
          </span>
        )}
        {tourDate && (
          <time dateTime={tourDate}>
            <MetaLabel>Tour date:</MetaLabel> {formatTourDate(tourDate)}
          </time>
        )}
        {program && (
          <span>
            <MetaLabel>Program:</MetaLabel> {program}
          </span>
        )}
        {structure && (
          <span>
            <MetaLabel>Structure:</MetaLabel> {structure}
          </span>
        )}
        {primaryIdea && (
          <span>
            <MetaLabel>Primary idea:</MetaLabel> {primaryIdea}
          </span>
        )}
      </div>
    </div>
  );
}
