const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET

async function recaptchaVerify (recaptcha) {

    if (!recaptcha) {
        return false;
    }

    try {
        const response = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `secret=${RECAPTCHA_SECRET}&response=${recaptcha}`,
        });

        if (!response.ok) {
            return false;
        }

        const data  = await response.json();

        if (!data.success) {
            return false
        }

        return true
        
    } catch (error) {
        return false
    }
}

module.exports = recaptchaVerify