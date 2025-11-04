import User from "../models/user.model.js";

// Follow / Unfollow user
export const followUser = async (req, res) => {
  try {
    const userIdToFollow = req.params.id;
    const currentUserId = req.user.id;

    if (userIdToFollow === currentUserId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const userToFollow = await User.findById(userIdToFollow);
    const currentUser = await User.findById(currentUserId);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = currentUser.following.includes(userIdToFollow);

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== userIdToFollow
      );
      userToFollow.followers = userToFollow.followers.filter(
        (id) => id.toString() !== currentUserId
      );
      await currentUser.save();
      await userToFollow.save();
      return res.status(200).json({
        message: "User unfollowed",
        followingCount: currentUser.following.length,
      });
    } else {
      // Follow
      currentUser.following.push(userIdToFollow);
      userToFollow.followers.push(currentUserId);
      await currentUser.save();
      await userToFollow.save();
      return res.status(200).json({
        message: "User followed",
        followingCount: currentUser.following.length,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to follow/unfollow user", error: error.message });
  }
};

// Get followers
export const getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "followers",
      "username profilePic"
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Followers fetched", followers: user.followers });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch followers", error: error.message });
  }
};

// Get following
export const getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "following",
      "username profilePic"
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Following fetched", following: user.following });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch following", error: error.message });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("name username profilePic bio");
    res.status(200).json({ message: "Users fetched", users });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};
