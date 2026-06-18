const { supabase, supabaseAdmin } = require('../config/supabase');

async function confirmUserByEmail(email) {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers();

  if (error) {
    throw error;
  }

  const user = data.users.find((u) => u.email === email);

  if (!user) {
    throw new Error('User not found');
  }

  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
    email_confirm: true,
  });

  if (updateError) {
    throw updateError;
  }
}

async function register({ fullName, email, password }) {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
    },
  });

  if (error) {
    throw error;
  }

  return data.user;
}

async function login({ email, password }) {
  let { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error?.message === 'Email not confirmed') {
    await confirmUserByEmail(email);
    ({ data, error } = await supabase.auth.signInWithPassword({ email, password }));
  }

  if (error) {
    throw error;
  }

  return data;
}

module.exports = { register, login };
