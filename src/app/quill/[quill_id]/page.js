export default async function Page({ params }) {
  const { quill_id } = params;

  try {
      // Construct the full API URL
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/writings/${quill_id}`;

      // Fetching the writing details using quill_id
      const response = await fetch(apiUrl);

      if (!response.ok) {
          throw new Error("Failed to fetch writing details");
      }

      const writing = await response.json();

      return (
          <div>
              <h1>{writing.title}</h1>
              <p>{writing.body}</p>
              <div>Category: {writing.category}</div>
              <div>Created At: {new Date(writing.createdAt).toLocaleString()}</div>
              <div>
                  Ratings:
                  <ul>
                      <li>Average Rating: {writing.averageRating}</li>
                      <li>Total Ratings: {writing.totalRatings}</li>
                  </ul>
              </div>
              <div>Comments: {writing.comments.length}</div>
              {writing.images && (
                  <div>
                      <h2>Preview Images:</h2>
                      <img src={writing.images.small} alt="Small Preview" className="max-w-full" />
                      <img src={writing.images.medium} alt="Medium Preview" className="max-w-full" />
                      <img src={writing.images.large} alt="Large Preview" className="max-w-full" />
                  </div>
              )}
          </div>
      );
  } catch (error) {
      return <div>Error: {error.message}</div>;
  }
}
