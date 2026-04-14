import { showApiError } from "@/api/errors";
import {
  addWishlistItem,
  fetchWishlist,
  removeWishlistItem,
} from "@/api/wishlist";
import { useUserAuth } from "@/context/UserAuthContext";
import { useCatalog } from "@/context/CatalogContext";

import React, { useEffect } from "react";
import { useContext, useState } from "react";
const dataContext = React.createContext();
export const useContextElement = () => {
  return useContext(dataContext);
};

export default function Context({ children }) {
  const { isAuthenticated, isLoading: authLoading, user } = useUserAuth();
  const { products: catalogProducts, getProductById } = useCatalog();
  const [cartProducts, setCartProducts] = useState([]);
  const [wishList, setWishList] = useState([]);
  const [compareItem, setCompareItem] = useState([]);
  const [quickViewItem, setQuickViewItem] = useState(
    () => catalogProducts[0] || {}
  );
  const [quickAddItem, setQuickAddItem] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (!catalogProducts.length) return;
    if (!quickViewItem?.id || !getProductById(quickViewItem.id)) {
      setQuickViewItem(catalogProducts[0]);
    }
  }, [catalogProducts, quickViewItem?.id, getProductById]);
  useEffect(() => {
    const subtotal = cartProducts.reduce((accumulator, product) => {
      return accumulator + product.quantity * product.price;
    }, 0);
    setTotalPrice(subtotal);
  }, [cartProducts]);

  const isAddedToCartProducts = (id) => {
    if (cartProducts.filter((elm) => elm.id == id)[0]) {
      return true;
    }
    return false;
  };
  const addProductToCart = (id, qty, isModal = true) => {
    if (!isAddedToCartProducts(id)) {
      const base = getProductById(id);
      if (!base) return;
      const item = {
        ...base,
        quantity: qty ? qty : 1,
      };
      setCartProducts((pre) => [...pre, item]);
      if (isModal) {
        // openCartModal();
      }
    }
  };

  const updateQuantity = (id, qty) => {
    if (isAddedToCartProducts(id) && qty >= 1) {
      let item = cartProducts.filter((elm) => elm.id == id)[0];
      let items = [...cartProducts];
      const itemIndex = items.indexOf(item);

      item.quantity = qty / 1;
      items[itemIndex] = item;
      setCartProducts(items);
    }
  };

  const wishlistAuthed =
    isAuthenticated && !authLoading && Boolean(user?.userId);

  const addToWishlist = (id) => {
    const idNum = Number(id);
    if (!Number.isFinite(idNum)) return;
    const exists = wishList.some((x) => Number(x) === idNum);

    if (!exists) {
      setWishList((pre) => [...pre, idNum]);
      if (wishlistAuthed) {
        addWishlistItem(idNum).catch((err) => {
          showApiError("Add to wishlist", err);
          setWishList((pre) => pre.filter((x) => Number(x) !== idNum));
        });
      }
    } else {
      setWishList((pre) => pre.filter((x) => Number(x) !== idNum));
      if (wishlistAuthed) {
        removeWishlistItem(idNum).catch((err) => {
          showApiError("Remove from wishlist", err);
          setWishList((pre) => [...pre, idNum]);
        });
      }
    }
  };

  const removeFromWishlist = (id) => {
    const idNum = Number(id);
    if (!Number.isFinite(idNum)) return;
    if (!wishList.some((x) => Number(x) === idNum)) return;
    setWishList((pre) => pre.filter((x) => Number(x) !== idNum));
    if (wishlistAuthed) {
      removeWishlistItem(idNum).catch((err) => {
        showApiError("Remove from wishlist", err);
        setWishList((pre) => [...pre, idNum]);
      });
    }
  };
  const addToCompareItem = (id) => {
    if (!compareItem.includes(id)) {
      setCompareItem((pre) => [...pre, id]);
    }
  };
  const removeFromCompareItem = (id) => {
    if (compareItem.includes(id)) {
      setCompareItem((pre) => [...pre.filter((elm) => elm != id)]);
    }
  };
  const isAddedtoWishlist = (id) =>
    wishList.some((x) => Number(x) === Number(id));
  const isAddedtoCompareItem = (id) => {
    if (compareItem.includes(id)) {
      return true;
    }
    return false;
  };
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cartList"));
    if (items?.length) {
      setCartProducts(items);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cartList", JSON.stringify(cartProducts));
  }, [cartProducts]);
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("wishlist"));
    if (items?.length) {
      setWishList(items);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated || authLoading || !user?.userId) return;
    const userId = user.userId;
    let cancelled = false;
    fetchWishlist(userId)
      .then((ids) => {
        if (!cancelled) setWishList(ids);
      })
      .catch((err) => {
        showApiError("Load wishlist", err);
      });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, authLoading, user?.userId]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishList));
  }, [wishList]);

  useEffect(() => {
    const validIds = new Set(catalogProducts.map((p) => String(p.id)));
    setCartProducts((prev) =>
      prev.filter((item) => validIds.has(String(item.id)))
    );
    setWishList((prev) => prev.filter((id) => validIds.has(String(id))));
  }, [catalogProducts]);

  const contextElement = {
    cartProducts,
    setCartProducts,
    totalPrice,
    addProductToCart,
    isAddedToCartProducts,
    removeFromWishlist,
    addToWishlist,
    isAddedtoWishlist,
    quickViewItem,
    wishList,
    setQuickViewItem,
    quickAddItem,
    setQuickAddItem,
    addToCompareItem,
    isAddedtoCompareItem,
    removeFromCompareItem,
    compareItem,
    setCompareItem,
    updateQuantity,
  };
  return (
    <dataContext.Provider value={contextElement}>
      {children}
    </dataContext.Provider>
  );
}
