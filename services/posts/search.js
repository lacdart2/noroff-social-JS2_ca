/**
 * @file Search posts service
 * Uses Noroff /social/posts/search?q=
 */
import { apiClient } from "../../utils/apiHelpers.js";

export async function searchPosts(q, {
    page = 1,
    limit = 20,
    includeAuthor = true,
    includeComments = false,
    includeReactions = true,
} = {}) {
    const params = new URLSearchParams({
        q,
        page: String(page),
        limit: String(limit),
    });
    if (includeAuthor) params.append("_author", "true");
    if (includeComments) params.append("_comments", "true");
    if (includeReactions) params.append("_reactions", "true");

    const { data } = await apiClient(`/social/posts/search?${params.toString()}`);
    console.log(data)
    return data;
}
