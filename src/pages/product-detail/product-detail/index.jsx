import BrandsSlider from "@/components/common/BrandsSlider";
import RecentProducts from "@/components/common/RecentProducts";
import Footer1 from "@/components/footers/Footer1";
import Header4 from "@/components/headers/Header4";
import Description from "@/components/product-detail/Description";
import Details1 from "@/components/product-detail/Details1";
import Relatedproducts from "@/components/product-detail/Relatedproducts";
import SimilerProducts from "@/components/product-detail/SimilerProducts";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { useCatalog } from "@/context/CatalogContext";
import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Product Details || Onsus - Multipurpose Reactjs eCommerce Template",
  description: "Onsus - Multipurpose Reactjs eCommerce Template",
};
export default function ProductDetailPage() {
  const params = useParams();
  const rawId = params.id || "";
  let decodedId = rawId;
  try {
    decodedId = decodeURIComponent(rawId);
  } catch {
    decodedId = rawId;
  }
  const { products, getProductById } = useCatalog();

  const product = getProductById(decodedId) || getProductById(rawId) || null;

  if (!product?.id) {
    return (
      <>
        <MetaComponent meta={metadata} />
        <Header4 />
        <div className="container tf-sp-3">
          <p className="body-md-2">
            Product not found.{" "}
            <Link to="/products" className="link text-primary">
              Back to products
            </Link>
          </p>
        </div>
        <Footer1 />
      </>
    );
  }

  return (
    <>
      <MetaComponent meta={metadata} />
      <Header4 />
      <div className="tf-sp-1">
        <div className="container">
          <ul className="breakcrumbs">
            <li>
              <Link to={`/`} className="body-small link">
                {" "}
                Home{" "}
              </Link>
            </li>
            <li className="d-flex align-items-center">
              <i className="icon icon-arrow-right" />
            </li>
            <li>
              <Link to={`/products`} className="body-small link">
                Products
              </Link>
            </li>
            <li className="d-flex align-items-center">
              <i className="icon icon-arrow-right" />
            </li>
            <li>
              <span className="body-small">Product Detail</span>
            </li>
          </ul>
        </div>
      </div>
      <Details1 product={product} />
      <Description />
      <SimilerProducts excludeId={product.id} />
      <Relatedproducts excludeId={product.id} />
      <BrandsSlider />
      <RecentProducts />
      <Footer1 />
    </>
  );
}
