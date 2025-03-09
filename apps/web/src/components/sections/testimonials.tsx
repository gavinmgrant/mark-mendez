import type { PagebuilderType } from "@/types";

// import { RichText } from "../richtext";

type TestimonialsProps = PagebuilderType<"testimonials">;

export function Testimonials({ title, testimonials }: TestimonialsProps) {
  return (
    <section>
      <h1>{title}</h1>
      <div>
        {testimonials?.map((testimonial) => (
          <div key={testimonial?._key}>
            {/* <h2>{testimonial?.title}</h2>
            <RichText
              richText={testimonial?.richText ?? []}
              className="text-sm md:text-base"
            /> */}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;
