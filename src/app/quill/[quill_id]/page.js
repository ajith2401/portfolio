export default async function Page({ params }) {
    const quill_id = (await params).quill_id
    return <div>My Post: {quill_id}</div>
  }