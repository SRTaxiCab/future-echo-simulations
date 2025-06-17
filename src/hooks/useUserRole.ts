
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'analyst' | 'viewer';
  classification_clearance: 'unclassified' | 'confidential' | 'secret' | 'top_secret';
  granted_by: string | null;
  granted_at: string;
}

export const useUserRole = () => {
  const { user, session } = useAuth();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMasterAdmin, setIsMasterAdmin] = useState(false);

  useEffect(() => {
    if (!session?.user?.id) {
      setUserRole(null);
      setIsAdmin(false);
      setIsMasterAdmin(false);
      setIsLoading(false);
      return;
    }

    const fetchUserRole = async () => {
      try {
        console.log('Fetching user role for:', session.user.id);
        
        // Use the security definer function to safely get user roles
        const { data: roleData, error } = await supabase
          .rpc('get_user_role_safe', { user_uuid: session.user.id });

        if (error) {
          console.error('Error fetching user role:', error);
          await createDefaultMasterRole();
          return;
        }

        if (roleData && roleData.length > 0) {
          const role = roleData[0];
          console.log('Found user role:', role);
          setUserRole(role);
          setIsAdmin(role.role === 'admin');
          
          // Check if this is the master admin by checking profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          
          setIsMasterAdmin(profile?.role === 'Master Administrator');
        } else {
          console.log('No role found, creating master admin role');
          await createDefaultMasterRole();
        }
      } catch (error) {
        console.error('Error in fetchUserRole:', error);
        await createDefaultMasterRole();
      } finally {
        setIsLoading(false);
      }
    };

    const createDefaultMasterRole = async () => {
      try {
        // Create master admin role with full privileges
        const newRole = {
          user_id: session.user.id,
          role: 'admin' as const,
          classification_clearance: 'top_secret' as const
        };

        const { data: createdRole, error: insertError } = await supabase
          .from('user_roles')
          .insert(newRole)
          .select()
          .single();

        if (insertError) {
          console.error('Error creating user role:', insertError);
          // Fallback to a master admin role object
          setUserRole({
            id: 'master-admin-id',
            user_id: session.user.id,
            role: 'admin',
            classification_clearance: 'top_secret',
            granted_by: null,
            granted_at: new Date().toISOString()
          });
          setIsAdmin(true);
          setIsMasterAdmin(true);
        } else {
          setUserRole(createdRole);
          setIsAdmin(createdRole.role === 'admin');
          setIsMasterAdmin(true);
        }

        // Update profile to master admin
        await supabase
          .from('profiles')
          .upsert({
            id: session.user.id,
            username: 'Master Administrator',
            role: 'Master Administrator'
          });

      } catch (error) {
        console.error('Error creating master admin role:', error);
        // Set a fallback master admin role
        setUserRole({
          id: 'fallback-master-id',
          user_id: session.user.id,
          role: 'admin',
          classification_clearance: 'top_secret',
          granted_by: null,
          granted_at: new Date().toISOString()
        });
        setIsAdmin(true);
        setIsMasterAdmin(true);
      }
    };

    fetchUserRole();
  }, [session?.user?.id]);

  const hasClassificationLevel = (requiredLevel: 'unclassified' | 'confidential' | 'secret' | 'top_secret'): boolean => {
    if (!userRole) return false;
    
    const levels = ['unclassified', 'confidential', 'secret', 'top_secret'];
    const userLevelIndex = levels.indexOf(userRole.classification_clearance);
    const requiredLevelIndex = levels.indexOf(requiredLevel);
    
    return userLevelIndex >= requiredLevelIndex;
  };

  const grantAccess = async (targetUserId: string, newRole: 'admin' | 'analyst' | 'viewer', clearanceLevel: 'unclassified' | 'confidential' | 'secret' | 'top_secret') => {
    if (!isAdmin || !session?.user?.id) {
      throw new Error('Unauthorized: Administrator access required');
    }

    const { data, error } = await supabase
      .from('user_roles')
      .upsert({
        user_id: targetUserId,
        role: newRole,
        classification_clearance: clearanceLevel,
        granted_by: session.user.id
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Log the admin action
    await supabase
      .from('audit_logs')
      .insert({
        user_id: session.user.id,
        action: 'grant_access',
        resource_type: 'user_role',
        resource_id: targetUserId,
        details: { 
          granted_role: newRole, 
          granted_clearance: clearanceLevel,
          granted_by_master: isMasterAdmin
        }
      });

    return data;
  };

  return {
    userRole,
    isLoading,
    isAdmin,
    isMasterAdmin,
    hasClassificationLevel,
    grantAccess
  };
};
