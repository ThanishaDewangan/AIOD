import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function AppIndex() {
  const fetcher = useFetcher();

  const [items, setItems] = useState([]);
  const [type, setType] = useState(null);

  // ✅ SELECTION STATE (THIS WAS MISSING)
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);

  // Load data
  const loadData = (resource) => {
    setType(resource);
    fetcher.load(`/api/${resource}`);
  };

  // Update items when fetch completes
  useEffect(() => {
    if (Array.isArray(fetcher.data)) {
      setItems(fetcher.data);
    }
  }, [fetcher.data]);

  // ✅ TOGGLE SELECTION LOGIC
  const toggleItem = (item) => {
    const map = {
      products: [selectedProducts, setSelectedProducts],
      variants: [selectedVariants, setSelectedVariants],
      collections: [selectedCollections, setSelectedCollections],
    };

    const [selected, setSelected] = map[type];

    setSelected(
      selected.find((i) => i.id === item.id)
        ? selected.filter((i) => i.id !== item.id)
        : [...selected, item]
    );
  };

  const getSelected = () => {
    if (type === "products") return selectedProducts;
    if (type === "variants") return selectedVariants;
    if (type === "collections") return selectedCollections;
    return [];
  };

  return (
    <s-page heading="Custom Resource Picker">
      <s-stack direction="inline" gap="base">
        <s-button onClick={() => loadData("products")}>
          Pick Products
        </s-button>
        <s-button onClick={() => loadData("variants")}>
          Pick Variants
        </s-button>
        <s-button onClick={() => loadData("collections")}>
          Pick Collections
        </s-button>
      </s-stack>

      {/* ✅ CUSTOM PICKER UI */}
      {items.length > 0 && (
        <s-section heading={`Select ${type}`}>
          <s-box padding="base" borderWidth="base" borderRadius="base">
            {items.map((item) => (
              <label key={item.id} style={{ display: "block", marginBottom: 8 }}>
                <input
                  type="checkbox"
                  checked={getSelected().some(i => i.id === item.id)}
                  onChange={() => toggleItem(item)}
                />
                {" "}{item.title}
              </label>
            ))}
          </s-box>
        </s-section>
      )}

      {/* ✅ RENDER SELECTED ITEMS */}
      <s-section heading="Selected Products">
        <ul>
          {selectedProducts.map(p => <li key={p.id}>{p.title}</li>)}
        </ul>
      </s-section>

      <s-section heading="Selected Variants">
        <ul>
          {selectedVariants.map(v => <li key={v.id}>{v.title}</li>)}
        </ul>
      </s-section>

      <s-section heading="Selected Collections">
        <ul>
          {selectedCollections.map(c => <li key={c.id}>{c.title}</li>)}
        </ul>
      </s-section>
    </s-page>
  );
}

export const headers = (args) => boundary.headers(args);
