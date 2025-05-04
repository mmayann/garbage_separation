"use client";

import React from "react";
import { useState } from "react";
import { AlertCircle, X } from "lucide-react";
import { useLanguage } from "../contexts/language-context";
import { Navigation } from "../components/navigation";
import { Footer } from "../components/ui/footer";

interface NoticeItem {
  id: number;
  title: string;
  date: string;
  content: string;
  note?: string; 
}

const mockNotices: NoticeItem[] = [
  {
    id: 1,
    title: "Old clothes collection",
    date: "2025/4/18",
    content: `We collect used clothing.
    Please check the designated collection locations for each area.`,
  },
  {
    id: 2,
    title: "Large garbage",
    date: "2025/4/1",
    content: "Information regarding the collection of large-sized garbage.",
    note: "*Advance application required (door-to-door collection)",
  },
  {
    id: 3,
    title: "Battery collection",
    date: "2025/3/25",
    content: `Notice regarding battery collection
    Lighter Collection Information 
    Collection is free of charge.
    Instructions:
    1.Ensure that lighters are empty.
    2.Place the empty lighters in an ordinary transparent or semi-transparent bag.
    3.Place the bag at the waste collection station by 8:30 a.m. on the day of collection.`,
  },
  {
    id: 4,
    title: "Resource garbage",
    date: "2025/3/15",
    content: "Information regarding collection days for recyclable waste.",
  },
];

export default function Page() {
  const { t } = useLanguage();

  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);

  const handleNoticeClick = (notice: NoticeItem) => {
    setSelectedNotice(notice);
  };

  const handleCloseModal = () => {
    setSelectedNotice(null);
  };

  return (
    <div>
      <Navigation />
      <div className="max-w-2xl mx-auto p-4">
        {/* ヘッダー部分 - 黄色い丸とタイトル */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-white">
            <AlertCircle size={18} />
          </div>
          <h1 className="text-base">{t("result.NoticeTitle")}</h1>
        </div>

        <div className="border-t border-gray-200 text-sm">
          {mockNotices.map((notice) => (
            <div
              key={notice.id}
              className="cursor-pointer border-b border-gray-200 hover:bg-gray-50 transition-colors"
              onClick={() => handleNoticeClick(notice)}
            >
              <div className="flex flex-col sm:flex-row py-1">
                {/* 日付部分 */}
                <div className="w-full sm:w-32 text-gray-600 font-medium">
                  {notice.date}
                </div>
                {/* タイトル部分 - 水色の背景 */}
                <div className="flex-1">
                  <div className="bg-sky-50 px-3 py-2 rounded-sm">
                    <span className="font-medium">{notice.title}</span>
                    {notice.note && (
                      <span className="ml-2 text-sm text-gray-600">
                        {notice.note}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* モーダル */}
        {selectedNotice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">{selectedNotice.title}</h2>
                {/* <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={20} />
                </button> */}
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {selectedNotice.date}
              </p>
              <div className="border-t pt-4">
                <p>{selectedNotice.content}</p>
                {selectedNotice.note && (
                  <p className="mt-2 text-sm text-gray-600">
                    {selectedNotice.note}
                  </p>
                )}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                  onClick={handleCloseModal}
                >
                  close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
    
  );
}
