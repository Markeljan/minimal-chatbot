'use client';

import { useCallback, useEffect, useState } from 'react';

export interface Document {
  id: string;
  title: string;
  content: string;
  kind: string;
}

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load documents from localStorage on initial mount
  useEffect(() => {
    const loadDocuments = () => {
      try {
        const storedDocs = localStorage.getItem('documents');
        if (storedDocs) {
          const parsedDocs = JSON.parse(storedDocs);
          setDocuments(parsedDocs);
        }
      } catch (error) {
        console.error('Error loading documents from localStorage:', error);
      }
    };

    loadDocuments();
  }, []);

  // Save to localStorage whenever documents change
  useEffect(() => {
    try {
      localStorage.setItem('documents', JSON.stringify(documents));
    } catch (error) {
      console.error('Error saving documents to localStorage:', error);
    }
  }, [documents]);

  const fetchDocuments = useCallback(
    (documentId: string) => {
      if (!documentId || documentId === 'init') return;

      setIsLoading(true);
      try {
        // Filter documents for the specific documentId
        const docs = documents.filter((doc) => doc.id === documentId);
        setDocuments(docs);
      } finally {
        setIsLoading(false);
      }
    },
    [documents],
  );

  const saveDocument = useCallback(
    (documentId: string, title: string, content: string, kind: string) => {
      const newDocument = {
        id: documentId,
        title,
        content,
        kind,
      };

      setDocuments((prev) => [...prev, newDocument]);
      return newDocument;
    },
    [],
  );

  return {
    documents,
    setDocuments,
    isLoading,
    fetchDocuments,
    saveDocument,
  };
}
