import React, { useEffect, useMemo, useState } from "react";
import { Search, ShoppingCart, Star, X } from "lucide-react";

const PRODUCTS_URL = "https://dummyjson.com/products?limit=24";
const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

function ProductCard({ product, onViewDetails }) {
  const reviewCount = product.reviews?.length;

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img
          className="product-image"
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
        />
      </div>
      <div className="product-info">
        <p className="product-category">{product.category}</p>
        <h2>{product.title}</h2>
        <p className="product-price">{currency.format(product.price)}</p>
        <div className="product-rating" aria-label={`${product.rating} out of 5 stars`}>
          <span className="stars" aria-hidden="true">
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                key={index}
                size={15}
                fill={index < Math.round(product.rating) ? "currentColor" : "none"}
              />
            ))}
          </span>
          <span className="rating-copy">
            {product.rating.toFixed(1)}
            {reviewCount ? ` (${reviewCount} reviews)` : ""}
          </span>
        </div>
        <button
          className="details-button"
          type="button"
          onClick={() => onViewDetails(product)}
        >
          View details
        </button>
      </div>
    </article>
  );
}

function ProductDetails({ product, onClose }) {
  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className="product-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          className="modal-close"
          type="button"
          aria-label="Close product details"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <img className="modal-image" src={product.thumbnail} alt={product.title} />
        <div className="modal-content">
          <p className="product-category">{product.category}</p>
          <h2 id="modal-title">{product.title}</h2>
          {product.brand && <p className="modal-brand">by {product.brand}</p>}
          <p className="product-price">{currency.format(product.price)}</p>
          <p className="modal-description">{product.description}</p>
          <div className="modal-rating">
            <Star size={16} fill="currentColor" />
            <span>{product.rating.toFixed(1)} out of 5</span>
            {product.availabilityStatus && (
              <span className="availability">{product.availabilityStatus}</span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("price-low");
  const [selectedProduct, setSelectedProduct] = useState(null);

  async function loadProducts(signal) {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(PRODUCTS_URL, { signal });
      if (!response.ok) {
        throw new Error(`Product service returned ${response.status}.`);
      }

      const data = await response.json();
      if (!Array.isArray(data.products)) {
        throw new Error("The product service returned an unexpected response.");
      }
      setProducts(data.products);
    } catch (requestError) {
      if (requestError.name !== "AbortError") {
        setError(requestError.message || "Unable to load products. Please try again.");
      }
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    loadProducts(controller.signal);
    return () => controller.abort();
  }, []);

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))].sort(),
    [products],
  );

  const visibleProducts = useMemo(() => {
    const query = submittedQuery.trim().toLocaleLowerCase();
    const filtered = products.filter((product) => {
      const matchesCategory = category === "all" || product.category === category;
      const searchContent = [
        product.title,
        product.description,
        product.category,
        product.brand,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase();

      return matchesCategory && (!query || searchContent.includes(query));
    });

    return filtered.sort((first, second) => {
      if (sortBy === "price-high") return second.price - first.price;
      if (sortBy === "name") return first.title.localeCompare(second.title);
      if (sortBy === "rating") return second.rating - first.rating;
      return first.price - second.price;
    });
  }, [category, products, sortBy, submittedQuery]);

  function handleSearch(event) {
    event.preventDefault();
    setSubmittedQuery(searchInput);
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Product Search home">
          <ShoppingCart className="brand-icon" size={25} strokeWidth={2.4} />
          <span>Product Search</span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <a className="nav-link active" href="#home">Home</a>
          <a className="nav-link" href="#about">About</a>
          <a className="nav-link" href="#contact">Contact</a>
        </nav>
      </header>

      <main id="home" className="page-content">
        <form className="search-toolbar" onSubmit={handleSearch}>
          <label className="search-input-wrap">
            <Search size={19} aria-hidden="true" />
            <span className="sr-only">Search products</span>
            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search products..."
            />
          </label>

          <label className="select-wrap">
            <span className="sr-only">Filter by category</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="all">All categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item.replaceAll("-", " ")}
                </option>
              ))}
            </select>
          </label>

          <label className="select-wrap">
            <span className="sr-only">Sort products</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="price-low">Sort by: Price (low to high)</option>
              <option value="price-high">Sort by: Price (high to low)</option>
              <option value="name">Sort by: Name</option>
              <option value="rating">Sort by: Top rated</option>
            </select>
          </label>

          <button className="search-button" type="submit">
            <Search size={18} aria-hidden="true" />
            <span>Search</span>
          </button>
        </form>

        <div className="results-heading" aria-live="polite">
          <h1>
            {loading
              ? "Loading products"
              : `${visibleProducts.length} ${visibleProducts.length === 1 ? "product" : "products"} found`}
          </h1>
          {submittedQuery && !loading && (
            <button
              className="clear-search"
              type="button"
              onClick={() => {
                setSearchInput("");
                setSubmittedQuery("");
              }}
            >
              Clear search
            </button>
          )}
        </div>

        {loading ? (
          <div className="product-grid" aria-label="Loading products">
            {Array.from({ length: 6 }, (_, index) => (
              <div className="product-card skeleton-card" key={index}>
                <div className="skeleton-image" />
                <div className="skeleton-copy">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <section className="message-panel" role="alert">
            <div className="message-icon"><Search size={28} /></div>
            <h2>We couldn’t load the products</h2>
            <p>{error}</p>
            <button className="search-button retry-button" type="button" onClick={() => loadProducts(new AbortController().signal)}>
              Try again
            </button>
          </section>
        ) : visibleProducts.length > 0 ? (
          <div className="product-grid">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={setSelectedProduct}
              />
            ))}
          </div>
        ) : (
          <section className="message-panel">
            <div className="message-icon"><Search size={29} /></div>
            <h2>No products found</h2>
            <p>Try a different search term or change the filters.</p>
            <button
              className="text-button"
              type="button"
              onClick={() => {
                setSearchInput("");
                setSubmittedQuery("");
                setCategory("all");
              }}
            >
              Clear search and filters
            </button>
          </section>
        )}
      </main>

      <footer className="site-footer">
        <p id="about">A simple place to discover your next favorite find.</p>
        <a id="contact" href="mailto:hello@productsearch.example">Contact us</a>
      </footer>

      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

export default App;
