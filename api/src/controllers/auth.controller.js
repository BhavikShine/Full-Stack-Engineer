const authService = require('../services/auth.service');

function formatAuthResponse(user, accessToken = null) {
  const response = {
    user_id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name || null,
  };

  if (accessToken) {
    response.access_token = accessToken;
  }

  return response;
}

async function register(req, res) {
  try {
    const { full_name, email, password, confirm_password } = req.body;

    if (!full_name || typeof full_name !== 'string' || !full_name.trim()) {
      return res.status(400).json({ error: 'Full name is required' });
    }

    if (!email || !password || !confirm_password) {
      return res.status(400).json({ error: 'Email, password, and confirm password are required' });
    }

    if (password !== confirm_password) {
      return res.status(400).json({ error: 'Password and confirm password do not match' });
    }

    const user = await authService.register({
      fullName: full_name.trim(),
      email,
      password,
    });

    return res.status(201).json(formatAuthResponse(user));
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const data = await authService.login({ email, password });

    return res.status(200).json(
      formatAuthResponse(data.user, data.session.access_token)
    );
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
}

module.exports = { register, login };
