<?php
session_start();
include("connect.php");

// Ensure the user is logged in
if (!isset($_SESSION['email'])) {
    header("Location: Login.html");
    exit();
}

// Define $isLoggedIn to true since user is logged in
$isLoggedIn = true;

// Get the user's information based on their email - Using prepared statement for security
$email = $_SESSION['email'];
$stmt = $conn->prepare("SELECT id, firstName, lastName, profile_image FROM Users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    $userId = $user['id']; // This is the user_id you will use for posts and other actions
    $fullName = htmlspecialchars($user['firstName'] . ' ' . $user['lastName']);
    $profileImage = $user['profile_image'] ? htmlspecialchars($user['profile_image']) : 'images/blueuser.svg';
    
    // Store user_id in session for use in other scripts
    $_SESSION['user_id'] = $userId;
} else {
    echo "<p>Error: User not found.</p>";
    exit();
}

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    $userId = $user['id'];
    $fullName = htmlspecialchars($user['firstName'] . ' ' . $user['lastName']);
    $profileImage = $user['profile_image'];
    
    $_SESSION['user_id'] = $userId;
    $_SESSION['profile_image'] = $profileImage; // Add this line
}

// Close the statement
$stmt->close();
?>