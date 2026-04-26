import { ProductsClientPage } from "@/app/products/ProductsClientPage";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const params = await searchParams;

  return (
    <ProductsClientPage
      key={`${params.search ?? ""}:${params.category ?? ""}`}
      initialSearch={params.search ?? ""}
      initialCategory={params.category ?? ""}
    />
  );
}
