
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
      setUserRole(null);
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    const fetchUserRole = async () => {
      try {
        console.log('Fetching user role for:', session.user.id);
        
        // Try to fetch from database
        const { data: roleData, error } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching user role:', error);
          setIsLoading(false);
          return;
        }

        if (roleData) {
          console.log('Found user role:', roleData);
          setUserRole(roleData);
          setIsAdmin(roleData.role === 'admin');
        } else {
          console.log('No role found, creating default role');
          // Create default role if none exists
          const newRole = {
            user_id: session.user.id,
            role: 'analyst' as const,
            classification_clearance: 'secret' as const // Better default access
          };

          const { data: createdRole, error: insertError } = await supabase
            .from('user_roles')
            .insert(newRole)
            .select()
            .single();

          if (insertError) {
            console.error('Error creating user role:', insertError);
            // Fallback to a default role object
            setUserRole({
              id: 'temp-id',
              user_id: session.user.id,
              role: 'analyst',
              classification_clearance: 'secret',
              granted_by: null,
              granted_at: new Date().toISOString()
            });
          } else {
            setUserRole(createdRole);
          }
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error in fetchUserRole:', error);
        // Set a fallback role to prevent the app from breaking
        setUserRole({
          id: 'fallback-id',
          user_id: session.user.id,
          role: 'analyst',
          classification_clearance: 'secret',
          granted_by: null,
          granted_at: new Date().toISOString()
        });
        setIsAdmin(false);
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
