
/**
 * @fileoverview Posts service for fetching all posts from Noroff API
 * @param {number} limit - Number of posts to fetch per page
 * @param {number} offset - Offset for pagination
 * @returns {Promise<Array>} Array of post objects
 * deletes a post by ID (authenticated).
 * @param {string} id
 * @returns {Promise<void>}
 */

import { apiClient } from "../utils/apiHelpers.js";


/* export async function fetchAllPosts(limit = 20, offset = 0) {
    const page = offset / limit + 1;
    return apiClient(
        `/social/posts?_reactions=true&_comments=true&_author=true&limit=${limit}&page=${page}`
    );
}
 */
/* export async function fetchAllPosts(limit = 100, offset = 0) {
    return apiClient(
        `/social/posts?limit=${limit}&offset=${offset}&_author=true&_comments=true&_reactions=true`
    );
} */


// fetch all posts (pagination,load more fn)
export async function fetchAllPosts(limit = 20, page = 1, offset = null) {
    let url = `/social/posts?limit=${limit}&page=${page}&_author=true&_comments=true&_reactions=true`;
    if (offset !== null) {
        page = offset / limit + 1;
        url = `/social/posts?limit=${limit}&page=${page}&_author=true&_comments=true&_reactions=true`;
    }

    return apiClient(url);
}



/**
 * fetch latest posts with author, reactions, and comments
 * @param {number} limit
 * @returns {Promise<Array>}
 */

// search posts (posts.js)
export async function searchPosts(
    q,
    {
        limit = 10,
        page = 1,
        includeAuthor = true,
        includeComments = false,
        includeReactions = true,
    } = {}
) {
    const params = new URLSearchParams({
        q: q || "",
        limit: String(limit),
        page: String(page),
    });
    if (includeAuthor) params.append("_author", "true");
    if (includeComments) params.append("_comments", "true");
    if (includeReactions) params.append("_reactions", "true");

    return apiClient(`/social/posts/search?${params.toString()}`);
}

/**
 * filter posts by tag
 * @param {string} tag
 * @param {Object} opts
 * @param {number} [opts.limit=20]
 * @param {number} [opts.page=1]
 * @param {boolean} [opts.includeAuthor=true]
 * @param {boolean} [opts.includeComments=false]
 * @param {boolean} [opts.includeReactions=true]
 * @returns {Promise<Array>} posts
 */

//filter post by TAG
export async function filterPostsByTag(
    tag,
    {
        limit = 20,
        page = 1,
        includeAuthor = true,
        includeComments = false,
        includeReactions = true,
    } = {}
) {
    const params = new URLSearchParams({
        _tag: tag,
        limit: String(limit),
        page: String(page),
    });

    if (includeAuthor) params.append("_author", "true");
    if (includeComments) params.append("_comments", "true");
    if (includeReactions) params.append("_reactions", "true");

    const res = await apiClient(`/social/posts?${params.toString()}`);
    return res.data;
}

// post by ID
export async function fetchPostById(id) {
    return apiClient(`/social/posts/${id}?_author=true&_comments=true&_reactions=true`);
}


// smart search
export async function smartSearchPosts(q, { limit = 20, page = 1 } = {}) {
    const [textRes, tagRes] = await Promise.allSettled([
        searchPosts(q, { limit, page, includeAuthor: true, includeReactions: true }),
        filterPostsByTag(q, { limit, page, includeAuthor: true, includeReactions: true }),
    ]);

    let results = [];

    if (textRes.status === "fulfilled" && Array.isArray(textRes.value)) {
        results = results.concat(textRes.value);
    }
    if (tagRes.status === "fulfilled" && Array.isArray(tagRes.value)) {
        results = results.concat(tagRes.value);
    }

    const seen = new Set();
    const unique = results.filter(post => {
        if (seen.has(post.id)) return false;
        seen.add(post.id);
        return true;
    });

    return unique;
}


// create post
export async function createPost(postData) {
    return apiClient("/social/posts", {
        method: "POST",
        body: JSON.stringify(postData),
    });
}

/**
 * update an existing post
 */

//update/edit post 
export async function updatePost(id, postData) {
    return apiClient(`/social/posts/${id}`, {
        method: "PUT",
        body: JSON.stringify(postData),
    });
}

/**
 * delete a post by ID
 */

//delete post
export async function deletePostById(id) {
    return apiClient(`/social/posts/${id}`, {
        method: "DELETE",
    });
}