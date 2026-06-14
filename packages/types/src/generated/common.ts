// Auto-generated from Thrift IDL — do not edit manually.

export interface GameInfo {
  id: string;
  name: string;
  icon: string;
  description: string;
  tags: string[];
  rating: number;
  category: string;
}

export interface PageComponent {
  id: string;
  type: string;
  order: number;
  propsJson: string;
}

export interface PageSchema {
  id: string;
  name: string;
  slug: string;
  version: number;
  status: string;
  components: PageComponent[];
  createdAt: number;
  updatedAt: number;
}

