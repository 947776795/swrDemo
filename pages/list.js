import React, { useState } from "react";
import useSWRInfinite from "swr/infinite";
import Link from "next/link";

const fetcher = url => fetch(url).then(res => res.json());
const PAGE_SIZE = 6;

export default function List() {
  const [repo, setRepo] = useState("facebook/react");
  const [val, setVal] = useState(repo);

  const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(
    (index,a) => {
      console.log(index,a,'dddddd')
     return  `https://api.github.com/repos/${repo}/issues?per_page=${PAGE_SIZE}&page=${index +
      1}`
    },
    fetcher
  );

  console.log(data,'datadata')
  const issues = data ? [].concat(...data) : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE);
  const isRefreshing = isValidating && data && data.length === size;

  return (
    <div className="p-4" style={{ fontFamily: "sans-serif" }}>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        value={val}
        onChange={e => setVal(e.target.value)}
        placeholder="reactjs/react-a11y"
      />
      <button
        className="text-right block bg-blue-500 hover:bg-blue-700 text-white font-bold my-4 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={() => {
          setRepo(val);
          setSize(1);
        }}
      >
        load issues
      </button>
      <p>
        showing {size} page(s) of {isLoadingMore ? "..." : issues.length}{" "}
        issue(s){" "}
        <button
          className="text-right bg-blue-500 hover:bg-blue-700 text-white font-bold mr-4 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={isLoadingMore || isReachingEnd}
          onClick={() => setSize(size + 1)}
        >
          {isLoadingMore
            ? "loading..."
            : isReachingEnd
            ? "no more issues"
            : "load more"}
        </button>
        <button
          className="text-right bg-blue-500 hover:bg-blue-700 text-white font-bold mr-4 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={isRefreshing}
          onClick={() => mutate()}
        >
          {isRefreshing ? "refreshing..." : "refresh"}
        </button>
        <button
          className="text-right bg-blue-500 hover:bg-blue-700 text-white font-bold mr-4 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={!size}
          onClick={() => setSize(0)}
        >
          clear
        </button>
      </p>
      {isEmpty ? <p>Yay, no issues found.</p> : null}
      {issues.map((issue,index) => {
        return (
          <p key={issue.id} style={{ margin: "6px 0" }}>
            <Link
              legacyBehavior
              href={`${issue.id}/?id=${index}&title=${issue.title}`}
              prefetch={false}
            >
              {issue.title}
            </Link>
          </p>
        );
      })}
    </div>
  );
}
