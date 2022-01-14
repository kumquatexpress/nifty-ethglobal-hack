import Collection from "../../server/models/Collection.model";
import Item from "../../server/models/Item.model";

export interface CreateItemsFromTemplateRequest {
  collectionId: string;
}

export interface CreateItemsFromTemplateResponse {
  items: Item[];
}

export default async function CreateItemsFromTemplateTask(
  data: CreateItemsFromTemplateRequest
): Promise<CreateItemsFromTemplateResponse> {
  const collection = await Collection.findByPk(data.collectionId);
  const items = await collection.generateItemsFromTemplate();
  return {
    items: items,
  };
}
