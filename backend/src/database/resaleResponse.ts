import { ResaleRecord } from './resaleRecord';

export type ResaleResult = {
  records: ResaleRecord[];
  _links: Object;
  limit: number;
  total: number;
};

export type ResaleResponse = {
  help: string;
  success: boolean;
  result: ResaleResult;
};
