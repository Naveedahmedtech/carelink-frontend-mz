interface FileItem {
  id: string;
  name: string;
  uploadedBy: string;
  uploadedAt: string;
  type?: string;
}

export const dummyFiles: FileItem[] = [
  {
    id: "1",
    name: "main workflow1.pdf",
    uploadedBy: "Alice",
    uploadedAt: "2025-08-04",
    type: "PDF",
  },
  {
    id: "2",
    name: "main workflow2.pdf",
    uploadedBy: "Bob",
    uploadedAt: "2025-08-05",
    type: "PDF",
  },
];
