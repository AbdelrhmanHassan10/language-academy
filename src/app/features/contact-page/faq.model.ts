export interface FAQ {
  id: number;
  question: string;
  answer: string;
  created_at: string;
  updated_at: string;
}

export interface FAQPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface FAQResponse {
  success: boolean;
  message: string;
  data: FAQ[];
  pagination: FAQPagination;
}
