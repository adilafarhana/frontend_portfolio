<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login</title>
    <style>
        body { font-family: system-ui, sans-serif; background: #f3f4f6; color: #111827; margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
        .card { width: min(420px, calc(100vw - 32px)); padding: 32px; border-radius: 18px; background: white; box-shadow: 0 18px 50px rgba(15, 23, 42, 0.12); }
        h1 { margin: 0 0 20px; font-size: 24px; }
        .field { margin-bottom: 16px; }
        .field label { display: block; margin-bottom: 6px; font-weight: 600; }
        .field input { width: 100%; padding: 12px 14px; border: 1px solid #d1d5db; border-radius: 12px; font-size: 15px; }
        .button { width: 100%; padding: 12px 14px; border: none; border-radius: 12px; background: #2563eb; color: white; font-size: 15px; cursor: pointer; }
        .button:hover { background: #1d4ed8; }
        .message { margin-bottom: 16px; color: #991b1b; }
        .footer { margin-top: 20px; font-size: 14px; color: #6b7280; }
        .footer a { color: #2563eb; text-decoration: none; }
    </style>
</head>
<body>
    <div class="card">
        <h1>Admin Login</h1>

        @if ($errors->any())
            <div class="message">
                <strong>Unable to log in.</strong>
                <ul style="margin: 8px 0 0; padding-left: 18px;">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form method="POST" action="{{ route('admin.login.submit') }}">
            @csrf

            <div class="field">
                <label for="email">Email</label>
                <input id="email" type="email" name="email" value="{{ old('email') }}" required autofocus autocomplete="username">
            </div>

            <div class="field">
                <label for="password">Password</label>
                <input id="password" type="password" name="password" required autocomplete="current-password">
            </div>

            <div class="field" style="display:flex; align-items:center; gap:8px;">
                <input id="remember" type="checkbox" name="remember"{{ old('remember') ? ' checked' : '' }}>
                <label for="remember" style="margin:0;">Remember me</label>
            </div>

            <button type="submit" class="button">Sign in</button>
        </form>

        <p class="footer">
            Use <strong>test@example.com</strong> and your password seeded in the database.
        </p>
    </div>
</body>
</html>
