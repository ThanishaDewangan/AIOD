import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(`
    {
      productVariants(first: 10) {
        edges {
          node {
            id
            title
            price
          }
        }
      }
    }
  `);

  const json = await response.json();

  return Response.json(
    json.data.productVariants.edges.map(edge => edge.node)
  );
}
