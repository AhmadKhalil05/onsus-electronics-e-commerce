import Context from "@/context/Context";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { CatalogProvider } from "@/context/CatalogContext";

import "photoswipe/dist/photoswipe.css";

import "../public/scss/main.scss";
import { useEffect } from "react";
import WOW from "@/utlis/wow";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import Cart from "@/components/modals/Cart";
import Login from "@/components/modals/Login";
import Register from "@/components/modals/Register";
import ScrollTop from "@/components/common/ScrollTop";
import Quickview from "@/components/modals/Quickview";
import MobileMenu from "@/components/modals/MobileMenu";
import Search from "@/components/modals/Search";
import AddParallax from "@/utlis/AddParallax";
import HomePage from "./pages/page";
import ShopDefaultPage from "./pages/shop/shop-default";
import ShopCartPage from "./pages/products/shop-cart";
import WishlistPage from "./pages/products/wishlist";
import CheckoutPage from "./pages/products/checkout";
import ProductDetailPage from "./pages/product-detail/product-detail";
import ContactPage from "./pages/other-pages/contact";
import NotFoundPage from "./pages/other-pages/404";
import ScrollTopBehaviour from "./components/common/ScrollToTopBehaviour";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import OrderSuccessPage from "./pages/order-success";
import RequireAdmin from "./pages/admin/RequireAdmin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminContactsPage from "./pages/admin/AdminContactsPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";

function StorefrontShell() {
  return (
    <Context>
      <div id="wrapper">
        <Outlet />
        <Login />
        <Register />
        <Cart />
        <Quickview />
        <MobileMenu />
        <ScrollTop />
        <Search />
        <AddParallax />
        <ScrollTopBehaviour />
      </div>
    </Context>
  );
}

function App() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("bootstrap/dist/js/bootstrap.esm").then(() => {});
    }
  }, []);

  useEffect(() => {
    if (isAdmin) return;
    let lastScrollTop = 0;
    const delta = 5;
    let navbarHeight = 0;
    let didScroll = false;
    const header = document.querySelector("header");

    const handleScroll = () => {
      didScroll = true;
    };

    const checkScroll = () => {
      if (didScroll && header) {
        const st = window.scrollY || document.documentElement.scrollTop;
        navbarHeight = header.offsetHeight;

        if (st > navbarHeight) {
          if (st > lastScrollTop + delta) {
            header.style.top = `-${navbarHeight}px`;
          } else if (st < lastScrollTop - delta) {
            header.style.top = "0";
            header.classList.add("header-bg");
          }
        } else {
          header.style.top = "";
          header.classList.remove("header-bg");
        }

        lastScrollTop = st;
        didScroll = false;
      }
    };

    if (header) {
      navbarHeight = header.offsetHeight;
    }

    window.addEventListener("scroll", handleScroll);
    const scrollInterval = setInterval(checkScroll, 250);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(scrollInterval);
    };
  }, [pathname, isAdmin]);

  useEffect(() => {
    import("bootstrap")
      .then((bootstrap) => {
        const modalElements = document.querySelectorAll(".modal.show");
        modalElements.forEach((modal) => {
          const modalInstance = bootstrap.Modal.getInstance(modal);
          if (modalInstance) {
            modalInstance.hide();
          }
        });

        const offcanvasElements = document.querySelectorAll(".offcanvas.show");
        offcanvasElements.forEach((offcanvas) => {
          const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvas);
          if (offcanvasInstance) {
            offcanvasInstance.hide();
          }
        });
      })
      .catch((error) => {
        console.error("Error loading Bootstrap:", error);
      });
  }, [pathname]);

  useEffect(() => {
    if (isAdmin) return;
    const wow = new WOW({
      mobile: false,
      live: false,
    });
    wow.init();
  }, [pathname, isAdmin]);

  return (
    <CatalogProvider>
      <AdminAuthProvider>
        <Routes>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<RequireAdmin />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
               <Route path="products" element={<AdminProductsPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="contacts" element={<AdminContactsPage />} />
            </Route>
          </Route>

          <Route path="/" element={<StorefrontShell />}>
            <Route index element={<HomePage />} />
            <Route path="products" element={<ShopDefaultPage />} />
            <Route path="cart" element={<ShopCartPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="order-success" element={<OrderSuccessPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route
              path="product-detail/:id"
              element={<ProductDetailPage />}
            />
            <Route
              path="shop-default"
              element={<Navigate to="/products" replace />}
            />
            <Route
              path="shop-cart"
              element={<Navigate to="/cart" replace />}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AdminAuthProvider>
    </CatalogProvider>
  );
}

export default App;
