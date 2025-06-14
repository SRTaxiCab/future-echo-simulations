
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserRole } from '@/hooks/useUserRole';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Users, Shield, UserCheck } from 'lucide-react';

interface Profile {
  id: string;
  username: string;
  role: string;
}

interface UserWithRole extends Profile {
  user_role?: 'admin' | 'analyst' | 'viewer';
  classification_clearance?: 'unclassified' | 'confidential' | 'secret' | 'top_secret';
}

export const AdminPanel: React.FC = () => {
  const { isAdmin, grantAccess } = useUserRole();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'analyst' | 'viewer'>('analyst');
  const [selectedClearance, setSelectedClearance] = useState<'unclassified' | 'confidential' | 'secret' | 'top_secret'>('unclassified');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, role');

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        return;
      }

      // Fetch user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role, classification_clearance');

      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
        return;
      }

      // Combine data
      const usersWithRoles = profiles?.map(profile => {
        const userRole = userRoles?.find(role => role.user_id === profile.id);
        return {
          ...profile,
          user_role: userRole?.role,
          classification_clearance: userRole?.classification_clearance
        };
      }) || [];

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error in fetchUsers:', error);
    }
  };

  const handleGrantAccess = async () => {
    if (!selectedUser || !selectedRole || !selectedClearance) {
      toast({
        title: "Error",
        description: "Please select a user, role, and clearance level",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await grantAccess(selectedUser, selectedRole, selectedClearance);
      
      toast({
        title: "Access Granted",
        description: `Successfully updated user permissions`,
      });

      // Refresh users list
      await fetchUsers();
      
      // Reset form
      setSelectedUser('');
      setSelectedRole('analyst');
      setSelectedClearance('unclassified');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to grant access",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <Card className="border-red-900/50 bg-red-950/20">
        <CardContent className="p-6 text-center">
          <Shield className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-mono text-red-300 mb-2">Access Denied</h3>
          <p className="text-red-400/80">Administrator privileges required to access this panel.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="cyber-border">
      <CardHeader className="flex flex-row items-center gap-2 pb-4">
        <Users className="h-5 w-5 text-cyber" />
        <CardTitle className="font-mono text-lg">Administrator Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="font-mono">Select User</Label>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a user" />
              </SelectTrigger>
              <SelectContent>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.username} ({user.user_role || 'No Role'} - {user.classification_clearance || 'No Clearance'})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-mono">Role</Label>
              <Select value={selectedRole} onValueChange={(value: 'admin' | 'analyst' | 'viewer') => setSelectedRole(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="analyst">Analyst</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-mono">Classification Clearance</Label>
              <Select value={selectedClearance} onValueChange={(value: 'unclassified' | 'confidential' | 'secret' | 'top_secret') => setSelectedClearance(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unclassified">Unclassified</SelectItem>
                  <SelectItem value="confidential">Confidential</SelectItem>
                  <SelectItem value="secret">Secret</SelectItem>
                  <SelectItem value="top_secret">Top Secret</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleGrantAccess} 
            disabled={isLoading || !selectedUser}
            className="w-full"
          >
            <UserCheck className="h-4 w-4 mr-2" />
            {isLoading ? 'Granting Access...' : 'Grant Access'}
          </Button>
        </div>

        <div className="border-t border-border pt-4">
          <h4 className="font-mono text-sm mb-3 text-muted-foreground">Current Users</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {users.map(user => (
              <div key={user.id} className="flex justify-between items-center p-2 rounded bg-muted/20 text-sm">
                <span className="font-mono">{user.username}</span>
                <div className="text-xs text-muted-foreground">
                  {user.user_role || 'No Role'} | {user.classification_clearance || 'No Clearance'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
