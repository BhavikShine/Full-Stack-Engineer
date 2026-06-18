const { createAuthenticatedClient } = require('../config/supabase');

async function createPost({ title, userId, accessToken }) {
  const client = createAuthenticatedClient(accessToken);

  const { data, error } = await client
    .from('posts')
    .insert({ title, user_id: userId })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function getUserPosts({ userId, accessToken, page = 1, limit = 10 }) {
  const client = createAuthenticatedClient(accessToken);

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await client
    .from('posts')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    throw error;
  }

  const total = count || 0;

  return {
    posts: data,
    pagination: {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit) || 0,
    },
  };
}

module.exports = { createPost, getUserPosts };
