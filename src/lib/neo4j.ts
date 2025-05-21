
import neo4j from 'neo4j-driver';

const uri = process.env.NEO4J_URI;
const user = process.env.NEO4J_USERNAME;
const password = process.env.NEO4J_PASSWORD;

let driver: neo4j.Driver | null = null;

export function getNeo4jDriver(): neo4j.Driver | null {
  if (!uri || !user || !password || uri === "neo4j+s://your-aura-instance.databases.neo4j.io") {
    console.warn(
      "Neo4j environment variables (NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD) " +
      "are not fully set or are using default placeholder values. " +
      "Neo4j connection will not be established. Please update .env.local."
    );
    return null;
  }

  if (!driver) {
    try {
      driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
      // You can add a one-time connectivity check here if desired,
      // but generally, it's better to handle errors per-session/query.
      // driver.verifyConnectivity()
      //   .then(() => console.log('Neo4j driver created and verified connectivity.'))
      //   .catch(error => console.error('Neo4j driver creation or connectivity verification failed:', error));
      console.log("Neo4j driver instance created.");
    } catch (error) {
      console.error("Failed to create Neo4j driver instance:", error);
      // Ensure driver remains null if creation fails
      driver = null; 
      return null;
    }
  }
  return driver;
}

export async function closeNeo4jDriver(): Promise<void> {
  if (driver) {
    try {
      await driver.close();
      driver = null;
      console.log("Neo4j driver closed.");
    } catch (error) {
      console.error("Error closing Neo4j driver:", error);
    }
  }
}

// It's often better to manage sessions per request/action rather than a global driver close,
// especially in serverless environments. The closeNeo4jDriver function is provided
// if a global cleanup is ever needed (e.g. application shutdown, not typical for Next.js).
