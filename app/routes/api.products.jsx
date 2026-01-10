import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(`
    {
      products(first: 10) {
        edges {
          node {
            id
            title
            handle
            status
          }
        }
      }
    }
  `);

  const json = await response.json();

  return Response.json(
    json.data.products.edges.map(edge => edge.node)
  );
}
