import crypto from "crypto";

userSchema.methods.getResetPasswordToken = function ()  {
    const otp = Math.floor(100000 + Math.random() * 900000);

    const hashedOtp = crypto
        .createHash("sha256")
        .update(otp.toString())
        .digest("hex");
    
    this.resetPasswordToken = hashedOtp; 
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return otp.toString(); 
};
