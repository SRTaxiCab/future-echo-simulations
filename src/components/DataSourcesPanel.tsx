
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  Plus, 
  Search, 
  Filter,
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { DataSourceCard } from '@/components/DataSourceCard';
import { EditDataSourceDialog } from '@/components/EditDataSourceDialog';
import { AddDataSourceDialog } from '@/components/AddDataSourceDialog';
import { useDataSources, type DataSource } from '@/context/DataSourcesContext';
import { useToast } from '@/hooks/use-toast';

export const DataSourcesPanel: React.FC = () => {
  const { toast } = useToast();
  const { 
    dataSources, 
    addDataSource, 
    updateDataSource, 
    deleteDataSource, 
    toggleDataSource, 
    testConnection 
  } = useDataSources();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingDataSource, setEditingDataSource] = useState<DataSource | null>(null);

  const filteredDataSources = dataSources.filter(ds => {
    const matchesSearch = ds.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ds.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ds.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ds.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const activeCount = dataSources.filter(ds => ds.status === 'active').length;
  const errorCount = dataSources.filter(ds => ds.status === 'error').length;
  const totalCount = dataSources.length;

  const handleEdit = (dataSource: DataSource) => {
    setEditingDataSource(dataSource);
    setShowEditDialog(true);
  };

  const handleDelete = (id: string) => {
    const dataSource = dataSources.find(ds => ds.id === id);
    if (dataSource) {
      deleteDataSource(id);
      toast({
        title: "Data source deleted",
        description: `${dataSource.name} has been removed from your data sources`
      });
    }
  };

  const handleSaveEdit = (id: string, updates: Partial<DataSource>) => {
    updateDataSource(id, updates);
  };

  const handleAddDataSource = (newDataSource: Omit<DataSource, 'id' | 'createdAt' | 'updatedAt' | 'lastSync' | 'status'>) => {
    addDataSource(newDataSource);
  };

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Database className="h-6 w-6 text-cyber" />
          <h2 className="text-xl font-semibold">Data Sources</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>{activeCount} Active</span>
            </div>
            <div className="flex items-center gap-1">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <span>{errorCount} Errors</span>
            </div>
            <div className="flex items-center gap-1">
              <Activity className="h-4 w-4 text-blue-400" />
              <span>{totalCount} Total</span>
            </div>
          </div>
          <Button 
            onClick={() => setShowAddDialog(true)}
            className="bg-cyber hover:bg-cyber-dark"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Source
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search data sources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <div className="flex gap-1">
            {['all', 'active', 'inactive', 'error'].map((status) => (
              <Button
                key={status}
                size="sm"
                variant={statusFilter === status ? "default" : "outline"}
                onClick={() => setStatusFilter(status)}
                className="capitalize"
              >
                {status}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Data Sources Grid */}
      {filteredDataSources.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Database className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {dataSources.length === 0 ? 'No data sources configured' : 'No sources match your filters'}
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              {dataSources.length === 0 
                ? 'Add your first data source to start collecting intelligence data'
                : 'Try adjusting your search terms or filters'
              }
            </p>
            {dataSources.length === 0 && (
              <Button onClick={() => setShowAddDialog(true)} className="bg-cyber hover:bg-cyber-dark">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Data Source
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDataSources.map((dataSource) => (
            <DataSourceCard
              key={dataSource.id}
              dataSource={dataSource}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggle={toggleDataSource}
              onTest={testConnection}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <AddDataSourceDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />

      <EditDataSourceDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        dataSource={editingDataSource}
        onSave={handleSaveEdit}
      />
    </div>
  );
};
