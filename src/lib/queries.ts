import { queryOptions } from "@tanstack/react-query";

import {
  getBlogPost,
  getBlogPosts,
  getCareer,
  getCareers,
  getFaqs,
  getProduct,
  getProducts,
  getProject,
  getProjects,
  getService,
  getServices,
  getSiteSettings,
  getTeam,
  getTestimonials,
} from "./content.functions";
import { getProductCategories, getProductDetail } from "./catalog.functions";

export const settingsQuery = queryOptions({
  queryKey: ["site-settings"],
  queryFn: () => getSiteSettings(),
  staleTime: 60_000,
});

export const servicesQuery = queryOptions({
  queryKey: ["services"],
  queryFn: () => getServices(),
  staleTime: 60_000,
});

export const serviceQuery = (slug: string) =>
  queryOptions({
    queryKey: ["service", slug],
    queryFn: () => getService({ data: { slug } }),
    staleTime: 60_000,
  });

export const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: () => getProducts(),
  staleTime: 60_000,
});

export const productQuery = (slug: string) =>
  queryOptions({
    queryKey: ["product", slug],
    queryFn: () => getProduct({ data: { slug } }),
    staleTime: 60_000,
  });

export const projectsQuery = queryOptions({
  queryKey: ["projects"],
  queryFn: () => getProjects(),
  staleTime: 60_000,
});

export const projectQuery = (slug: string) =>
  queryOptions({
    queryKey: ["project", slug],
    queryFn: () => getProject({ data: { slug } }),
    staleTime: 60_000,
  });

export const blogQuery = queryOptions({
  queryKey: ["blog"],
  queryFn: () => getBlogPosts(),
  staleTime: 60_000,
});

export const blogPostQuery = (slug: string) =>
  queryOptions({
    queryKey: ["blog-post", slug],
    queryFn: () => getBlogPost({ data: { slug } }),
    staleTime: 60_000,
  });

export const teamQuery = queryOptions({
  queryKey: ["team"],
  queryFn: () => getTeam(),
  staleTime: 60_000,
});

export const testimonialsQuery = queryOptions({
  queryKey: ["testimonials"],
  queryFn: () => getTestimonials(),
  staleTime: 60_000,
});

export const faqsQuery = queryOptions({
  queryKey: ["faqs"],
  queryFn: () => getFaqs(),
  staleTime: 60_000,
});

export const careersQuery = queryOptions({
  queryKey: ["careers"],
  queryFn: () => getCareers(),
  staleTime: 60_000,
});

export const careerQuery = (slug: string) =>
  queryOptions({
    queryKey: ["career", slug],
    queryFn: () => getCareer({ data: { slug } }),
    staleTime: 60_000,
  });

export const productCategoriesQuery = queryOptions({
  queryKey: ["product-categories"],
  queryFn: () => getProductCategories(),
  staleTime: 60_000,
});

export const productDetailQuery = (slug: string) =>
  queryOptions({
    queryKey: ["product-detail", slug],
    queryFn: () => getProductDetail({ data: { slug } }),
    staleTime: 60_000,
  });
