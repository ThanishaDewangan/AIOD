import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(`
    {
      collections(first: 10) {
        edges {
          node {
            id
            title
          }
        }
      }
    }
  `);

  const json = await response.json();

  return Response.json(
    json.data.collections.edges.map(edge => edge.node)
  );
}
