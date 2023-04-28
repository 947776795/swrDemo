import { useEffect,useState } from 'react'
import { useRouter } from "next/router";
import useSWRInfinite from "swr/infinite";
import Link from "next/link";

const userList=[{},{},{},{}]

const fetcher = url => fetch(url).then(res => res.json());

export default function AboutPage(props) {
  const router = useRouter();
  const id = router.query?.id;

  const getKey=(index, previousPageData) => {
    console.log(index, previousPageData,'asdasdasd',id)
    if (!id) return null
    if (index === 0) return `/api/test?id=${id}`
    const nextToken = previousPageData.nextToken
    console.log(nextToken,'nextToken111111111',previousPageData,index)
    return `/api/test?id=${id}&nextToken=${nextToken}`
  }

  const { data,size,setSize,mutate } = useSWRInfinite(getKey,fetcher);

  console.log(data,'datadatadatadata')
  return (
    <div>
      <div className="hero">
        <h1 className="title">{router.query.id}</h1>
        <p className="p-4">{router.query.title}</p>
      </div>
      <button onClick={()=> setSize(size + 1)}>next</button>
      <br />
      <button onClick={() => setSize(0)}>clear</button>
      <br />
      {
        userList.map((item,index)=>{
          return (
            <Link
                legacyBehavior
                href={`zy/?id=${index}&title=pages`}
                prefetch={false}
            >
                {`  goto ${index} page   `}
            </Link>
          )      
        })
      }

    </div>
  );
}
