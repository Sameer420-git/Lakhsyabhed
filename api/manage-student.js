import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const supabaseAdmin = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  try {
    // --- 1. DELETE STUDENT ---
    if (req.method === 'DELETE') {
      const { uid } = req.body;
      await supabaseAdmin.from('profiles').delete().eq('id', uid);
      await supabaseAdmin.auth.admin.deleteUser(uid);
      return res.status(200).json({ success: true });
    }

    // --- 2. UPDATE OPERATIONS ---
    if (req.method === 'PUT') {
      const { uid, action, newPassword, profileData, status } = req.body;

      // Suspend/Activate
      if (action === 'update_status') {
        await supabaseAdmin.from('profiles').update({ status }).eq('id', uid);
        return res.status(200).json({ success: true });
      }

      // Direct Password Reset
      if (action === 'reset_password') {
        await supabaseAdmin.auth.admin.updateUserById(uid, { password: newPassword });
        await supabaseAdmin.from('profiles').update({ plain_password: newPassword }).eq('id', uid);
        return res.status(200).json({ success: true });
      }

      // Edit Profile Fields
      if (action === 'edit_profile') {
        await supabaseAdmin.from('profiles').update(profileData).eq('id', uid);
        return res.status(200).json({ success: true });
      }
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}