const User = require('../schemas/user')
const { hashPassword, comparePassword } = require('../helpers/auth')
const jwt = require('jsonwebtoken')

//register endpoint
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        //check username
        if (!username) {
            return res.json({
                error: 'Username is required'
            })
        };
        if (username.length > 14) {
            return res.json({
                error: 'Username can only have 14 characters'
            })
        }
        const checkUsername = await User.findOne({ username })
            .collation({ locale: 'en', strength: 2 });  // Ensure case-insensitive query
        if (checkUsername) {
            return res.json({
                error: 'Username already taken'
            });
        }
        //check email
        if (!email) {
            return res.json({
                error: 'Email is required'
            })
        }
        if (email.length > 254) {
            return res.json({
                error: 'Email too big'
            })
        }
        const checkEmail = await User.findOne({ email })
        if (checkEmail) {
            return res.json({
                error: 'Email already used'
            })
        }
        //check password
        if (!password) {
            return res.json({
                error: 'Password is required'
            })
        }
        if (password.length < 6) {
            return res.json({
                error: 'Password should be at least 6 characters long'
            })
        };
        //hashPassword
        const hashedPassword = await hashPassword(password)
        //create user
        const user = await User.create({
            username, email, password: hashedPassword
        })

        return res.json(user)
    } catch (error) {
        console.log(error)
    }
}
//login endpoint
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({
                error: 'Invalid credentials'
            });
        }
        // Check password match
        const match = await comparePassword(password, user.password);
        if (match) {
            const token = jwt.sign(
                { email: user.email, id: user._id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }  // Ensure expiration time is set correctly
            );

            // Set token in cookie
            res.cookie('token', token, {
                httpOnly: true, // Ensures cookie is only accessible by the server
                secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                maxAge: 604800000
            }).json(user);  // Respond with user data
        } else {
            res.json({
                error: 'Invalid credentials'
            });
        }
    } catch (error) {
        console.error('Error logging in:', error); // Improved error logging
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//getprofile
const getProfile = (req, res) => {
    const { token } = req.cookies
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
            if (err) throw err;
            res.json(user)
        })
    } else {
        res.json(null)
    }
}
//logout
const logoutUser = (req, res) => {
    // Clear the token cookie
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',  // Use secure flag in production (HTTPS)
    });
    return res.json({ message: 'Logout successful' });
};
module.exports = {
    registerUser,
    loginUser,
    getProfile,
    logoutUser
}