import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getComments } from "../../api";
import PostComment from "./PostComment";
import { deleteComment } from "../../api";

function Comments({ article_id, singleArticle, formattedData }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentCount, setCommentCount] = useState(singleArticle.comment_count);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    getComments(article_id).then((data) => {
      setComments(data);
      setLoading(false);
    });
  }, [article_id]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return comments === undefined ? (
    <h1>No comments found</h1>
  ) : (
    <>
      <div className="flex items-center gap-10 pt-2">
        <h1>{commentCount} Comments</h1>
      </div>
      <PostComment
        article_id={article_id}
        commentCount={commentCount}
        setCommentCount={setCommentCount}
        setDeleted={setDeleted}
      />
      {deleted ? <h1>Comment deleted...</h1> : null}
      {comments.map((comment) => {
        return (
          <div className="pt-10" key={comment.comment_id}>
            <div className="flex flex-col gap-2 p-2 max-w-5xl border-2 border-black border-solid rounded">
              <p className="font-bold">{comment.author}</p>
              <p>{comment.body}</p>
              <p>{comment.votes} votes</p>
              <p>{comment.created_at.slice(0, 19).replace("T", " ")}</p>
            </div>

            {comment.author === "grumpy19" ? (
              <button
                onClick={() => {
                  setDeleted(true);
                  setCommentCount(commentCount - 1);
                  deleteComment(comment.comment_id);
                  setComments(
                    comments.filter(
                      (comments) => comments.comment_id !== comment.comment_id
                    )
                  );
                  
                }}
              >
                Delete comment
              </button>
            ) : null}
          </div>
        );
      })}
    </>
  );
}

export default Comments;
