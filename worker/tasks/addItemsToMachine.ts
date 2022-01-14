import Collection from "../../server/models/Collection.model";

export interface AddItemsToWorkerRequest {
  collectionId: string;
}

export interface AddItemsToWorkerResponse {
  collection: Collection;
}

export default async function AddItemsToWorkerTask(
  data: AddItemsToWorkerRequest
): Promise<AddItemsToWorkerResponse> {
  let collection = await Collection.findByPk(data.collectionId);
  if (!collection) {
    return null;
  }
  const updated = await collection.addNFTsToMachine();
  return {
    collection: updated,
  };
}
