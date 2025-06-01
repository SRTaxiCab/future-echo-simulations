
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

  useEffect(() => {
    if (!session?.user?.id) {
      setIsLoading(false);
      return;
    }

    const fetchUserRole = async () => {
      try {
        // Try to fetch from database first
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (roleError && roleError.code !== 'PGRST116') {
          console.error('Error fetching user role:', roleError);
          setIsLoading(false);
          return;
        }

        if (roleData) {
          setUserRole(roleData);
          setIsAdmin(roleData.role === 'admin');
          setIsLoading(false);
          return;
        }

        // Fallback: Check localStorage for setup data (backwards compatibility)
        const adminRoleString = localStorage.getItem('adminRole');
        const userRoleString = localStorage.getItem('userRole');
        
        if (adminRoleString && session.user.id) {
          try {
            const adminRole = JSON.parse(adminRoleString);
            if (adminRole.user_id === session.user.id) {
              // Migrate localStorage role to database
              await migrateRoleToDatabase(adminRole);
              return;
            }
          } catch (e) {
            console.error('Error parsing admin role from localStorage:', e);
          }
        }

        if (userRoleString && session.user.id) {
          try {
            const storedRole = JSON.parse(userRoleString);
            if (storedRole.user_id === session.user.id) {
              // Migrate localStorage role to database
              await migrateRoleToDatabase(storedRole);
              return;
            }
          } catch (e) {
            console.error('Error parsing user role from localStorage:', e);
          }
        }

        // If no role exists anywhere, create a default one
        const { data: newRole, error: insertError } = await supabase
          .from('user_roles')
          .insert({
            user_id: session.user.id,
            role: 'analyst',
            classification_clearance: 'unclassified'
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating user role:', insertError);
          setIsLoading(false);
          return;
        }

        setUserRole(newRole);
        setIsAdmin(newRole.role === 'admin');
      } catch (error) {
        console.error('Error in fetchUserRole:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const migrateRoleToDatabase = async (localRole: any) => {
      try {
        const { data: newRole, error: insertError } = await supabase
          .from('user_roles')
          .insert({
            user_id: localRole.user_id,
            role: localRole.role,
            classification_clearance: localRole.classification_clearance,
            granted_by: localRole.granted_by
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error migrating role to database:', insertError);
          return;
        }

        setUserRole(newRole);
        setIsAdmin(newRole.role === 'admin');
        setIsLoading(false);

        // Clean up localStorage after successful migration
        localStorage.removeItem('adminRole');
        localStorage.removeItem('userRole');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('classificationClearance');
      } catch (error) {
        console.error('Error in migrateRoleToDatabase:', error);
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
      throw new Error('Unauthorized: Admin access required');
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
          granted_clearance: clearanceLevel 
        }
      });

    return data;
  };

  return {
    userRole,
    isLoading,
    isAdmin,
    hasClassificationLevel,
    grantAccess
  };
};
