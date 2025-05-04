
import React from "react";
import { useVision } from "../contexts/vision-context";
import { getTrashIcon } from "../lib/icons";
import { TrashType } from "../contexts/trash-context";
import { useLanguage } from "../contexts/language-context";

export const VisionResult: React.FC = () => {
  const { t } = useLanguage();
  const { visionData } = useVision();

  // visionData が存在し、predictions プロパティが存在する場合のみキーを取得
  const keys = visionData?.predictions
    ? Object.keys(visionData.predictions)
    : [];

  if (!visionData) {
    return <div> </div>;
  }

  return (
    <div className="mt-10 mb-20">
      <div className="grid place-items-center">
        <div className="text-zinc-600 text-center mb-3">
        </div>{" "}
        <div className="text-4xl">
          {getTrashIcon(visionData.trash_category as TrashType)}
        </div>
        <div className="text-2xl mb-3 text-center">
          {visionData.trash_category}
        </div>
      </div>
      <div>
        <div className="flex justify-center mb-4">
          {keys.map((key) => (
            <div key={key} className="bg-[#f2fafc] my-1 px-3 mx-3 rounded-none">
              {key}?
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
