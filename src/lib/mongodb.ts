
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// @ts-ignore uri is checked above
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let cachedClient: MongoClient | null = null;

export async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient.db("maisonmate"); // Specify your database name
  }
  try {
    await client.connect();
    cachedClient = client;
    console.log("Successfully connected to MongoDB Atlas!");
    return client.db("maisonmate"); // Specify your database name
  } catch (error) {
    console.error("Failed to connect to MongoDB Atlas", error);
    throw error;
  }
}

// Helper to convert string ID to ObjectId
export const toObjectId = (id: string) => {
  if (ObjectId.isValid(id)) {
    return new ObjectId(id);
  }
  // Fallback or error handling if id is not a valid ObjectId string
  // This might happen if old string IDs are still around.
  // For new data, MongoDB will generate ObjectIds.
  // If you are migrating data, ensure IDs are compatible.
  console.warn(`Invalid ObjectId string: ${id}. This might cause issues.`);
  // Depending on your needs, you might throw an error or return a specific value.
  // For now, let's try to return it as is, but MongoDB operations might fail.
  return id as any; // Cast to any to satisfy ObjectId type, handle with care
};
