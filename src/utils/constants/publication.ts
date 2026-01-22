export interface Author {
  firstName: string;
  lastName: string;
}

export interface Publication {
  id: string;
  gene: string;
  pmid: string;
  doi: string;
  authors: Author[];
  title: string;
  abstract: string;
  reference: string;
  journal: string;
  year: number | "";
}

export type PublicationInput = Omit<Publication, "id">;
