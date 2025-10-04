<?php
session_start();

// Jika user sudah login, redirect ke dashboard
if (isset($_SESSION['username'])) {
    header("Location: dashboard.php");
    exit();
}

// Hardcoded username dan password
$valid_username = "riyadi";
$valid_password = "074";

$error = "";

// Proses login jika form disubmit
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    
    // Validasi input
    if (empty($username) || empty($password)) {
        $error = "Username and password are required!";
    } else if ($username === $valid_username && $password === $valid_password) {
        // Login berhasil
        $_SESSION['username'] = $username;
        header("Location: dashboard.php");
        exit();
    } else {
        // Login gagal
        $error = "Invalid username or password!";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - AnimeList</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
    <style>
        .login-container {
            max-width: 400px;
            margin: 100px auto;
            padding: 2rem;
            background-color: var(--card-bg);
            border-radius: 16px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .login-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .form-group label {
            font-weight: 600;
            color: var(--text-color);
        }
        
        .form-group input {
            padding: 0.75rem;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            background-color: var(--bg);
            color: var(--text-color);
            font-family: 'Poppins', sans-serif;
        }
        
        .form-group input:focus {
            outline: none;
            border-color: var(--accent-color);
            box-shadow: 0 0 0 3px rgba(var(--accent-rgb), 0.2);
        }
        
        .submit-button {
            padding: 0.75rem;
            background-color: var(--accent-color);
            color: white;
            border: none;
            border-radius: 8px;
            font-family: 'Poppins', sans-serif;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            margin-top: 1rem;
        }
        
        .submit-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(var(--accent-rgb), 0.3);
        }
        
        .error-message {
            color: #ef4444;
            background-color: rgba(239, 68, 68, 0.1);
            padding: 0.75rem;
            border-radius: 8px;
            text-align: center;
            display: <?php echo $error ? 'block' : 'none'; ?>;
            margin-bottom: 1rem;
        }
        
        .form-title {
            text-align: center;
            margin-bottom: 1.5rem;
            color: var(--text-color);
        }
        
        .form-title h1 {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }
        
        .form-title p {
            color: var(--text-soft-color);
        }

        .dashboard-link {
            text-align: center;
            margin-top: 1rem;
        }

        .dashboard-link a {
            color: var(--accent-color);
            text-decoration: none;
            font-weight: 600;
        }

        .dashboard-link a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="container">
            <a href="dashboard.php" class="logo">AnimeList</a>
            <button id="theme-toggle" class="theme-button">🌙</button>
        </div>
    </header>

    <main class="container">
        <div class="login-container">
            <div class="form-title">
                <h1>Login</h1>
                <p>Welcome to AnimeList Dashboard</p>
            </div>
            
            <div class="error-message"><?php echo $error; ?></div>
            
            <form class="login-form" method="POST">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" placeholder="Enter your username" required>
                </div>
                
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" placeholder="Enter your password" required>
                </div>
                
                <button type="submit" class="submit-button">Login</button>
            </form>

            <div class="dashboard-link">
                <a href="dashboard.php">Back Dashboard</a>
            </div>
        </div>
    </main>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 AnimeList. A project by PT. TAMPOSO SEHAT SEHAT NGODINGNYA.</p>
        </div>
    </footer>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const themeToggle = document.getElementById('theme-toggle');
            const body = document.body;

            const applyTheme = (theme) => {
                if (theme === 'dark') {
                    body.classList.add('dark-mode');
                    themeToggle.textContent = '☀️';
                } else {
                    body.classList.remove('dark-mode');
                    themeToggle.textContent = '🌙';
                }
            };

            const savedTheme = localStorage.getItem('theme') || 'light';
            applyTheme(savedTheme);

            themeToggle.addEventListener('click', () => {
                const newTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
                applyTheme(newTheme);
                localStorage.setItem('theme', newTheme);
            });
        });
    </script>
</body>
</html>

