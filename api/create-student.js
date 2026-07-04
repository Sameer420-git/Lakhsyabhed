import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 1. Check if environment variables actually exist
    if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase Environment Variables on Vercel.");
    }

    // 2. Initialize the Secure Admin Client
    const supabaseAdmin = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { email, password, name, batch } = req.body;

    // 3. Silently create the auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true 
    });

    if (authError) throw authError;

    // 4. Insert their custom data into the profiles table
    const { error: profileError } = await supabaseAdmin.from('profiles').insert([
      { 
        id: authData.user.id, 
        name: name, 
        role: 'student', 
        batch: batch,
        status: 'Active'
      }
    ]);

    if (profileError) throw profileError;

    // Success!
    return res.status(200).json({ success: true, message: 'Student created securely' });

  } catch (error) {
    // This intercepts the crash and sends a clean JSON error back to your React modal
    console.error("Backend Error:", error);
    return res.status(400).json({ error: error.message });
  }
}