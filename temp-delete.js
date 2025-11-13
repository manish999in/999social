// temp-delete.js or inside your existing route file

router.get("/delete-manish-posts", async (req, res) => {
  try {
    const users = await User.find({
      username: { $in: ["manish9", "manish999"] }
    });

    await Post.deleteMany({
      user: { $in: users.map(u => u._id) }
    });

    res.send("Deleted all posts of manish9 and manish999");
  } catch (err) {
    res.status(500).send(err.message);
  }
});
