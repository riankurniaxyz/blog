import React, { useRef } from "react";
import { useEffect, useState, useMemo, createContext, useContext } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "./firebase-config";
import { auth, provider } from "./firebase-config";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  getAuth,
} from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import Cookies from "universal-cookie";
import "./CommentForm.css";

const cookies = new Cookies();
const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

const commentsRef = collection(db, "comments");
const CommentsContext = createContext();

export default function Comments(props) {
  const { slugId } = props;
  const [comments, setComments] = useState([]);
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const [rootComments, setRootComments] = useState();

  const createRootComment = async (newComment, user, parentId) => {
    if (newComment === "" || user === "") return;
    await addDoc(commentsRef, {
      id: uuidv4(),
      text: newComment,
      createdAt: serverTimestamp(),
      user: user,
      slugId: slugId,
      parentId,
    });
  };

  const commentsByParentId = useMemo(() => {
    const group = {};
    comments.forEach(comment => {
      group[comment.parentId] ||= [];
      group[comment.parentId].push(comment);
    });
    return group;
  }, [comments]);

  useEffect(() => {
    setRootComments(commentsByParentId[null]);
  }, [commentsByParentId]);

  function toggleCommentsVisibility() {
    setIsCommentsVisible(!isCommentsVisible);
  }

  useEffect(() => {
    const queryComments = query(
      commentsRef,
      where("slugId", "==", slugId),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(queryComments, snapshot => {
      let comments = [];
      snapshot.forEach(doc => {
        comments.push({ ...doc.data(), id: doc.id });
      });
      setComments(comments);
    });
    return () => unsubscribe();
  }, []);

  return (
    <CommentsContext.Provider value={commentsByParentId}>
      <div className="comment-app">
        <CommentForm
          slugId={slugId}
          parentId={null}
          onSubmit={createRootComment}
        />
        {!isCommentsVisible && (
          <button
            className="btn-CommentsVisibility"
            onClick={toggleCommentsVisibility}
          >
            Load comments ...{" "}
          </button>
        )}
        {isCommentsVisible && rootComments !== undefined && (
          <div className="comments">
            {rootComments.map(comment => (
              <Comment comment={comment} />
            ))}
          </div>
        )}
      </div>
    </CommentsContext.Provider>
  );
}

function CommentForm(props) {
  const getUserName = () => {
    if (AnonymSignIn) {
      return cookies.get("user-token");
    } else {
      return "";
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), user => {
      unsubscribe();
      if (user) {
        setUser(getAuth().currentUser.displayName);
        cookies.set("auth-token", getAuth().currentUser.uid, {path: "/", expires: new Date(Date.now()+ 1000*60*60*24*365), sameSite:"none"})
      }
    });
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      cookies.set("auth-token", result.user.uid, {path:"/", expires: new Date(Date.now()+ 1000*60*60*24*365), sameSite:"none"});
      setIsGoogleSignIn(true);
      setUser(auth.currentUser.displayName);
    } catch (err) {
      console.error(err);
    }
  };

  const { slugId, parentId, onSubmit } = props;
  const [newComment, setNewComment] = useState("");
  const [isGoogleSignIn, setIsGoogleSignIn] = useState(
    cookies.get("auth-token")
  );
  const [AnonymSignIn, setAnonymSignIn] = useState(cookies.get("user-token"));
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(getUserName);
  const [isShowSigninOption, setIsShowSigninOption] = useState(false);
  const [isUserInputShow, setIsUserInputShow] = useState(false);

  useEffect(() => {
    if (isGoogleSignIn || AnonymSignIn) {
      setIsSignedIn(true);
    } else {
      setIsSignedIn(false);
    }
  }, [isGoogleSignIn, AnonymSignIn]);

  const signUserOut = async () => {
    await signOut(auth);
    cookies.remove("auth-token");
    setIsGoogleSignIn(false);
    cookies.remove("user-token");
    setAnonymSignIn(false);
    setUser("");
  };

  const createComment = async function (e) {
    e.preventDefault();
    if (user !== "" && !isGoogleSignIn) {
      cookies.set("user-token", user, {path:"/", expires: new Date(Date.now()+ 1000*60*60*24*365), sameSite:"lax"});
      setAnonymSignIn(user);
    }
    await onSubmit(newComment, user, parentId);
    setNewComment("");
  };

  return (
    <form className="new-message-form bg-skin-card" onSubmit={createComment}>
      <fieldset>
        <p>
          <textarea
            className="new-message-input"
            spellCheck="false"
            autoComplete="false"
            autoCapitalize="false"
            placeholder="Type your comment here..."
            onChange={e => setNewComment(e.target.value)}
            value={newComment}
          />
        </p>
        {isSignedIn ? (
          <div className="flex justify-between items-center">
            <div className="flex">
                      <svg
                        className="pr-1 mr-1"
                        fill="#000000"
                        viewBox="0 0 32 36"
                        id="icon"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <defs> </defs>{" "}
                          <path
                            id="_inner-path_"
                            data-name="<inner-path>"
                            fill="none"
                            d="M8.0071,24.93A4.9958,4.9958,0,0,1,13,20h6a4.9959,4.9959,0,0,1,4.9929,4.93,11.94,11.94,0,0,1-15.9858,0ZM20.5,12.5A4.5,4.5,0,1,1,16,8,4.5,4.5,0,0,1,20.5,12.5Z"
                          ></path>{" "}
                          <path d="M26.7489,24.93A13.9893,13.9893,0,1,0,2,16a13.899,13.899,0,0,0,3.2511,8.93l-.02.0166c.07.0845.15.1567.2222.2392.09.1036.1864.2.28.3008.28.3033.5674.5952.87.87.0915.0831.1864.1612.28.2417.32.2759.6484.5372.99.7813.0441.0312.0832.0693.1276.1006v-.0127a13.9011,13.9011,0,0,0,16,0V27.48c.0444-.0313.0835-.0694.1276-.1006.3412-.2441.67-.5054.99-.7813.0936-.08.1885-.1586.28-.2417.3025-.2749.59-.5668.87-.87.0933-.1006.1894-.1972.28-.3008.0719-.0825.1522-.1547.2222-.2392ZM16,8a4.5,4.5,0,1,1-4.5,4.5A4.5,4.5,0,0,1,16,8ZM8.0071,24.93A4.9957,4.9957,0,0,1,13,20h6a4.9958,4.9958,0,0,1,4.9929,4.93,11.94,11.94,0,0,1-15.9858,0Z"></path>{" "}
                          <rect
                            id="_Transparent_Rectangle_"
                            data-name="<Transparent Rectangle>"
                            fill="none"
                            width="32"
                            height="32"
                          ></rect>{" "}
                        </g>
                      </svg>
              {user}
              <div className="group relative">
                <button onClick={signUserOut}>
                  <svg
                    className="ml-1"
                    fill="#ffffff"
                    height="200px"
                    width="200px"
                    version="1.1"
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="90 -100 400 700"
                    xmlSpace="preserve"
                    stroke="#ffffff"
                    transform="matrix(-1, 0, 0, 1, 0, 0)"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <g>
                        {" "}
                        <polygon points="146.213,3.107 146.213,175.607 176.213,175.607 176.213,33.107 461.213,33.107 461.213,458.107 176.213,458.107 176.213,315.607 146.213,315.607 146.213,488.107 491.213,488.107 491.213,3.107 "></polygon>{" "}
                        <polygon points="318.713,260.607 318.713,230.607 57.427,230.607 91.82,196.213 70.607,175 0,245.607 70.607,316.213 91.82,295 57.426,260.607 "></polygon>{" "}
                      </g>{" "}
                    </g>
                  </svg>
                </button>
                <span className="pointer-events-none rounded-lg p-1 absolute bg-skin-black text-skin-white -top-9 -left-4 w-max opacity-0 transition-opacity group-hover:opacity-100">
                  Sign out
                </span>
              </div>
            </div>
            <button type="submit" className="send-button">
              Submit
            </button>
          </div>
        ) : (
          <div
            className={`flex ${
              isUserInputShow ? "justify-between" : "justify-end"
            }`}
          >
            <input
              className={`${isUserInputShow ? "" : "hidden"} left-form-footer`}
              type="text"
              id="uname"
              name="uname"
              onChange={e => setUser(e.target.value)}
              value={user}
              placeholder="Username"
            />

            <div>
              <div className="relative">
                <button
                  onBlur={() => {
                    setIsShowSigninOption(false);
                  }}
                  type="button"
                  className={`signin-btn flex-1 ${user === "" ? "" : "hidden"}`}
                  onClick={() => {
                    setIsShowSigninOption(!isShowSigninOption);
                  }}
                >
                  Sign In
                  <svg
                    width="24px"
                    viewBox="0 0 24.00 24.00"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="none"
                    strokeWidth="0.00024000000000000003"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="1"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <g>
                        {" "}
                        <path fill="none" d="M0 0h24v24H0z"></path>{" "}
                        <path
                          d="M12 15l-4.243-4.243 1.415-1.414L12 12.172l2.828-2.829 1.415 1.414z"
                          fill="#fff"
                        ></path>{" "}
                      </g>{" "}
                    </g>
                  </svg>
                </button>

                <div
                  tabIndex="0"
                  className={`${
                    isShowSigninOption ? "" : "hidden"
                  } absolute right-0 z-10 w-48 mt-1 origin-top-right bg-skin-card-muted rounded-md signin-options`}
                >
                  <div className="p-2">
                    <button
                      className="pl-2 text-sm"
                      onMouseDown={signInWithGoogle}
                    >
                      <svg
                        className="mr-1"
                        viewBox="0 0 60 50"
                        version="1.1"
                        id="svg4"
                        sodipodi:docname="1534129544(1).svg"
                        inkscape:version="1.3.2 (091e20ef0f, 2023-11-25, custom)"
                        xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
                        xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:svg="http://www.w3.org/2000/svg"
                      >
                        <defs id="defs1">
                          <path
                            id="a"
                            d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
                          />
                        </defs>
                        <clipPath id="b">
                          <use xlinkHref="#a" overflow="visible" id="use1" />
                        </clipPath>
                        <path
                          clipPath="url(#b)"
                          fill="#Ffffff"
                          d="M0 37V11l17 13z"
                          id="path1"
                        />
                        <path
                          clipPath="url(#b)"
                          fill="#fff"
                          d="M0 11l17 13 7-6.1L48 14V0H0z"
                          id="path2"
                        />
                        <path
                          clipPath="url(#b)"
                          fill="#fff"
                          d="M0 37l30-23 7.9 1L48 0v48H0z"
                          id="path3"
                        />
                        <path
                          clipPath="url(#b)"
                          fill="#fff"
                          d="M48 48L17 24l-4-3 35-10z"
                          id="path4"
                        />
                      </svg>
                      Sign in with Google
                    </button>

                    <button
                      className="mt-1 pl-2 text-sm"
                      onMouseDown={() => {
                        setIsUserInputShow(true);
                        setIsShowSigninOption(false);
                      }}
                    >
                      <svg
                        className="pr-1 mr-1"
                        fill="#000000"
                        viewBox="0 0 32 36"
                        id="icon"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <defs> </defs>{" "}
                          <path
                            id="_inner-path_"
                            data-name="<inner-path>"
                            fill="none"
                            d="M8.0071,24.93A4.9958,4.9958,0,0,1,13,20h6a4.9959,4.9959,0,0,1,4.9929,4.93,11.94,11.94,0,0,1-15.9858,0ZM20.5,12.5A4.5,4.5,0,1,1,16,8,4.5,4.5,0,0,1,20.5,12.5Z"
                          ></path>{" "}
                          <path d="M26.7489,24.93A13.9893,13.9893,0,1,0,2,16a13.899,13.899,0,0,0,3.2511,8.93l-.02.0166c.07.0845.15.1567.2222.2392.09.1036.1864.2.28.3008.28.3033.5674.5952.87.87.0915.0831.1864.1612.28.2417.32.2759.6484.5372.99.7813.0441.0312.0832.0693.1276.1006v-.0127a13.9011,13.9011,0,0,0,16,0V27.48c.0444-.0313.0835-.0694.1276-.1006.3412-.2441.67-.5054.99-.7813.0936-.08.1885-.1586.28-.2417.3025-.2749.59-.5668.87-.87.0933-.1006.1894-.1972.28-.3008.0719-.0825.1522-.1547.2222-.2392ZM16,8a4.5,4.5,0,1,1-4.5,4.5A4.5,4.5,0,0,1,16,8ZM8.0071,24.93A4.9957,4.9957,0,0,1,13,20h6a4.9958,4.9958,0,0,1,4.9929,4.93,11.94,11.94,0,0,1-15.9858,0Z"></path>{" "}
                          <rect
                            id="_Transparent_Rectangle_"
                            data-name="<Transparent Rectangle>"
                            fill="none"
                            width="32"
                            height="32"
                          ></rect>{" "}
                        </g>
                      </svg>
                      Anonym
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className={`send-button ${user === "" ? "hidden" : ""}`}
            >
              Submit
            </button>
          </div>
        )}
      </fieldset>
    </form>
  );
}

