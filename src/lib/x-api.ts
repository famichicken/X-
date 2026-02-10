/**
 * X (Twitter) API v2 client functions for posting tweets and retrieving metrics.
 */

const X_API_BASE_URL = "https://api.x.com/2";

export interface PostTweetParams {
  text: string;
  accessToken: string;
}

export interface PostTweetResponse {
  data: {
    id: string;
    text: string;
  };
}

export interface TweetMetrics {
  data: {
    id: string;
    text: string;
    public_metrics: {
      retweet_count: number;
      reply_count: number;
      like_count: number;
      quote_count: number;
      bookmark_count: number;
      impression_count: number;
    };
    non_public_metrics?: {
      impression_count: number;
      url_link_clicks: number;
      user_profile_clicks: number;
    };
    organic_metrics?: {
      impression_count: number;
      retweet_count: number;
      reply_count: number;
      like_count: number;
      url_link_clicks: number;
      user_profile_clicks: number;
    };
  };
}

export class XApiError extends Error {
  public status: number;
  public code: string;
  public details: unknown;

  constructor(message: string, status: number, code: string, details?: unknown) {
    super(message);
    this.name = "XApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorBody: unknown;
    try {
      errorBody = await response.json();
    } catch {
      errorBody = await response.text();
    }

    const errorMessage =
      typeof errorBody === "object" &&
      errorBody !== null &&
      "detail" in errorBody
        ? (errorBody as { detail: string }).detail
        : `X API request failed with status ${response.status}`;

    const errorCode =
      typeof errorBody === "object" &&
      errorBody !== null &&
      "type" in errorBody
        ? (errorBody as { type: string }).type
        : "UNKNOWN_ERROR";

    throw new XApiError(errorMessage, response.status, errorCode, errorBody);
  }

  return response.json() as Promise<T>;
}

/**
 * Post a tweet using X API v2.
 *
 * @see https://developer.x.com/en/docs/twitter-api/tweets/manage-tweets/api-reference/post-tweets
 */
export async function postTweet(
  params: PostTweetParams
): Promise<PostTweetResponse> {
  const { text, accessToken } = params;

  if (!text || text.trim().length === 0) {
    throw new Error("Tweet text cannot be empty");
  }

  if (text.length > 280) {
    throw new Error(
      `Tweet text exceeds 280 characters (${text.length} characters)`
    );
  }

  const response = await fetch(`${X_API_BASE_URL}/tweets`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  return handleApiResponse<PostTweetResponse>(response);
}

/**
 * Get tweet metrics using X API v2.
 *
 * Retrieves public, non-public, and organic metrics for a specific tweet.
 * Non-public and organic metrics require the tweet to belong to the authenticated user.
 *
 * @see https://developer.x.com/en/docs/twitter-api/tweets/lookup/api-reference/get-tweets-id
 */
export async function getTweetMetrics(
  tweetId: string,
  accessToken: string
): Promise<TweetMetrics> {
  if (!tweetId || tweetId.trim().length === 0) {
    throw new Error("Tweet ID cannot be empty");
  }

  const metricsFields = [
    "public_metrics",
    "non_public_metrics",
    "organic_metrics",
  ].join(",");

  const url = new URL(`${X_API_BASE_URL}/tweets/${tweetId}`);
  url.searchParams.set("tweet.fields", metricsFields);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleApiResponse<TweetMetrics>(response);
}
