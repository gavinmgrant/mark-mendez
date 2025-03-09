import type { PagebuilderType } from "@/types";

type PropertiesProps = PagebuilderType<"properties">;

export function Properties({ title }: PropertiesProps) {
  return (
    <section id="properties">
      <div className="container mx-auto px-4 md:px-6 space-y-6 text-center">
        <h1 className="text-4xl lg:text-5xl font-semibold">{title}</h1>
        <iframe
          src="https://www.compass.com/c/mark-mendez/architecture-for-sale?agent_id=5791082452f6eb36de5090f3"
          width="100%"
          height="1600px"
          style={{ border: "none" }}
        ></iframe>
      </div>
    </section>
  );
}

export default Properties;
