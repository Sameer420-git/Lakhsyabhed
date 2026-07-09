import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase Environment Variables.");
    }

    const supabaseAdmin = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { email, password, name, batch } = req.body;

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true 
    });

    if (authError) throw authError;

    const { error: profileError } = await supabaseAdmin.from('profiles').insert([
      { 
        id: authData.user.id, 
        name: name, 
        role: 'student', 
        batch: batch,
        status: 'Active',           // FIXED: Added comma!
        plain_password: password,   // NEW: Saves the visible password
        dob: req.body.dob,
        contact_no: req.body.contact_no,
        father_name: req.body.father_name,
        father_contact: req.body.father_contact,
        address: req.body.address
      }
    ]);

    if (profileError) throw profileError;

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("Backend Error:", error);
    return res.status(400).json({ error: error.message });
  }
}