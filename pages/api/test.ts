import { NextApiRequest, NextApiResponse } from 'next';

interface ListItem {
  id: string;
  name: string;
}

interface ListResponse {
  items: ListItem[];
  nextToken?: string;
}

const PAGE_SIZE = 10;

const dataMap: Record<string, ListItem[]> = {
  '0': Array.from({ length: 30 }, (_, i) => ({ id: `${i + 1}`, name: `List 1 - Item ${i + 1}` })),
  '1': Array.from({ length: 30 }, (_, i) => ({ id: `${i + 1}`, name: `List 1 - Item ${i + 1}` })),
  '2': Array.from({ length: 20 }, (_, i) => ({ id: `${i + 1}`, name: `List 2 - Item ${i + 1}` })),
  '3': Array.from({ length: 15 }, (_, i) => ({ id: `${i + 1}`, name: `List 3 - Item ${i + 1}` })),
};

export default (req: NextApiRequest, res: NextApiResponse<ListResponse>) => {
  const { id, nextToken } = req.query;

  const data = dataMap[id as string];

  if (!data) {
    return res.status(404).end();
  }

  const startIndex = nextToken ? parseInt(nextToken as string) : 0;
  const endIndex = Math.min(startIndex + PAGE_SIZE, data.length);

  const items = data.slice(startIndex, endIndex);
  const nextTokenValue = endIndex < data.length ? (startIndex + PAGE_SIZE).toString() : undefined;

  res.status(200).json({ items, nextToken: nextTokenValue });
};
