import { Quote, Star } from "lucide-react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { RichText } from "../richtext";
import { useTheme } from "next-themes";

type TestimonialsProps = {
  title: string;
  testimonials: {
    title: string;
    richText: any;
  }[];
};

export function Testimonials({ title, testimonials }: TestimonialsProps) {
  const { theme } = useTheme();

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  function Testimonial({ title, richText }: { title: string; richText: any }) {
    return (
      <div key={title} className="p-4">
        <div className="rounded-2xl p-8 bg-gray-50 dark:bg-zinc-900">
          <Quote
            fill={theme === "dark" ? "white" : "black"}
            stroke={theme === "dark" ? "white" : "black"}
            strokeWidth={1}
          />
          <div className="my-2 text-sm leading-6">
            <RichText richText={richText} />
          </div>
          <div className="mt-6 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span>-</span>
              <span className="text-sm">{title}</span>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  fill={theme === "dark" ? "white" : "black"}
                  stroke={theme === "dark" ? "white" : "black"}
                  strokeWidth={1}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center md:my-12 lg:my-16">
      <h2 className="text-3xl font-semibold md:text-4xl lg:text-5xl mb-4">
        {title}
      </h2>
      <div className="flex w-screen flex-col justify-center pb-12 lg:pb-16">
        <Carousel
          swipeable={true}
          draggable={true}
          showDots={false}
          responsive={responsive}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={10000}
          keyBoardControl={true}
          customTransition="transform 1000ms ease-in-out"
          transitionDuration={1000}
          containerClass="flex items-center"
          removeArrowOnDeviceType={["mobile"]}
        >
          {testimonials?.map((testimonial, index) => (
            <Testimonial
              key={index}
              title={testimonial.title}
              richText={testimonial.richText}
            />
          ))}
        </Carousel>
      </div>
    </section>
  );
}

export default Testimonials;
