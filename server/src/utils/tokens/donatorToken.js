// Creating token and saving in cookie
const sendDonatorToken = (donator, statusCode, res) => {
    const donator_auth = donator.getJWTToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: true,            
        sameSite: 'strict',       
    };

    res.status(statusCode).cookie("donator_auth", donator_auth, options).json({
        success: true,
        donator,
        donator_auth,
    });
};

export default sendDonatorToken;