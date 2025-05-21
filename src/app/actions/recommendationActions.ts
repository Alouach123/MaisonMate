
'use server';
import type { Product } from '@/types';
import { getNeo4jDriver } from '@/lib/neo4j';
import { getProductByIdAction, getProductsAction } from '@/app/admin/actions';
import { ObjectId } from 'mongodb';
import type { Session } from 'neo4j-driver';

const MAX_RECOMMENDED_DEALS = 4;

/**
 * Fetches recommended products using Neo4j.
 * If Neo4j is unavailable or returns no results, it falls back to highly-rated MongoDB products.
 */
export async function getRecommendedDealsAction(): Promise<Product[]> {
  const driver = getNeo4jDriver();

  if (!driver) {
    console.warn(
      "Neo4j driver not available (check .env.local: NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD). " +
      "Falling back to fetching highly-rated products from MongoDB for 'Offres du Jour'."
    );
    return getProductsAction({ sortBy: 'rating', limit: MAX_RECOMMENDED_DEALS });
  }

  let session: Session | null = null;
  let recommendedProductIds: string[] = [];

  try {
    console.log("Attempting to connect to Neo4j for recommendations...");
    session = driver.session({ database: 'neo4j' }); // Default database for AuraDB free tier is 'neo4j'

    // =====================================================================================
    // ACTUAL NEO4J CYPHER QUERY
    // This is a SAMPLE query. You will need to replace this with your actual
    // recommendation logic based on your graph model.
    //
    // This query assumes:
    // 1. You have Product nodes: (:Product)
    // 2. Each Product node has a 'productId' property (string, matching MongoDB _id.toString())
    // 3. Product nodes may have a 'rating' property (float).
    // =====================================================================================
    const cypherQuery = `
      MATCH (p:Product)
      WHERE p.rating >= 4.0 AND p.stock > 0 // Example: highly rated and in stock
      RETURN p.productId AS productId
      ORDER BY p.rating DESC, rand() // Get top rated, with some randomness
      LIMIT $limit
    `;
    
    console.log("Executing Neo4j Cypher Query:", cypherQuery);
    const result = await session.run(cypherQuery, { limit: MAX_RECOMMENDED_DEALS });
    
    recommendedProductIds = result.records.map(record => record.get('productId'));
    console.log(`Neo4j recommended product IDs: ${recommendedProductIds.join(', ')}`);

    if (recommendedProductIds.length === 0) {
      console.log("Neo4j returned no recommendations. Falling back to MongoDB highly-rated products.");
      return getProductsAction({ sortBy: 'rating', limit: MAX_RECOMMENDED_DEALS });
    }

    // Fetch full product details from MongoDB for the recommended IDs
    const productPromises = recommendedProductIds
      .filter(id => id && ObjectId.isValid(id)) // Ensure IDs are valid and not null/undefined
      .map(id => getProductByIdAction(id));
      
    const resolvedProducts = await Promise.all(productPromises);
    const recommendedProducts = resolvedProducts.filter(product => product !== null) as Product[];
    
    if (recommendedProducts.length === 0 && recommendedProductIds.length > 0) {
        console.warn("Neo4j recommended IDs, but corresponding products not found in MongoDB. Check ID consistency. Falling back.");
        return getProductsAction({ sortBy: 'rating', limit: MAX_RECOMMENDED_DEALS });
    }
    
    console.log(`Successfully fetched ${recommendedProducts.length} products from MongoDB based on Neo4j recommendations.`);
    return recommendedProducts;

  } catch (error) {
    console.error("Error during Neo4j recommendation or MongoDB fetch:", error);
    console.warn("Falling back to simple product fetching for deals due to an error.");
    return getProductsAction({ sortBy: 'rating', limit: MAX_RECOMMENDED_DEALS });
  } finally {
    if (session) {
      try {
        await session.close();
        console.log("Neo4j session closed.");
      } catch (sessionCloseError) {
        console.error("Error closing Neo4j session:", sessionCloseError);
      }
    }
  }
}
