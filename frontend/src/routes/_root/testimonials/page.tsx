import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useGetReviews } from "@/lib/react-query/queries";
import { IUser, Review } from "@/types";
import { Loader2 } from "lucide-react";

const reviews = [
  {
    user: {
      name: "Shani Ron",
    },
    rating: 5,
    comment:
      "I love shopping at this store! Their eco-friendly products have made it easy for me to reduce my carbon footprint and live a more sustainable lifestyle.",
  },
  {
    user: { name: "Roni Abadi" },
    rating: 5,

    comment:
      "I'm so happy I discovered this store! Their selection of eco-friendly products has helped me make a positive impact on the planet.",
  },
  {
    user: { name: "Liron Shemtov" },
    rating: 5,
    comment:
      "This store is a hidden gem for sustainable living. Their products are not only good for the environment but also high quality.",
  },
];

export default function TestimonialsPage() {
  const { data: testimonials, isFetching } = useGetReviews();

  console.log(testimonials);

  if (isFetching)
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );

  return (
    <main>
      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                What Our <span className="text-green-600">Customers</span> Say
              </h2>
              <p className="text-muted-foreground mt-4 max-w-[700px] md:text-xl/relaxed">
                Hear from our customers about how our eco-friendly products have
                helped them live a more sustainable lifestyle.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {reviews.map((review, idx) => (
                <ReviewCard key={idx} review={review} />
              ))}
              {testimonials?.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function ReviewCard({
  review,
}: {
  review:
    | (Review & { user: IUser })
    | {
        user: {
          name: string;
        };
        rating: number;
        comment: string;
      };
}) {
  return (
    <Card className="pt-4">
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Avatar className="cursor-pointer">
            <AvatarImage
              src={`https://avatar.vercel.sh/vercel.svg?text=${review.user.name[0]?.toUpperCase()}`}
              alt={review.user.name}
              className="rounded-full"
            />
            <AvatarFallback className="cursor-pointer">
              {review.user.name[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium">{review.user.name}</h4>
          </div>
        </div>
        <blockquote className="text-muted-foreground">
          {`"${review.comment}"`}
        </blockquote>
      </CardContent>
    </Card>
  );
}
