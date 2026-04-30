import {
  clearWishlist,
  fetchWishlist,
  replaceWishlist,
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

  const syncWishlistRemote = (nextIds, rollbackIds, contextLabel) => {
    if (!wishlistAuthed) return;
    const op = nextIds.length ? replaceWishlist(nextIds) : clearWishlist();
    op.catch((err) => {
      console.warn(`${contextLabel} failed; keeping local wishlist state.`, err);
      setWishList(rollbackIds);
    });
  };

  const addToWishlist = (id) => {
    const idNum = Number(id);
    if (!Number.isFinite(idNum)) return;
    const exists = wishList.some((x) => Number(x) === idNum);

    if (!exists) {
      const rollbackIds = [...wishList];
      const nextIds = [...wishList, idNum];
      setWishList(nextIds);
      syncWishlistRemote(nextIds, rollbackIds, "Add to wishlist");
    } else {
      const rollbackIds = [...wishList];
      const nextIds = wishList.filter((x) => Number(x) !== idNum);
      setWishList(nextIds);
      syncWishlistRemote(nextIds, rollbackIds, "Remove from wishlist");
    }
  };

  const removeFromWishlist = (id) => {
    const idNum = Number(id);
    if (!Number.isFinite(idNum)) return;
    if (!wishList.some((x) => Number(x) === idNum)) return;
    const rollbackIds = [...wishList];
    const nextIds = wishList.filter((x) => Number(x) !== idNum);
    setWishList(nextIds);
    syncWishlistRemote(nextIds, rollbackIds, "Remove from wishlist");
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
    let cancelled = false;
    fetchWishlist()
      .then((ids) => {
        if (!cancelled) setWishList(ids);
      })
      .catch((err) => {
        console.warn("Load wishlist failed; using local wishlist fallback.", err);
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
