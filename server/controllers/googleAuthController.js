
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

const googleAuthController = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        msg: "Google credential is required"
      });
    }

    // 1. Ստուգում ենք Google ID token-ը
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    if (
      !payload?.sub ||
      !payload?.email ||
      !payload.email_verified
    ) {
      return res.status(401).json({
        msg: "Google account verification failed"
      });
    }

    // 2. Փնտրում ենք Google user-ին
    let user = await User.findOne({
      provider: "google",
      googleId: payload.sub
    });

    let isNewUser = false;

    if (!user) {
      // 3. Ստուգում ենք email-ի կրկնությունը
      const existingUser = await User.findOne({
        email: payload.email
      });

      if (existingUser) {
        return res.status(409).json({
          msg: "This email is already registered with another method"
        });
      }

      // 4. Ստեղծում ենք նոր Google user
      user = await User.create({
        username:
          payload.name || payload.email.split("@")[0],
        email: payload.email,
        image: payload.picture || "",
        provider: "google",
        googleId: payload.sub,
        emailVerified: true,
        role: "user"
      });

      isNewUser = true;
    }

    // 5. Ստեղծում ենք JWT access token
    const accessToken = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      process.env.SECRET,
      {
        expiresIn: "1d"
      }
    );

    // 6. Վերադարձնում ենք արդյունքը
    return res.status(200).json({
      msg: isNewUser
        ? "Google registration successful"
        : "Google login successful",
      isNewUser,
      accessToken,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        image: user.image,
        provider: user.provider,
        emailVerified: user.emailVerified,
        role: user.role
      }
    });

  } catch (error) {
    console.error("GOOGLE AUTH ERROR:", error);

    return res.status(401).json({
      msg: "Google authentication failed"
    });
  }
};

export default googleAuthController;
