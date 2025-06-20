
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface DataSource {
  id: string;
  name: string;
  type: string;
  url: string;
  description: string;
  apiKey: string;
  headers: Record<string, string>;
  enabled: boolean;
  rateLimitPerHour: number;
  classification: string;
  status: 'active' | 'inactive' | 'error' | 'testing';
  lastSync: string;
  createdAt: string;
  updatedAt: string;
}

interface DataSourcesContextValue {
  dataSources: DataSource[];
  addDataSource: (dataSource: Omit<DataSource, 'id' | 'createdAt' | 'updatedAt' | 'lastSync' | 'status'>) => void;
  updateDataSource: (id: string, updates: Partial<DataSource>) => void;
  deleteDataSource: (id: string) => void;
  toggleDataSource: (id: string) => void;
  testConnection: (id: string) => Promise<boolean>;
}

const DataSourcesContext = createContext<DataSourcesContextValue | undefined>(undefined);

export const useDataSources = () => {
  const context = useContext(DataSourcesContext);
  if (!context) {
    throw new Error('useDataSources must be used within a DataSourcesProvider');
  }
  return context;
};

export const DataSourcesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dataSources, setDataSources] = useState<DataSource[]>([
    {
      id: '1',
      name: 'Global News API',
      type: 'news_api',
      url: 'https://api.globalnews.com/v1',
      description: 'Primary news aggregation service for global events',
      apiKey: '***hidden***',
      headers: { 'User-Agent': 'ProjectLookingGlass/1.0' },
      enabled: true,
      rateLimitPerHour: 1000,
      classification: 'unclassified',
      status: 'active',
      lastSync: '2025-01-20T10:30:00Z',
      createdAt: '2025-01-15T09:00:00Z',
      updatedAt: '2025-01-20T10:30:00Z'
    },
    {
      id: '2',
      name: 'Academic Research Feed',
      type: 'academic',
      url: 'https://api.arxiv.org/query',
      description: 'ArXiv academic papers and research publications',
      apiKey: '',
      headers: {},
      enabled: true,
      rateLimitPerHour: 500,
      classification: 'unclassified',
      status: 'active',
      lastSync: '2025-01-20T09:15:00Z',
      createdAt: '2025-01-15T14:20:00Z',
      updatedAt: '2025-01-20T09:15:00Z'
    },
    {
      id: '3',
      name: 'Social Media Monitor',
      type: 'social_media',
      url: 'https://api.socialmedia.com/v2',
      description: 'Social media sentiment and trend analysis',
      apiKey: '***hidden***',
      headers: { 'Authorization': 'Bearer ***hidden***' },
      enabled: false,
      rateLimitPerHour: 2000,
      classification: 'confidential',
      status: 'error',
      lastSync: '2025-01-19T16:45:00Z',
      createdAt: '2025-01-16T11:30:00Z',
      updatedAt: '2025-01-19T16:45:00Z'
    }
  ]);

  const addDataSource = (newDataSource: Omit<DataSource, 'id' | 'createdAt' | 'updatedAt' | 'lastSync' | 'status'>) => {
    const now = new Date().toISOString();
    const dataSource: DataSource = {
      ...newDataSource,
      id: Math.random().toString(36).substr(2, 9),
      status: 'inactive',
      lastSync: now,
      createdAt: now,
      updatedAt: now
    };
    setDataSources(prev => [...prev, dataSource]);
  };

  const updateDataSource = (id: string, updates: Partial<DataSource>) => {
    setDataSources(prev => 
      prev.map(ds => 
        ds.id === id 
          ? { ...ds, ...updates, updatedAt: new Date().toISOString() }
          : ds
      )
    );
  };

  const deleteDataSource = (id: string) => {
    setDataSources(prev => prev.filter(ds => ds.id !== id));
  };

  const toggleDataSource = (id: string) => {
    setDataSources(prev => 
      prev.map(ds => 
        ds.id === id 
          ? { 
              ...ds, 
              enabled: !ds.enabled,
              status: !ds.enabled ? 'active' : 'inactive',
              updatedAt: new Date().toISOString() 
            }
          : ds
      )
    );
  };

  const testConnection = async (id: string): Promise<boolean> => {
    updateDataSource(id, { status: 'testing' });
    
    // Simulate connection test
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const success = Math.random() > 0.3;
    updateDataSource(id, { 
      status: success ? 'active' : 'error',
      lastSync: success ? new Date().toISOString() : undefined
    });
    
    return success;
  };

  return (
    <DataSourcesContext.Provider value={{
      dataSources,
      addDataSource,
      updateDataSource,
      deleteDataSource,
      toggleDataSource,
      testConnection
    }}>
      {children}
    </DataSourcesContext.Provider>
  );
};