function Comment({ comment } = props) {
  const [isReplying, setIsReplying] = useState(false);
  const [areChildrenHidden, setAreChildrenHidden] = useState(false);
  const commentsByParentId = useContext(CommentsContext);
  const childComments = (commentsByParentId[comment.id] ||= []);
  const isRootComment = comment.parentId === null;

  const createReplyComment = async (newComment, user, parentId) => {
    if (newComment === "" || user === "") return;
    setIsReplying(!isReplying);
    await addDoc(commentsRef, {
      id: uuidv4(),
      text: newComment,
      createdAt: serverTimestamp(),
      user: user,
      slugId: comment.slugId,
      parentId,
    });
  };

  return (
    <div className={isRootComment ? "mt-5" : "ml-6"}>
      <div className="comment-box bg-skin-card">
        <div className="comment-header">
          <span className="name">{comment.user}</span>
          <span className="date">
            {comment.createdAt === null
              ? ""
              : dateFormatter.format(
                  new Date(Date.parse(comment.createdAt.toDate()))
                )}
          </span>
        </div>
        <div className="comment" key={comment.id}>
          {comment.text}
        </div>
        <div className="comment-footer">
          <button
            className="reply-button"
            onClick={() => {
              setIsReplying(!isReplying);
            }}
          >
            {" "}
            {isReplying ? "Cancel" : "Reply"}
          </button>
          <button
            className="getreplies-button"
            onClick={() => {
              setAreChildrenHidden(!areChildrenHidden);
            }}
          >
            {areChildrenHidden ? "Show Replies" : ""}
          </button>
        </div>

        {isReplying && (
          <div className="ml-3">
            <CommentForm
              slugId={comment.slugId}
              parentId={comment.id}
              onSubmit={createReplyComment}
            />
          </div>
        )}
      </div>
      <div
        className={`flex ${
          areChildrenHidden || childComments.length === 0 ? "hidden" : ""
        }`}
      >
        <button
          className="collapse-line"
          aria-label="Hide Replies"
          onClick={() => setAreChildrenHidden(true)}
        />
        <div className="flex-1">
          {childComments.length > 0 &&
            childComments.map(comment => <Comment comment={comment} />)}
        </div>
      </div>
    </div>
  );
}
