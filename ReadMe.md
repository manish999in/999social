✅ 1. Authentication (Done)

 Signup (with profile + cover upload)

 Login (JWT)

 Get current user (/me)

 Update profile (PUT /me)

 Middleware verifyToken

🔜 2. Posts API (Next step)

We’ll create:

POST /api/posts → create post (text + optional image/video)

GET /api/posts → get all posts (public feed)

GET /api/posts/:id → single post

DELETE /api/posts/:id → delete post (only owner)

PUT /api/posts/:id → edit post (optional)

GET /api/posts/user/:id → posts by a specific user

🔜 3. Likes & Comments System

Endpoints like:

POST /api/posts/:id/like

POST /api/posts/:id/comment

🔜 4. Followers System

Endpoints like:

POST /api/users/:id/follow

GET /api/users/:id/followers

GET /api/users/:id/following

🔜 5. Notifications (optional)

Store and fetch user activity notifications.

🔜 6. Chat / Messages (optional, later)

Real-time messaging with Socket.io.