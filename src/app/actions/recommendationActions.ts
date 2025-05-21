
'use server';
import type { Product } from '@/types';
import { getNeo4jDriver } from '@/lib/neo4j';
import { getProductByIdAction, getProductsAction } from '@/app/admin/actions';
import { ObjectId } from 'mongodb';

const MAX_RECOMMENDED_DEALS = 4;

/**
 * Fetches recommended products, simulating a Neo4j recommendation engine.
 * 
 * In a real scenario:
 * 1. Connect to Neo4j using `getNeo4jDriver()`.
 * 2. Execute a Cypher query to get recommended product IDs based on relationships
 *    (e.g., collaborative filtering, content-based similarity, trending items).
 * 3. Fetch full product details for these IDs from MongoDB.
 * 
 * For this simulation:
 * - It checks if Neo4j credentials are set. If not, it logs a warning and falls back.
 * - It attempts to fetch highly-rated products from MongoDB as a stand-in.
 * - If no highly-rated products, it fetches some random products from MongoDB.
 */
export async function getRecommendedDealsAction(): Promise<Product[]> {
  const driver = getNeo4jDriver();

  if (!driver) {
    console.warn(
      "Neo4j driver not available (check .env.local: NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD). " +
      "Falling back to fetching highly-rated products from MongoDB for 'Offres du Jour'."
    );
    // Fallback: fetch some highly rated products from MongoDB
    return getProductsAction({ sortBy: 'rating', limit: MAX_RECOMMENDED_DEALS });
  }

  // If Neo4j driver is available, proceed with actual (or simulated) Neo4j logic
  // const session = driver.session({ database: 'neo4j' }); // Specify your database if not default
  let recommendedProductIds: string[] = [];

  try {
    // =====================================================================================
    // PLACEHOLDER FOR ACTUAL NEO4J CYPHER QUERY
    // This section should be replaced with your actual Neo4j query logic.
    //
    // Example: Get products often bought together with other popular products
    // const result = await session.run(
    //   `
    //   MATCH (popularProduct:Product)
    //   WHERE popularProduct.rating >= 4.5 // Define what makes a product popular
    //   MATCH (popularProduct)<-[:CONTAINS_ITEM]-(o:Order)-[:CONTAINS_ITEM]->(recommendedProduct:Product)
    //   WHERE popularProduct <> recommendedProduct
    //   WITH recommendedProduct, COUNT(o) AS coOccurrence
    //   ORDER BY coOccurrence DESC
    //   LIMIT $limit
    //   RETURN recommendedProduct.productId AS productId
    //   `,
    //   { limit: MAX_RECOMMENDED_DEALS }
    // );
    // recommendedProductIds = result.records.map(record => record.get('productId'));
    //
    // For now, we simulate by fetching highly-rated products from MongoDB
    // This simulates that Neo4j recommended these product IDs.
    // =====================================================================================
    
    console.log("SIMULATION: Neo4j driver is configured. Simulating recommendation by fetching highly-rated products from MongoDB.");
    const highlyRatedProducts = await getProductsAction({ filters: { rating_gte: 4.5 }, limit: MAX_RECOMMENDED_DEALS + 5 }); // Fetch a bit more to shuffle

    if (highlyRatedProducts.length > 0) {
        recommendedProductIds = highlyRatedProducts
        .sort(() => 0.5 - Math.random()) // Shuffle
        .slice(0, MAX_RECOMMENDED_DEALS)
        .map(p => p.id);
    } else {
        // Fallback if no highly rated products, pick any
        const anyProducts = await getProductsAction({ limit: MAX_RECOMMENDED_DEALS });
        recommendedProductIds = anyProducts
        .map(p => p.id);
    }

    if (recommendedProductIds.length === 0) {
      console.log("No product IDs returned from Neo4j recommendation simulation.");
      return [];
    }

    // Fetch full product details from MongoDB for the recommended IDs
    // Using Promise.all for potentially better performance if getProductByIdAction is efficient
    const productPromises = recommendedProductIds
      .filter(id => ObjectId.isValid(id)) // Ensure IDs are valid for MongoDB
      .map(id => getProductByIdAction(id));
      
    const resolvedProducts = await Promise.all(productPromises);
    const recommendedProducts = resolvedProducts.filter(product => product !== null) as Product[];
    
    console.log(`Simulated Neo4j recommendation: returning ${recommendedProducts.length} products for 'Offres du Jour'.`);
    return recommendedProducts;

  } catch (error) {
    console.error("Error in getRecommendedDealsAction (Neo4j interaction or MongoDB fetch):", error);
    // Fallback in case of error during Neo4j interaction
    console.warn("Falling back to simple product fetching for deals due to an error.");
    return getProductsAction({ sortBy: 'rating', limit: MAX_RECOMMENDED_DEALS });
  } finally {
    // It's good practice to close Neo4j sessions when done.
    // if (session) {
    //   try {
    //     await session.close();
    //   } catch (sessionCloseError) {
    //     console.error("Error closing Neo4j session:", sessionCloseError);
    //   }
    // }
    // Driver closing is handled globally if needed, but usually not per action.
  }
}
