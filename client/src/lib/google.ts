export const getGoogleAuthUrl = () => {
    const baseUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
        redirect_uri: import.meta.env.VITE_REDIRECT_URL as string,
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID as string,
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email"
        ].join(" ")
    }
    const qs = new URLSearchParams(options);
    return `${baseUrl}?${qs.toString()}`;
    // const width = 450;
    // const height = 600;
    // const left = window.innerWidth / 2 - width / 2;
    // const top = window.innerHeight / 2 - height / 2;
    // window.open(`${baseUrl}?${qs.toString()}`, '_blank', `width=${width},height=${height},left=${left},top=${top}`);
}