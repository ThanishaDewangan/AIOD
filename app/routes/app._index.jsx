import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function AppIndex() {
  const shopify = useAppBridge();
  const fetcher = useFetcher();

  const [items, setItems] = useState([]);
  const [type, setType] = useState(null);

  // Load data when button clicked
  const loadData = (resource) => {
    setType(resource);
    fetcher.load(`/api/${resource}`);
  };

  // Update items safely
  useEffect(() => {
    if (Array.isArray(fetcher.data)) {
      setItems(fetcher.data);
    }
  }, [fetcher.data]);

  return (
    <s-page heading="Custom Resource Picker">
      <s-stack direction="inline" gap="base">
        <s-button onClick={() => loadData("products")}>
          Select Products
        </s-button>
        <s-button onClick={() => loadData("variants")}>
          Select Variants
        </s-button>
        <s-button onClick={() => loadData("collections")}>
          Select Collections
        </s-button>
      </s-stack>

      {items.length > 0 && (
        <s-section heading={`Loaded ${type}`}>
          <s-box padding="base" borderWidth="base" borderRadius="base">
            <ul>
              {items.map((item) => (
                <li key={item.id}>
                  <strong>{item.title}</strong>
                </li>
              ))}
            </ul>
          </s-box>
        </s-section>
      )}
    </s-page>
  );
}

export const headers = (args) => boundary.headers(args);
