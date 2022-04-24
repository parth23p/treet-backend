const { default: axios } = require("axios");
const { all } = require("../routes/post");

module.exports.getPosts = async (request, response, next) => {
  try {
    let uniqueOjects = new Set();
    let allPosts = [];
    let postTags = [];
    let urls = [];
    let { tags, sortBy, direction } = request.query;
    if (!tags || tags === null || tags.trim() === "") {
      return response
        .status(400)
        .json({ success: false, error: "Tags parameter is required" });
    }
    postTags = tags.split(",");

    if (sortBy) {
      const sortByValues = ["id", "reads", "likes", "popularity"];

      if (!sortByValues.includes(sortBy)) {
        return response
          .status(400)
          .json({ error: "sortBy parameter is invalid" });
      }
    } else {
      sortBy = "id";
    }

    if (direction) {
      const directionValues = ["asc", "desc"];

      if (!directionValues.includes(direction)) {
        return response
          .status(400)
          .json({ error: "Direction parameter is invalid" });
      }
    } else {
      direction = "asc";
    }

    for (let tag = 0; tag < postTags.length; tag++) {
      urls[tag] = axios.get(
        `https://api.hatchways.io/assessment/blog/posts?tag=${postTags[tag]}`
      );
    }

    const postData = await Promise.all(urls);
    let length = postData.length;

    for (let i = 0; i < length; i++) {
      for (let j = 0; j < postData[0].data.posts.length; j++) {
        const element = postData[0].data.posts[j];

        if (!uniqueOjects.has(element["id"])) {
          allPosts.push(element);
          uniqueOjects.add(element["id"]);
        }
      }
    }

    const reversed = direction === "asc" ? 1 : -1;
    allPosts.sort((a, b) => reversed * (a[sortBy] - b[sortBy]));

    return response.status(200).json({ posts: allPosts });
  } catch (error) {
    console.log("Server Error at controller/getPost -> Error : ", error);
    return response.status(500).json({ success: false, error: "Server Error" });
  }
};
