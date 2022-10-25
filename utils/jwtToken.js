require('dotenv').config();

const sendToken = async (user, statusCode, res) => {
  const token = user.getJWTToken();

  const options = {
    expires: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    withCredentials: true,
  };

  return res.cookie("token", token, options).status(statusCode).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendToken;