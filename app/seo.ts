export function getSocialMetas({
  url,
  title = "jcheese",
  description = "this is jcheese's website",
  keywords = "jcheese, website, portfolio, blog, projects, work, experience, skills, about, contact",
  image,
}: {
  image?: string;
  url: string;
  title?: string;
  description?: string;
  keywords?: string;
}) {
  return [
    { title },
    { name: "description", content: description },
    { name: "keywords", content: keywords },
    { name: "image", content: image },
    {
      property: "og:url",
      content: url,
    },
    {
      property: "og:title",
      content: title,
    },
    {
      property: "og:description",
      content: description,
    },
    {
      property: "og:image",
      content: image,
    },
    {
      property: "twitter:card",
      content: image ? "summary_large_image" : "summary",
    },
    {
      property: "twitter:creator",
      content: "@rideswap",
    },
    {
      property: "twitter:site",
      content: "@rideswap",
    },
    {
      property: "twitter:title",
      content: title,
    },
    {
      property: "twitter:description",
      content: description,
    },
    {
      property: "twitter:image",
      content: image,
    },
    {
      property: "twitter:alt",
      content: title,
    },
  ];
}
