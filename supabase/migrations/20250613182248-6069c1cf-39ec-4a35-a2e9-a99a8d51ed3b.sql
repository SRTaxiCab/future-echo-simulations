
-- Create a security definer function to safely get user roles without RLS recursion
CREATE OR REPLACE FUNCTION public.get_user_role_safe(user_uuid uuid)
RETURNS TABLE(
  id uuid,
  user_id uuid,
  role user_role,
  classification_clearance classification_level,
  granted_by uuid,
  granted_at timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT ur.id, ur.user_id, ur.role, ur.classification_clearance, ur.granted_by, ur.granted_at
  FROM public.user_roles ur
  WHERE ur.user_id = user_uuid;
$$;

-- Create a simple function to check classification clearance
CREATE OR REPLACE FUNCTION public.get_user_clearance_safe(user_uuid uuid)
RETURNS classification_level
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT classification_clearance 
  FROM public.user_roles 
  WHERE user_id = user_uuid 
  LIMIT 1;
$$;

-- Create a function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_user_admin(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = user_uuid 
    AND role = 'admin'
  );
$$;

-- Drop existing problematic RLS policies on user_roles if they exist
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can manage their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;

-- Create simple, non-recursive RLS policies
CREATE POLICY "Users can view their own user_roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all user_roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (public.is_user_admin(auth.uid()));

CREATE POLICY "Admins can insert user_roles" 
  ON public.user_roles 
  FOR INSERT 
  WITH CHECK (public.is_user_admin(auth.uid()));

CREATE POLICY "Admins can update user_roles" 
  ON public.user_roles 
  FOR UPDATE 
  USING (public.is_user_admin(auth.uid()));
