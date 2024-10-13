# Firestore Setup and Data Addition Guide

...

## 5. Update Security Rules

1. In the Firebase Console, go to "Firestore Database" > "Rules" tab.
2. Update the rules to allow read access to everyone and write access to authenticated users:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /videos/{video} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. Click "Publish" to apply the new rules.

These rules allow anyone to read the videos but only authenticated users can write to the collection.

## 6. Set up Authentication

1. In the Firebase Console, go to "Authentication" in the left sidebar.
2. Click on the "Get started" button if you haven't set up authentication before.
3. In the "Sign-in method" tab, enable the "Email/Password" provider.
4. Add a new user for admin access:
   - Click on the "Users" tab.
   - Click "Add user".
   - Enter an email and password for the admin user.
   - Click "Add user" to create the account.

Now, let's update our application to include authentication for the admin panel.