async function verifyProfile() {
    try {
        // 1. Login
        console.log('Attempting login...');
        const loginResponse = await fetch('http://127.0.0.1:8000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test@test.com',
                password: '123456'
            })
        });

        const loginData = await loginResponse.json();

        if (!loginResponse.ok) {
            throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
        }

        const { token } = loginData;
        console.log('Login successful. Token received.');

        // 2. Get Profile
        console.log('Fetching profile...');
        const profileResponse = await fetch('http://127.0.0.1:8000/api/auth/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const profileData = await profileResponse.json();
        console.log('Profile Response:', profileData);

        if (profileResponse.ok && profileData.user) {
            console.log('✅ Verification PASSED: User profile fetched successfully.');
            console.log('User Role:', profileData.user.role_name);
        } else {
            console.error('❌ Verification FAILED: Invalid profile response.');
        }

    } catch (error) {
        console.error('❌ Verification FAILED:', error.message);
    }
}

verifyProfile();
