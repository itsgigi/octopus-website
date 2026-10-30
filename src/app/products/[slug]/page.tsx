import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FeatureBento } from "@/components/product/FeatureBento";
import { Downloads } from "@/components/product/Downloads";
import { ProductInfo } from "@/components/product/ProductInfo";
import { SpecsAccordion } from "@/components/product/SpecsAccordion";
import { StickyCta } from "@/components/product/StickyCta";
import { ProductCarousel } from "@/components/sections/ProductCarousel";
import { Container } from "@/components/ui/Container";
import { ProductImage } from "@/components/ui/ProductImage";
import { VisuallyHidden } from "@/components/ui/VisuallyHidden";
import { getNavigation } from "@/lib/data/navigation";
import { getBestSellers, getProduct, getProducts } from "@/lib/data/products";

export async function generateStaticParams() {
  return (await getProducts()).map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  if (!product) return {};
  const description = product.description ?? product.shortDescription;
  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
      type: "website",
      images: product.image.src ? [{ url: product.image.src, alt: product.image.alt }] : undefined,
    },
  };
}

/**
 * PDP. One grid, three arrangements:
 * mobile  = main image → info → gallery;  tablet = info → main image → gallery;
 * desktop = gallery column (709) + sticky info column (555), gap 80.
 */
export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const product = await getProduct((await params).slug);
  if (!product) notFound();

  const [{ cta }, bestSellers] = await Promise.all([getNavigation(), getBestSellers(product.slug)]);
  const [lifestyleA, lifestyleB] = product.lifestyleImages;

  return (
    <>
      <Container className="grid gap-y-10 pt-24 md:gap-y-16 md:pt-32 lg:grid-cols-[minmax(0,709fr)_minmax(0,555fr)] lg:gap-x-20 lg:gap-y-20 lg:pt-30">
        <div className="order-1 md:order-2 lg:order-none lg:col-start-1 lg:row-start-1">
          <ProductImage
            src={product.image.src}
            alt={product.image.alt}
            aspect="pdp-product"
            fit="contain"
            priority
            sizes="(min-width: 1200px) 709px, 100vw"
          />
        </div>

        <div className="order-2 md:order-1 lg:order-none lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <ProductInfo product={product} cta={cta} />
        </div>

        <div className="order-3 flex flex-col gap-10 md:gap-16 lg:order-none lg:col-start-1 lg:row-start-2 lg:gap-20">
          {lifestyleA ? (
            <ProductImage
              src={lifestyleA.src}
              alt={lifestyleA.alt}
              aspect="pdp-lifestyle"
              sizes="(min-width: 1200px) 709px, 100vw"
            />
          ) : null}
          <FeatureBento features={product.features} />
          {lifestyleB ? (
            <ProductImage
              src={lifestyleB.src}
              alt={lifestyleB.alt}
              aspect="pdp-lifestyle"
              sizes="(min-width: 1200px) 709px, 100vw"
            />
          ) : null}
          {product.specs.length > 0 || product.downloads.length > 0 ? (
            <section aria-labelledby="details-title" className="flex flex-col gap-4">
              <VisuallyHidden>
                <h2 id="details-title">Product details</h2>
              </VisuallyHidden>
              <SpecsAccordion specs={product.specs} />
              <Downloads downloads={product.downloads} />
            </section>
          ) : null}
        </div>
      </Container>

      <ProductCarousel id="best-sellers" title="Best sellers" products={bestSellers} />
      <StickyCta cta={cta} />
    </>
  );
}
