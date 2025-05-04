"use client";

import React from "react";
import { FaExclamationCircle } from "react-icons/fa";
import { useLanguage } from "../contexts/language-context";
import { useRouter } from "next/navigation";

// モックデータ
const mockIrregularComments = [
  { date: "2025/4/18", commentKey: "irregular.comment1" },
  { date: "2025/4/1", commentKey: "irregular.comment2" },
  { date: "2025/3/25", commentKey: "irregular.comment3" },
  { date: "2025/3/15", commentKey: "irregular.comment4" },
];

export default function IrregularComment() {
  const { t } = useLanguage();
  const router = useRouter();

  // 最新の3件を取得
  const latestComments = mockIrregularComments.slice(0, 3);

  return (
    <div>
      <div
        className="flex flex-row items-center ml-4 pb-2 cursor-pointer"
        onClick={() => router.push("/notice")}
      >
        <span className="text-amber-400 mr-1 -mt-1 ">
          <FaExclamationCircle size={25} />
        </span>
        <span className="text-base">{t("result.news")}</span>
      </div>
      <div className="rounded-md border boeder-[#f2fafc] py-2 pl-2 bg-[#f2fafc] flex flex-col mx-4">
        {latestComments.map((item, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-row items-center">
              <span className="text-sm font-medium">{item.date}</span>
              <span className="text-sm ml-5">{t(item.commentKey)}</span>
            </div>
            {index < latestComments.length - 1 && (
              <hr
                style={{ border: "1px solid #cbe8ed", margin: "8px 10px" }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}