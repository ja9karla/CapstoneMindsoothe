<?php
include 'connect.php';
session_start();

if (isset($_POST['reset'])) {
    $newPassword = $_POST['newPassword'];
    $confirmPassword = $_POST['confirmPassword'];

    // Check if passwords match
    if ($newPassword !== $confirmPassword) {
        echo "Passwords do not match!";
        exit();
    }

    $newPasswordHashed = md5($newPassword); // Encrypt the new password
    $email = $_SESSION['email'];

    // Update the password in the database
    $updatePassword = "UPDATE usersacc SET password='$newPasswordHashed' WHERE email='$email'";
    if ($conn->query($updatePassword) === TRUE) {
        echo "Password has been reset. Please log in.";
        // Clear the session
        session_unset();
        session_destroy();
        header("Location: Login.html");
        exit();
    } else {
        echo "Error updating password: " . $conn->error;
    }
}
?>