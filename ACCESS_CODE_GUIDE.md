# Access Code System

## What is an Access Code?

An **access code** is a unique identifier you can set during registration that allows you to log in on any device without remembering your password. Think of it like a personal PIN or passkey.

## Benefits

✅ **Quick Login**: Enter just one code instead of username + password  
✅ **Multi-Device**: Same code works on all your devices  
✅ **Privacy**: No email or phone required  
✅ **Memorable**: Choose something meaningful to you  

## How to Set Up

### During Registration

1. Go to Access page
2. Enter your desired username
3. Enter a password (for backup login)
4. **Important**: Enter your custom access code
5. Click "Create Account"

**Example Access Codes:**
- `mizanuser2026`
- `accountable247`
- `consistent_muslim`
- `daily-tracker-001`

## How to Use

### Logging in with Access Code

1. Go to Access page
2. Enter your access code in the "Access code" field
3. Click "Enter"
4. Done! You're logged in.

### Logging in with Username/Password

If you forget your access code, you can always login with:
1. Your username
2. Your password

## Security Considerations

### ✅ DO:
- Choose a unique code others won't guess
- Keep it memorable but not too obvious
- Use a combination of letters, numbers, and hyphens

### ❌ DON'T:
- Use common words like "password" or "123456"
- Share your access code with others
- Write it somewhere public

## Access Code vs Password

| Feature | Access Code | Username + Password |
|---------|-------------|---------------------|
| Quick login | ✅ Yes | ❌ No |
| Unique to you | ✅ Yes | ✅ Yes |
| Can be reset | ❌ No* | ✅ Yes* |
| Required | ❌ Optional | ✅ Yes |

*Currently no self-service reset - would need data reset

## Forgot Your Access Code?

If you forget your access code:

1. **Use your username + password** to login
2. Currently no way to view/change access code after creation
3. As a last resort, reset all data in Settings (starts fresh)

## Technical Details

- Access codes are stored hashed in the database
- Must be unique across all users
- Case-sensitive
- No length limit, but keep it practical
- Only set during initial registration

## Best Practices

1. **Choose Wisely**: Set it during registration - can't change it later
2. **Write it Down**: Keep a backup somewhere safe
3. **Test It**: After registering, logout and try logging in with just the code
4. **Remember Your Password Too**: As a backup login method

## Example Flow

```
Device 1 (First time):
1. Register with username "Ali", password "******", code "ali-mizan-2026"
2. Complete daily check-ins

Device 2 (Later):
1. Go to Access page
2. Enter code: "ali-mizan-2026"
3. See all your progress synced!

Device 3 (Phone):
1. Enter code: "ali-mizan-2026"
2. Access anywhere!
```

## Privacy Note

Your access code is:
- ✅ Stored securely (hashed)
- ✅ Never shown to other users
- ✅ Not used for social features (there are none)
- ✅ Only for YOUR multi-device access

---

**Pro Tip:** Think of your access code during registration. It's your key to seamless multi-device accountability.
