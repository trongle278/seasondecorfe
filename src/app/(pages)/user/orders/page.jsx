"use client";

import { UserWrapper } from "../components/UserWrapper";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

const categories = [
  {
    name: "All",
    posts: [
      {
        id: 1,
        title: "Does drinking coffee make you smarter?",
        date: "5h ago",
        commentCount: 5,
        shareCount: 2,
      },
      {
        id: 2,
        title: "So you've bought coffee... now what?",
        date: "2h ago",
        commentCount: 3,
        shareCount: 2,
      },
    ],
  },
  {
    name: "To Pay",
    posts: [
      {
        id: 1,
        title: "Is tech making coffee better or worse?",
        date: "Jan 7",
        commentCount: 29,
        shareCount: 16,
      },
      {
        id: 2,
        title: "The most innovative things happening in coffee",
        date: "Mar 19",
        commentCount: 24,
        shareCount: 12,
      },
    ],
  },
  {
    name: "To Ship",
    posts: [
  
    ],
  },
  {
    name: "To Receive",

    posts: [
   
    ],
  },
  {
    name: "Completed",
    posts: [
  
    ],
  },
  {
    name: "Cancelled",
    posts: [
   
    ],
  },
  {
    name: "Return Refund",
    posts: [
      
    ],
  },
];

const UserOrder = () => {
  return (
    <UserWrapper>
      <div className="flex h-screen w-full">
        <div className="flex w-full justify-evenly">
          <TabGroup>
            <TabList className="flex gap-base border-b-[1px] pb-9">
              {categories.map(({ name }) => (
                <Tab
                  key={name}
                  className="rounded-full py-1 px-3 font-semibold text-lg focus:outline-none 
                 data-[selected]:border-b-[2px] data-[selected]:border-red
                 data-[hover]:bg-white/5 
                 data-[selected]:data-[hover]:bg-white/10 
                 data-[focus]:outline-1 data-[focus]:outline-white"
                >
                  {name}
                </Tab>
              ))}
            </TabList>
            <TabPanels className="mt-3">
              {categories.map(({ name, posts }) => (
                <TabPanel key={name} className="rounded-xl bg-white/5 p-3">
                  <ul>
                    {posts.map((post) => (
                      <li
                        key={post.id}
                        className="relative rounded-md text-sm/6 transition hover:bg-white/5"
                      >
                        <a href="#" className="font-semibold">
                          <span className="absolute inset-0" />
                          {post.title}
                        </a>
                        <ul
                          className="flex gap-2"
                          aria-hidden="true"
                        >
                          <li>{post.date}</li>
                          <li aria-hidden="true">&middot;</li>
                          <li>{post.commentCount} comments</li>
                          <li aria-hidden="true">&middot;</li>
                          <li>{post.shareCount} shares</li>
                        </ul>
                      </li>
                    ))}
                  </ul>
                </TabPanel>
              ))}
            </TabPanels>
          </TabGroup>
        </div>
      </div>
    </UserWrapper>
  );
};

export default UserOrder;
