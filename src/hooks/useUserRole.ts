
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
        // First check localStorage for admin role (set during setup)
        const adminRoleString = localStorage.getItem('adminRole');
        const userRoleString = localStorage.getItem('userRole');
        const isAdminStored = localStorage.getItem('isAdmin') === 'true';
        
        if (adminRoleString && session.user.id) {
          try {
            const adminRole = JSON.parse(adminRoleString);
            if (adminRole.user_id === session.user.id) {
              console.log('Found admin role in localStorage:', adminRole);
              setUserRole(adminRole);
              setIsAdmin(true);
              setIsLoading(false);
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
              console.log('Found user role in localStorage:', storedRole);
              setUserRole(storedRole);
              setIsAdmin(storedRole.role === 'admin' || isAdminStored);
              setIsLoading(false);
              return;
            }
          } catch (e) {
            console.error('Error parsing user role from localStorage:', e);
          }
        }

        // If no localStorage role found, check database
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

        // If no role exists in database, create a default one
        if (!roleData) {
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
        } else {
          setUserRole(roleData);
          setIsAdmin(roleData.role === 'admin');
        }
      } catch (error) {
        console.error('Error in fetchUserRole:', error);
      } finally {
        setIsLoading(false);
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
